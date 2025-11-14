import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { storagePut } from "./storage";
import { extractDocumentData } from "./documentExtraction";
import { generateDocumentPackage } from "./pdfGenerator";
import { getSmartGuidance } from "./aiGuidance";
import { invokeLLM } from "./_core/llm";
import { DOCUMENT_NAVIGATION_GUIDES } from "./paralegal-knowledge";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import Stripe from "stripe";
import { PRODUCTS } from "./products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  profile: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserProfile(ctx.user.id);
    }),
    
    upsert: protectedProcedure
      .input(z.object({
        selectedState: z.string().length(2).optional(),
        hasChildren: z.boolean().optional(),
        hasBusinessInterests: z.boolean().optional(),
        hasRealEstate: z.boolean().optional(),
        hasRetirementAccounts: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.upsertUserProfile({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),
  }),

  states: router({
    list: publicProcedure.query(async () => {
      return await db.getAllStateRequirements();
    }),
    
    get: publicProcedure
      .input(z.object({ stateCode: z.string().length(2) }))
      .query(async ({ input }) => {
        return await db.getStateRequirement(input.stateCode);
      }),
  }),

  documents: router({
    categories: protectedProcedure.query(async () => {
      return await db.getAllDocumentCategories();
    }),
    
    types: protectedProcedure.query(async ({ ctx }) => {
      return await db.getDocumentTypesForUser(ctx.user.id);
    }),
    
    typesByCategory: protectedProcedure
      .input(z.object({ categoryId: z.number() }))
      .query(async ({ input }) => {
        return await db.getDocumentTypesByCategory(input.categoryId);
      }),
    
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserDocumentsWithCategory(ctx.user.id);
    }),
    
    upload: protectedProcedure
      .input(z.object({
        documentTypeId: z.number(),
        fileName: z.string(),
        fileData: z.string(), // base64
        mimeType: z.string(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check payment tier
        if (!ctx.user.paymentTier || ctx.user.paymentTier === "free") {
          throw new Error("Please upgrade to upload documents. Visit /pricing to get started.");
        }
        
        // Upload to S3
        const buffer = Buffer.from(input.fileData, 'base64');
        const fileKey = `${ctx.user.id}/documents/${Date.now()}-${input.fileName}`;
        const { url } = await storagePut(fileKey, buffer, input.mimeType);
        
        // Save to database
        await db.insertUserDocument({
          userId: ctx.user.id,
          documentTypeId: input.documentTypeId,
          fileName: input.fileName,
          fileUrl: url,
          fileKey: fileKey,
          mimeType: input.mimeType,
          fileSize: buffer.length,
          notes: input.notes,
        });
        
        // Update checklist progress
        await db.upsertChecklistProgress({
          userId: ctx.user.id,
          documentTypeId: input.documentTypeId,
          isCompleted: true,
          completedAt: new Date(),
        });
        
        return { success: true, url };
      }),
    
    delete: protectedProcedure
      .input(z.object({ documentId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteUserDocument(input.documentId, ctx.user.id);
        return { success: true };
      }),
    
    extract: protectedProcedure
      .input(z.object({
        imageUrl: z.string(),
        documentTypeId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const docType = await db.getDocumentTypeById(input.documentTypeId);
        const extractedData = await extractDocumentData(input.imageUrl, docType?.name || "document");
        return extractedData;
      }),
  }),

  checklist: router({
    progress: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserChecklistProgressWithDetails(ctx.user.id);
    }),
    
    update: protectedProcedure
      .input(z.object({
        documentTypeId: z.number(),
        isCompleted: z.boolean().optional(),
        isSkipped: z.boolean().optional(),
        skipReason: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.upsertChecklistProgress({
          userId: ctx.user.id,
          documentTypeId: input.documentTypeId,
          isCompleted: input.isCompleted,
          isSkipped: input.isSkipped,
          skipReason: input.skipReason,
          completedAt: input.isCompleted ? new Date() : undefined,
        });
        return { success: true };
      }),
    
    guidance: protectedProcedure.query(async ({ ctx }) => {
      return await getSmartGuidance(ctx.user.id);
    }),
  }),

  chat: router({
    history: protectedProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        const messages = await db.getUserChatMessages(ctx.user.id, input.limit || 50);
        return messages.reverse(); // Return in chronological order
      }),
    
    send: protectedProcedure
      .input(z.object({
        message: z.string(),
        documentTypeId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check payment tier for AI assistant
        if (!ctx.user.paymentTier || ctx.user.paymentTier === "free") {
          throw new Error("AI Assistant requires Complete or Premium package. Visit /pricing to upgrade.");
        }
        
        // Save user message
        await db.insertChatMessage({
          userId: ctx.user.id,
          role: "user",
          content: input.message,
          documentTypeId: input.documentTypeId,
        });
        
        // Get user profile and state info
        const profile = await db.getUserProfile(ctx.user.id);
        const stateInfo = profile?.selectedState 
          ? await db.getStateRequirement(profile.selectedState)
          : null;
        
        // Get paralegal knowledge base
        const knowledgeBase = JSON.stringify(DOCUMENT_NAVIGATION_GUIDES).substring(0, 500);
        
        // Build context for AI
        const systemPrompt = `You are a professional paralegal assistant specializing in divorce document preparation. 
You help users gather all required documents before meeting with their divorce attorney.

${profile?.selectedState ? `User's state: ${stateInfo?.stateName} (${profile.selectedState})
State info: ${stateInfo?.isCommunityProperty ? 'Community property state' : 'Equitable distribution state'}
Residency requirement: ${stateInfo?.residencyRequirement}
Waiting period: ${stateInfo?.waitingPeriod}` : ''}

${profile ? `User profile:
- Has children: ${profile.hasChildren ? 'Yes' : 'No'}
- Has business interests: ${profile.hasBusinessInterests ? 'Yes' : 'No'}
- Has real estate: ${profile.hasRealEstate ? 'Yes' : 'No'}
- Has retirement accounts: ${profile.hasRetirementAccounts ? 'Yes' : 'No'}` : ''}

Your knowledge base includes step-by-step instructions for accessing documents from:
${knowledgeBase}

Provide specific, actionable guidance including:
1. Exact URLs and website names
2. Step-by-step navigation instructions
3. Alternative methods if the primary method fails
4. What information they'll need to access the document
5. Tips for ensuring the document is complete and acceptable

Be professional, empathetic, and thorough. Remember that divorce is stressful, so be supportive while remaining focused on the practical task of document gathering.`;

        // Get recent chat history for context
        const recentMessages = await db.getUserChatMessages(ctx.user.id, 10);
        const chatHistory = recentMessages.reverse().map(msg => ({
          role: msg.role as "user" | "assistant",
          content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content),
        }));
        
        // Call LLM
        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            ...chatHistory,
            { role: "user", content: input.message },
          ],
        });
        
        const rawContent = response.choices[0]?.message?.content;
        const assistantMessage = typeof rawContent === 'string' ? rawContent : (rawContent ? JSON.stringify(rawContent) : "I apologize, but I'm having trouble responding right now. Please try again.");
        
        // Save assistant message
        await db.insertChatMessage({
          userId: ctx.user.id,
          role: "assistant",
          content: assistantMessage,
          documentTypeId: input.documentTypeId,
        });
        
        return { message: assistantMessage };
      }),
  }),

  pdf: router({
    generate: protectedProcedure.mutation(async ({ ctx }) => {
      // Check payment tier for PDF export
      if (ctx.user.paymentTier !== "premium") {
        throw new Error("PDF export requires Premium package. Visit /pricing to upgrade.");
      }
      
      const result = await generateDocumentPackage({ userId: ctx.user.id });
      const pdfBuffer = result.pdfBytes;
      
      // Upload to S3
      const fileKey = `${ctx.user.id}/exports/document-package-${Date.now()}.pdf`;
      const { url } = await storagePut(fileKey, pdfBuffer, "application/pdf");
      
      return { url };
    }),
  }),

  share: router({
    create: protectedProcedure
      .input(z.object({
        recipientEmail: z.string().email().optional(),
        recipientName: z.string().optional(),
        password: z.string().min(6),
        expiresInDays: z.number().min(1).max(90).default(7),
        maxViews: z.number().min(1).max(100).default(10),
      }))
      .mutation(async ({ ctx, input }) => {
        const shareToken = crypto.randomBytes(32).toString('hex');
        const passwordHash = await bcrypt.hash(input.password, 10);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + input.expiresInDays);
        
        await db.createShareLink({
          userId: ctx.user.id,
          shareToken,
          recipientEmail: input.recipientEmail,
          recipientName: input.recipientName,
          passwordHash,
          expiresAt,
          maxViews: input.maxViews,
        });
        
        return { shareToken, expiresAt };
      }),
    
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserShareLinks(ctx.user.id);
    }),
    
    revoke: protectedProcedure
      .input(z.object({ shareLinkId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deactivateShareLink(input.shareLinkId, ctx.user.id);
        return { success: true };
      }),
    
    access: publicProcedure
      .input(z.object({
        token: z.string(),
        password: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const shareLink = await db.getShareLinkByToken(input.token);
        
        if (!shareLink || !shareLink.isActive) {
          throw new Error("Invalid or expired share link");
        }
        
        if (new Date() > shareLink.expiresAt) {
          throw new Error("Share link has expired");
        }
        
        if (shareLink.maxViews && shareLink.viewCount >= shareLink.maxViews) {
          throw new Error("Share link has reached maximum views");
        }
        
        const passwordMatch = await bcrypt.compare(input.password, shareLink.passwordHash);
        if (!passwordMatch) {
          // Log failed attempt
          await db.logShareAccess({
            shareLinkId: shareLink.id,
            ipAddress: ctx.req.ip,
            userAgent: ctx.req.headers['user-agent'],
            success: false,
          });
          throw new Error("Incorrect password");
        }
        
        // Log successful access
        await db.logShareAccess({
          shareLinkId: shareLink.id,
          ipAddress: ctx.req.ip,
          userAgent: ctx.req.headers['user-agent'],
          success: true,
        });
        
        // Increment view count
        await db.updateShareLinkViewCount(shareLink.id);
        
        // Generate PDF for this user
        const result = await generateDocumentPackage({ userId: shareLink.userId });
        const pdfBuffer = result.pdfBytes;
        const fileKey = `${shareLink.userId}/shared/${Date.now()}.pdf`;
        const { url } = await storagePut(fileKey, pdfBuffer, "application/pdf");
        
        return { pdfUrl: url, recipientName: shareLink.recipientName };
      }),
  }),

  payment: router({    createCheckoutSession: protectedProcedure
      .input(z.object({ tier: z.enum(["complete", "premium"]) }))
      .mutation(async ({ ctx, input }) => {
        const product = input.tier === "complete" ? PRODUCTS.COMPLETE : PRODUCTS.PREMIUM;
        
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price: product.priceId,
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${ctx.req.headers.origin}/dashboard?payment=success`,
          cancel_url: `${ctx.req.headers.origin}/pricing?payment=cancelled`,
          client_reference_id: ctx.user.id.toString(),
          customer_email: ctx.user.email || undefined,
          metadata: {
            user_id: ctx.user.id.toString(),
            tier: input.tier,
            customer_email: ctx.user.email || "",
            customer_name: ctx.user.name || "",
          },
          allow_promotion_codes: true,
        });
        
        return { url: session.url };
      }),
  }),

  settings: router({
    exportData: protectedProcedure.mutation(async ({ ctx }) => {
      const profile = await db.getUserProfile(ctx.user.id);
      const documents = await db.getUserDocumentsWithCategory(ctx.user.id);
      const progress = await db.getUserChecklistProgressWithDetails(ctx.user.id);
      const chatHistory = await db.getUserChatMessages(ctx.user.id, 1000);
      
      return {
        user: {
          id: ctx.user.id,
          name: ctx.user.name,
          email: ctx.user.email,
          createdAt: ctx.user.createdAt,
        },
        profile,
        documents: documents.map(d => ({
          ...d,
          fileUrl: undefined, // Don't export S3 URLs for privacy
          fileKey: undefined,
        })),
        progress,
        chatHistory,
      };
    }),
    
    deleteAllData: protectedProcedure.mutation(async ({ ctx }) => {
      await db.deleteAllUserData(ctx.user.id);
      
      // Log out the user
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      
      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
