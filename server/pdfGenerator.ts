import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import * as db from "./db";

/**
 * Professional PDF generation service
 * Creates organized document packages with tabs, highlighting, and table of contents
 */

export interface DocumentPackage {
  userId: number;
  includeExtractedData?: boolean;
}

export interface PDFGenerationResult {
  pdfBytes: Buffer;
  pageCount: number;
  documentCount: number;
}

/**
 * Generate a professional PDF package of all user documents
 */
export async function generateDocumentPackage(
  options: DocumentPackage
): Promise<PDFGenerationResult> {
  const { userId, includeExtractedData = true } = options;

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Get user data
  const profile = await db.getUserProfile(userId);
  const documents = await db.getUserDocumentsWithCategory(userId);
  const categories = await db.getAllDocumentCategories();
  
  // Get user name from profile or default
  const userName = "User"; // We don't have direct user access here

  // Add cover page
  const coverPage = pdfDoc.addPage([612, 792]); // Letter size
  const { width, height } = coverPage.getSize();

  coverPage.drawText("Divorce Document Package", {
    x: 50,
    y: height - 100,
    size: 32,
    font: helveticaBold,
    color: rgb(0.1, 0.1, 0.4),
  });

  coverPage.drawText(`Prepared for: ${userName}`, {
    x: 50,
    y: height - 150,
    size: 16,
    font: helveticaFont,
    color: rgb(0.2, 0.2, 0.2),
  });

  coverPage.drawText(`Generated: ${new Date().toLocaleDateString()}`, {
    x: 50,
    y: height - 180,
    size: 14,
    font: helveticaFont,
    color: rgb(0.4, 0.4, 0.4),
  });

  if (profile?.selectedState) {
    coverPage.drawText(`State: ${profile.selectedState}`, {
      x: 50,
      y: height - 210,
      size: 14,
      font: helveticaFont,
      color: rgb(0.4, 0.4, 0.4),
    });
  }

  coverPage.drawText(`Total Documents: ${documents.length}`, {
    x: 50,
    y: height - 240,
    size: 14,
    font: helveticaFont,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Add confidentiality notice
  coverPage.drawText("CONFIDENTIAL - ATTORNEY-CLIENT PRIVILEGED", {
    x: 50,
    y: height - 300,
    size: 12,
    font: helveticaBold,
    color: rgb(0.8, 0, 0),
  });

  coverPage.drawText(
    "This document package contains sensitive personal and financial information.",
    {
      x: 50,
      y: height - 330,
      size: 10,
      font: helveticaFont,
      color: rgb(0.4, 0.4, 0.4),
      maxWidth: width - 100,
    }
  );

  // Add table of contents page
  const tocPage = pdfDoc.addPage([612, 792]);
  let tocY = height - 80;

  tocPage.drawText("Table of Contents", {
    x: 50,
    y: tocY,
    size: 24,
    font: helveticaBold,
    color: rgb(0.1, 0.1, 0.4),
  });

  tocY -= 40;

  // Group documents by category
  const documentsByCategory = new Map<number, typeof documents>();
  for (const doc of documents) {
    if (!doc.categoryId) continue; // Skip documents without category
    const categoryDocs = documentsByCategory.get(doc.categoryId) || [];
    categoryDocs.push(doc);
    documentsByCategory.set(doc.categoryId, categoryDocs);
  }

  let currentPageNumber = 3; // After cover and TOC

  // Add TOC entries
  for (const category of categories) {
    const categoryDocs = documentsByCategory.get(category.id) || [];
    if (categoryDocs.length === 0) continue;

    tocPage.drawText(`${category.name} (${categoryDocs.length} documents)`, {
      x: 50,
      y: tocY,
      size: 14,
      font: helveticaBold,
      color: rgb(0.2, 0.2, 0.2),
    });

    tocPage.drawText(`Page ${currentPageNumber}`, {
      x: width - 100,
      y: tocY,
      size: 12,
      font: helveticaFont,
      color: rgb(0.4, 0.4, 0.4),
    });

    tocY -= 25;

    for (const doc of categoryDocs) {
      if (tocY < 100) {
        // Start new TOC page if needed
        const newTocPage = pdfDoc.addPage([612, 792]);
        tocY = height - 80;
      }

      tocPage.drawText(`  • ${doc.fileName}`, {
        x: 70,
        y: tocY,
        size: 11,
        font: helveticaFont,
        color: rgb(0.3, 0.3, 0.3),
      });

      tocY -= 20;
      currentPageNumber++; // Each document gets a page
    }

    tocY -= 10; // Extra space between categories
  }

  // Add document pages organized by category
  for (const category of categories) {
    const categoryDocs = documentsByCategory.get(category.id) || [];
    if (categoryDocs.length === 0) continue;

    // Add category divider page
    const dividerPage = pdfDoc.addPage([612, 792]);
    
    // Draw colored header bar
    dividerPage.drawRectangle({
      x: 0,
      y: height - 150,
      width: width,
      height: 150,
      color: rgb(0.1, 0.3, 0.6),
    });

    dividerPage.drawText(category.name, {
      x: 50,
      y: height - 100,
      size: 28,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });

    if (category.description) {
      dividerPage.drawText(category.description, {
        x: 50,
        y: height - 130,
        size: 12,
        font: helveticaFont,
        color: rgb(0.9, 0.9, 0.9),
        maxWidth: width - 100,
      });
    }

    dividerPage.drawText(`${categoryDocs.length} Documents`, {
      x: 50,
      y: height - 200,
      size: 14,
      font: helveticaBold,
      color: rgb(0.2, 0.2, 0.2),
    });

    // Add document list pages for this category
    for (const doc of categoryDocs) {
      const docPage = pdfDoc.addPage([612, 792]);
      let docY = height - 80;

      // Document header
      docPage.drawText(doc.fileName, {
        x: 50,
        y: docY,
        size: 18,
        font: helveticaBold,
        color: rgb(0.1, 0.1, 0.4),
      });

      docY -= 30;

      // Document metadata
      docPage.drawText(`Uploaded: ${new Date(doc.uploadedAt).toLocaleDateString()}`, {
        x: 50,
        y: docY,
        size: 11,
        font: helveticaFont,
        color: rgb(0.4, 0.4, 0.4),
      });

      docY -= 20;

      docPage.drawText(`File: ${doc.fileName}`, {
        x: 50,
        y: docY,
        size: 11,
        font: helveticaFont,
        color: rgb(0.4, 0.4, 0.4),
      });

      docY -= 20;

      docPage.drawText(`Size: ${doc.fileSize ? (doc.fileSize / 1024).toFixed(1) : '0'} KB`, {
        x: 50,
        y: docY,
        size: 11,
        font: helveticaFont,
        color: rgb(0.4, 0.4, 0.4),
      });

      docY -= 40;

      // Add extracted data if available and requested
      if (includeExtractedData && doc.notes) {
        try {
          const extractedData = JSON.parse(doc.notes);
          
          docPage.drawText("Extracted Information:", {
            x: 50,
            y: docY,
            size: 14,
            font: helveticaBold,
            color: rgb(0.2, 0.2, 0.2),
          });

          docY -= 25;

          // Highlight box for extracted data
          const boxHeight = Math.min(Object.keys(extractedData).length * 25 + 20, 300);
          docPage.drawRectangle({
            x: 45,
            y: docY - boxHeight,
            width: width - 90,
            height: boxHeight,
            borderColor: rgb(0.8, 0.9, 1),
            borderWidth: 2,
            color: rgb(0.95, 0.97, 1),
          });

          docY -= 15;

          for (const [key, value] of Object.entries(extractedData)) {
            if (docY < 100) break; // Don't overflow page

            const label = String(key).replace(/_/g, " ");
            const displayValue = value !== null ? String(value) : "N/A";

            docPage.drawText(`${label}:`, {
              x: 60,
              y: docY,
              size: 10,
              font: helveticaBold,
              color: rgb(0.2, 0.2, 0.2),
            });

            docPage.drawText(displayValue, {
              x: 250,
              y: docY,
              size: 10,
              font: helveticaFont,
              color: rgb(0.3, 0.3, 0.3),
              maxWidth: width - 280,
            });

            docY -= 20;
          }
        } catch (e) {
          // Notes aren't JSON, just display as text
          docPage.drawText("Notes:", {
            x: 50,
            y: docY,
            size: 12,
            font: helveticaBold,
            color: rgb(0.2, 0.2, 0.2),
          });

          docY -= 20;

          docPage.drawText(doc.notes, {
            x: 50,
            y: docY,
            size: 10,
            font: helveticaFont,
            color: rgb(0.3, 0.3, 0.3),
            maxWidth: width - 100,
          });
        }
      }

      // Add footer with page number
      docPage.drawText(`Page ${pdfDoc.getPageCount()}`, {
        x: width / 2 - 30,
        y: 30,
        size: 10,
        font: helveticaFont,
        color: rgb(0.5, 0.5, 0.5),
      });

      // Add document URL reference
      docPage.drawText("Document stored securely in encrypted cloud storage", {
        x: 50,
        y: 50,
        size: 8,
        font: helveticaFont,
        color: rgb(0.6, 0.6, 0.6),
      });
    }
  }

  // Add final page with completion summary
  const summaryPage = pdfDoc.addPage([612, 792]);
  let summaryY = height - 80;

  summaryPage.drawText("Document Package Summary", {
    x: 50,
    y: summaryY,
    size: 24,
    font: helveticaBold,
    color: rgb(0.1, 0.1, 0.4),
  });

  summaryY -= 50;

  const progress = await db.getUserChecklistProgress(userId);
  const totalRequired = progress.length;
  const completed = progress.filter((p) => p.isCompleted).length;
  const completionRate = totalRequired > 0 ? (completed / totalRequired) * 100 : 0;

  summaryPage.drawText(`Completion Status: ${completed} of ${totalRequired} documents (${completionRate.toFixed(0)}%)`, {
    x: 50,
    y: summaryY,
    size: 14,
    font: helveticaFont,
    color: rgb(0.2, 0.2, 0.2),
  });

  summaryY -= 30;

  summaryPage.drawText(`Total Pages: ${pdfDoc.getPageCount()}`, {
    x: 50,
    y: summaryY,
    size: 12,
    font: helveticaFont,
    color: rgb(0.4, 0.4, 0.4),
  });

  summaryY -= 20;

  summaryPage.drawText(`Categories Included: ${documentsByCategory.size}`, {
    x: 50,
    y: summaryY,
    size: 12,
    font: helveticaFont,
    color: rgb(0.4, 0.4, 0.4),
  });

  summaryY -= 40;

  summaryPage.drawText("Next Steps:", {
    x: 50,
    y: summaryY,
    size: 14,
    font: helveticaBold,
    color: rgb(0.2, 0.2, 0.2),
  });

  summaryY -= 25;

  const nextSteps = [
    "1. Review all documents for accuracy and completeness",
    "2. Make copies for your records",
    "3. Provide this package to your attorney",
    "4. Keep original documents in a safe location",
    "5. Update any missing or outdated documents",
  ];

  for (const step of nextSteps) {
    summaryPage.drawText(step, {
      x: 60,
      y: summaryY,
      size: 11,
      font: helveticaFont,
      color: rgb(0.3, 0.3, 0.3),
    });
    summaryY -= 22;
  }

  // Serialize PDF to bytes
  const pdfBytes = await pdfDoc.save();

  return {
    pdfBytes: Buffer.from(pdfBytes),
    pageCount: pdfDoc.getPageCount(),
    documentCount: documents.length,
  };
}
