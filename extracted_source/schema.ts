import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  paymentTier: mysqlEnum("paymentTier", ["free", "basic", "complete", "premium"]).default("free").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripePaymentId: varchar("stripePaymentId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * User profile with state selection for divorce document requirements
 */
export const userProfiles = mysqlTable("user_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  selectedState: varchar("selectedState", { length: 2 }), // US state code (e.g., "CA", "NY")
  hasChildren: boolean("hasChildren").default(false),
  hasBusinessInterests: boolean("hasBusinessInterests").default(false),
  hasRealEstate: boolean("hasRealEstate").default(false),
  hasRetirementAccounts: boolean("hasRetirementAccounts").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;

/**
 * Document categories (e.g., Income, Assets, Debts, etc.)
 */
export const documentCategories = mysqlTable("document_categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }), // Icon name for UI
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DocumentCategory = typeof documentCategories.$inferSelect;
export type InsertDocumentCategory = typeof documentCategories.$inferInsert;

/**
 * Document types within categories (e.g., "Tax Returns", "Pay Stubs", etc.)
 */
export const documentTypes = mysqlTable("document_types", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: int("categoryId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  isRequired: boolean("isRequired").default(true),
  requiresChildren: boolean("requiresChildren").default(false), // Only show if user has children
  requiresBusiness: boolean("requiresBusiness").default(false), // Only show if user has business
  requiresRealEstate: boolean("requiresRealEstate").default(false),
  requiresRetirement: boolean("requiresRetirement").default(false),
  whereToFind: text("whereToFind"), // Instructions on where to find this document
  stateSpecific: varchar("stateSpecific", { length: 2 }), // NULL means applies to all states
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DocumentType = typeof documentTypes.$inferSelect;
export type InsertDocumentType = typeof documentTypes.$inferInsert;

/**
 * User's uploaded documents
 */
export const userDocuments = mysqlTable("user_documents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  documentTypeId: int("documentTypeId").notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileUrl: text("fileUrl").notNull(), // S3 URL
  fileKey: varchar("fileKey", { length: 500 }).notNull(), // S3 key for management
  mimeType: varchar("mimeType", { length: 100 }),
  fileSize: int("fileSize"), // in bytes
  notes: text("notes"), // User notes about this document
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserDocument = typeof userDocuments.$inferSelect;
export type InsertUserDocument = typeof userDocuments.$inferInsert;

/**
 * User's checklist progress
 */
export const checklistProgress = mysqlTable("checklist_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  documentTypeId: int("documentTypeId").notNull(),
  isCompleted: boolean("isCompleted").default(false),
  isSkipped: boolean("isSkipped").default(false),
  skipReason: text("skipReason"),
  completedAt: timestamp("completedAt"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChecklistProgress = typeof checklistProgress.$inferSelect;
export type InsertChecklistProgress = typeof checklistProgress.$inferInsert;

/**
 * AI chat history for document assistance
 */
export const chatMessages = mysqlTable("chat_messages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  documentTypeId: int("documentTypeId"), // Optional: if question is about specific document
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

/**
 * State-specific requirements and information
 */
export const stateRequirements = mysqlTable("state_requirements", {
  id: int("id").autoincrement().primaryKey(),
  stateCode: varchar("stateCode", { length: 2 }).notNull().unique(),
  stateName: varchar("stateName", { length: 100 }).notNull(),
  isCommunityProperty: boolean("isCommunityProperty").default(false),
  residencyRequirement: text("residencyRequirement"),
  waitingPeriod: text("waitingPeriod"),
  financialDisclosureInfo: text("financialDisclosureInfo"),
  courtWebsite: varchar("courtWebsite", { length: 500 }),
  additionalNotes: text("additionalNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StateRequirement = typeof stateRequirements.$inferSelect;
export type InsertStateRequirement = typeof stateRequirements.$inferInsert;

/**
 * Secure share links for sharing document packages with attorneys
 */
export const shareLinks = mysqlTable("share_links", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  shareToken: varchar("shareToken", { length: 64 }).notNull().unique(),
  recipientEmail: varchar("recipientEmail", { length: 320 }),
  recipientName: varchar("recipientName", { length: 255 }),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  maxViews: int("maxViews").default(10),
  viewCount: int("viewCount").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  lastAccessedAt: timestamp("lastAccessedAt"),
});

export type ShareLink = typeof shareLinks.$inferSelect;
export type InsertShareLink = typeof shareLinks.$inferInsert;

/**
 * Access log for share links (security audit trail)
 */
export const shareAccessLog = mysqlTable("share_access_log", {
  id: int("id").autoincrement().primaryKey(),
  shareLinkId: int("shareLinkId").notNull(),
  accessedAt: timestamp("accessedAt").defaultNow().notNull(),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  success: boolean("success").notNull(),
});

export type ShareAccessLog = typeof shareAccessLog.$inferSelect;
export type InsertShareAccessLog = typeof shareAccessLog.$inferInsert;
