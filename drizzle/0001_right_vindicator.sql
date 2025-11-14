CREATE TABLE `chat_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`role` enum('user','assistant') NOT NULL,
	`content` text NOT NULL,
	`documentTypeId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `checklist_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`documentTypeId` int NOT NULL,
	`isCompleted` boolean DEFAULT false,
	`isSkipped` boolean DEFAULT false,
	`skipReason` text,
	`completedAt` timestamp,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `checklist_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `document_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`icon` varchar(50),
	`sortOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `document_categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `document_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`categoryId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`isRequired` boolean DEFAULT true,
	`requiresChildren` boolean DEFAULT false,
	`requiresBusiness` boolean DEFAULT false,
	`requiresRealEstate` boolean DEFAULT false,
	`requiresRetirement` boolean DEFAULT false,
	`whereToFind` text,
	`stateSpecific` varchar(2),
	`sortOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `document_types_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `share_access_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`shareLinkId` int NOT NULL,
	`accessedAt` timestamp NOT NULL DEFAULT (now()),
	`ipAddress` varchar(45),
	`userAgent` text,
	`success` boolean NOT NULL,
	CONSTRAINT `share_access_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `share_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`shareToken` varchar(64) NOT NULL,
	`recipientEmail` varchar(320),
	`recipientName` varchar(255),
	`passwordHash` varchar(255) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`maxViews` int DEFAULT 10,
	`viewCount` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`lastAccessedAt` timestamp,
	CONSTRAINT `share_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `share_links_shareToken_unique` UNIQUE(`shareToken`)
);
--> statement-breakpoint
CREATE TABLE `state_requirements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`stateCode` varchar(2) NOT NULL,
	`stateName` varchar(100) NOT NULL,
	`isCommunityProperty` boolean DEFAULT false,
	`residencyRequirement` text,
	`waitingPeriod` text,
	`financialDisclosureInfo` text,
	`courtWebsite` varchar(500),
	`additionalNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `state_requirements_id` PRIMARY KEY(`id`),
	CONSTRAINT `state_requirements_stateCode_unique` UNIQUE(`stateCode`)
);
--> statement-breakpoint
CREATE TABLE `user_documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`documentTypeId` int NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileUrl` text NOT NULL,
	`fileKey` varchar(500) NOT NULL,
	`mimeType` varchar(100),
	`fileSize` int,
	`notes` text,
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`selectedState` varchar(2),
	`hasChildren` boolean DEFAULT false,
	`hasBusinessInterests` boolean DEFAULT false,
	`hasRealEstate` boolean DEFAULT false,
	`hasRetirementAccounts` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `paymentTier` enum('free','basic','complete','premium') DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `stripeCustomerId` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `stripePaymentId` varchar(255);