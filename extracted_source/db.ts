import { eq, and, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  userProfiles, 
  InsertUserProfile,
  documentCategories,
  documentTypes,
  userDocuments,
  InsertUserDocument,
  checklistProgress,
  InsertChecklistProgress,
  chatMessages,
  InsertChatMessage,
  stateRequirements,
  InsertStateRequirement,
  InsertDocumentCategory,
  InsertDocumentType,
  shareLinks,
  InsertShareLink,
  shareAccessLog,
  InsertShareAccessLog
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// User Profile helpers
export async function getUserProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertUserProfile(profile: InsertUserProfile) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await getUserProfile(profile.userId);
  
  if (existing) {
    await db.update(userProfiles)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(userProfiles.userId, profile.userId));
  } else {
    await db.insert(userProfiles).values(profile);
  }
}

// Document Categories helpers
export async function getAllDocumentCategories() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(documentCategories).orderBy(documentCategories.sortOrder);
}

export async function insertDocumentCategory(category: InsertDocumentCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(documentCategories).values(category);
}

// Document Types helpers
export async function getDocumentTypesByCategory(categoryId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(documentTypes)
    .where(eq(documentTypes.categoryId, categoryId))
    .orderBy(documentTypes.sortOrder);
}

export async function getDocumentTypesForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const profile = await getUserProfile(userId);
  if (!profile) return [];
  
  const allTypes = await db.select().from(documentTypes);
  
  // Filter based on user profile
  return allTypes.filter(type => {
    // Check state-specific requirements
    if (type.stateSpecific && type.stateSpecific !== profile.selectedState) {
      return false;
    }
    
    // Check conditional requirements
    if (type.requiresChildren && !profile.hasChildren) return false;
    if (type.requiresBusiness && !profile.hasBusinessInterests) return false;
    if (type.requiresRealEstate && !profile.hasRealEstate) return false;
    if (type.requiresRetirement && !profile.hasRetirementAccounts) return false;
    
    return true;
  });
}

export async function getDocumentTypeById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(documentTypes)
    .where(eq(documentTypes.id, id))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function insertDocumentType(docType: InsertDocumentType) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(documentTypes).values(docType);
}

// User Documents helpers
export async function getUserDocuments(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(userDocuments)
    .where(eq(userDocuments.userId, userId))
    .orderBy(desc(userDocuments.uploadedAt));
}

export async function getUserDocumentsWithCategory(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const docs = await db.select({
    id: userDocuments.id,
    userId: userDocuments.userId,
    documentTypeId: userDocuments.documentTypeId,
    fileName: userDocuments.fileName,
    fileUrl: userDocuments.fileUrl,
    fileKey: userDocuments.fileKey,
    mimeType: userDocuments.mimeType,
    fileSize: userDocuments.fileSize,
    notes: userDocuments.notes,
    uploadedAt: userDocuments.uploadedAt,
    updatedAt: userDocuments.updatedAt,
    documentTypeName: documentTypes.name,
    categoryId: documentTypes.categoryId,
    categoryName: documentCategories.name,
  })
  .from(userDocuments)
  .leftJoin(documentTypes, eq(userDocuments.documentTypeId, documentTypes.id))
  .leftJoin(documentCategories, eq(documentTypes.categoryId, documentCategories.id))
  .where(eq(userDocuments.userId, userId))
  .orderBy(desc(userDocuments.uploadedAt));
  
  return docs;
}

export async function getUserDocumentsByType(userId: number, documentTypeId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(userDocuments)
    .where(and(
      eq(userDocuments.userId, userId),
      eq(userDocuments.documentTypeId, documentTypeId)
    ))
    .orderBy(desc(userDocuments.uploadedAt));
}

export async function insertUserDocument(doc: InsertUserDocument) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(userDocuments).values(doc);
  return result;
}

export async function deleteUserDocument(documentId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(userDocuments)
    .where(and(
      eq(userDocuments.id, documentId),
      eq(userDocuments.userId, userId)
    ));
}

// Checklist Progress helpers
export async function getUserChecklistProgress(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(checklistProgress)
    .where(eq(checklistProgress.userId, userId));
}

export async function getUserChecklistProgressWithDetails(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select({
    id: checklistProgress.id,
    userId: checklistProgress.userId,
    documentTypeId: checklistProgress.documentTypeId,
    isCompleted: checklistProgress.isCompleted,
    isSkipped: checklistProgress.isSkipped,
    skipReason: checklistProgress.skipReason,
    completedAt: checklistProgress.completedAt,
    updatedAt: checklistProgress.updatedAt,
    documentTypeName: documentTypes.name,
    description: documentTypes.description,
    categoryId: documentTypes.categoryId,
  })
  .from(checklistProgress)
  .leftJoin(documentTypes, eq(checklistProgress.documentTypeId, documentTypes.id))
  .where(eq(checklistProgress.userId, userId));
  
  return result;
}

export async function upsertChecklistProgress(progress: InsertChecklistProgress) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db.select().from(checklistProgress)
    .where(and(
      eq(checklistProgress.userId, progress.userId),
      eq(checklistProgress.documentTypeId, progress.documentTypeId)
    ))
    .limit(1);
  
  if (existing.length > 0) {
    await db.update(checklistProgress)
      .set({ ...progress, updatedAt: new Date() })
      .where(and(
        eq(checklistProgress.userId, progress.userId),
        eq(checklistProgress.documentTypeId, progress.documentTypeId)
      ));
  } else {
    await db.insert(checklistProgress).values(progress);
  }
}

// Chat Messages helpers
export async function getUserChatMessages(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(chatMessages)
    .where(eq(chatMessages.userId, userId))
    .orderBy(desc(chatMessages.createdAt))
    .limit(limit);
}

export async function insertChatMessage(message: InsertChatMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(chatMessages).values(message);
}

// State Requirements helpers
export async function getAllStateRequirements() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(stateRequirements);
}

export async function getStateRequirement(stateCode: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(stateRequirements)
    .where(eq(stateRequirements.stateCode, stateCode))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function insertStateRequirement(requirement: InsertStateRequirement) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(stateRequirements).values(requirement);
}

// Privacy & Security Functions

export async function deleteAllUserData(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete user data: database not available");
    return;
  }

  try {
    // Delete in order to respect foreign key constraints
    await db.delete(chatMessages).where(eq(chatMessages.userId, userId));
    await db.delete(checklistProgress).where(eq(checklistProgress.userId, userId));
    await db.delete(userDocuments).where(eq(userDocuments.userId, userId));
    await db.delete(userProfiles).where(eq(userProfiles.userId, userId));
    // Note: We keep the user record in the users table for auth purposes
    // but all personal data is removed
  } catch (error) {
    console.error("[Database] Failed to delete user data:", error);
    throw error;
  }
}

// Share Links helpers
export async function createShareLink(link: InsertShareLink) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(shareLinks).values(link);
}

export async function getShareLinkByToken(token: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(shareLinks)
    .where(eq(shareLinks.shareToken, token))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserShareLinks(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(shareLinks)
    .where(eq(shareLinks.userId, userId))
    .orderBy(desc(shareLinks.createdAt));
}

export async function updateShareLinkViewCount(linkId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(shareLinks)
    .set({ 
      viewCount: sql`${shareLinks.viewCount} + 1`,
      lastAccessedAt: new Date()
    })
    .where(eq(shareLinks.id, linkId));
}

export async function deactivateShareLink(linkId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(shareLinks)
    .set({ isActive: false })
    .where(and(
      eq(shareLinks.id, linkId),
      eq(shareLinks.userId, userId)
    ));
}

export async function logShareAccess(log: InsertShareAccessLog) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(shareAccessLog).values(log);
}

export async function getShareAccessLogs(shareLinkId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(shareAccessLog)
    .where(eq(shareAccessLog.shareLinkId, shareLinkId))
    .orderBy(desc(shareAccessLog.accessedAt));
}
