import * as db from "./db";

export interface GuidanceStep {
  title: string;
  description: string;
  action: string;
  actionUrl: string;
  priority: "high" | "medium" | "low";
  estimatedTime: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface ProgressSummary {
  totalDocuments: number;
  completedDocuments: number;
  percentageComplete: number;
  estimatedTimeRemaining: string;
  estimatedMoneySaved: number;
  milestone: string | null;
}

/**
 * Calculate user's progress and suggest next best action
 */
export async function getSmartGuidance(userId: number): Promise<{
  nextStep: GuidanceStep | null;
  progress: ProgressSummary;
  motivationalMessage: string;
  alternativeSteps: GuidanceStep[];
}> {
  const progress = await db.getUserChecklistProgressWithDetails(userId);
  const userProfile = await db.getUserProfile(userId);
  
  if (!progress || progress.length === 0) {
    return {
      nextStep: {
        title: "Select Your State",
        description: "First, tell us which state you're filing for divorce in so we can customize your document checklist.",
        action: "Go to State Selection",
        actionUrl: "/state-selection",
        priority: "high",
        estimatedTime: "2 minutes",
        difficulty: "easy",
      },
      progress: {
        totalDocuments: 0,
        completedDocuments: 0,
        percentageComplete: 0,
        estimatedTimeRemaining: "Unknown",
        estimatedMoneySaved: 0,
        milestone: null,
      },
      motivationalMessage: "Welcome! Let's get started on gathering your divorce documents.",
      alternativeSteps: [],
    };
  }

  const totalDocuments = progress.length;
  const completedDocuments = progress.filter(p => p.isCompleted).length;
  const percentageComplete = Math.round((completedDocuments / totalDocuments) * 100);
  
  // Calculate estimated time remaining (average 10 min per document)
  const remainingDocs = totalDocuments - completedDocuments;
  const estimatedMinutes = remainingDocs * 10;
  const estimatedTimeRemaining = estimatedMinutes < 60 
    ? `${estimatedMinutes} minutes`
    : `${Math.round(estimatedMinutes / 60)} hours`;
  
  // Calculate money saved (average $250/hour attorney rate)
  const hoursSaved = completedDocuments * (10 / 60); // 10 min per doc
  const estimatedMoneySaved = Math.round(hoursSaved * 250);
  
  // Determine milestone
  let milestone: string | null = null;
  if (percentageComplete === 100) {
    milestone = "🎉 Complete!";
  } else if (percentageComplete >= 75) {
    milestone = "🏁 Almost There!";
  } else if (percentageComplete >= 50) {
    milestone = "💪 Halfway Done!";
  } else if (percentageComplete >= 25) {
    milestone = "🚀 Great Start!";
  }
  
  // Find incomplete documents and prioritize by difficulty
  const incompleteDocs = progress.filter(p => !p.isCompleted && !p.isSkipped);
  
  if (incompleteDocs.length === 0) {
    return {
      nextStep: {
        title: "Download Your Document Package",
        description: "Congratulations! You've completed all required documents. Download your professional PDF package to share with your attorney.",
        action: "Download PDF",
        actionUrl: "/documents",
        priority: "high",
        estimatedTime: "1 minute",
        difficulty: "easy",
      },
      progress: {
        totalDocuments,
        completedDocuments,
        percentageComplete,
        estimatedTimeRemaining: "0 minutes",
        estimatedMoneySaved,
        milestone,
      },
      motivationalMessage: `🎉 Amazing work! You've saved an estimated $${estimatedMoneySaved} in legal fees by gathering these documents yourself.`,
      alternativeSteps: [
        {
          title: "Share with Attorney",
          description: "Create a secure link to share your documents with your legal counsel.",
          action: "Create Share Link",
          actionUrl: "/documents",
          priority: "medium",
          estimatedTime: "2 minutes",
          difficulty: "easy",
        },
      ],
    };
  }
  
  // Prioritize documents: easy financial docs first, then property, then complex
  const easyDocs = ["Pay Stubs", "Bank Statements", "Credit Card Statements", "Utility Bills"];
  const mediumDocs = ["Tax Returns", "W-2 Forms", "1099 Forms", "Mortgage Statements", "Vehicle Titles"];
  const hardDocs = ["Business Valuation", "Retirement Account Statements", "Property Deeds", "Stock/Investment Statements"];
  
  let nextDoc = incompleteDocs.find(d => easyDocs.includes(d.documentTypeName || ""));
  let difficulty: "easy" | "medium" | "hard" = "easy";
  
  if (!nextDoc) {
    nextDoc = incompleteDocs.find(d => mediumDocs.includes(d.documentTypeName || ""));
    difficulty = "medium";
  }
  
  if (!nextDoc) {
    nextDoc = incompleteDocs.find(d => hardDocs.includes(d.documentTypeName || ""));
    difficulty = "hard";
  }
  
  if (!nextDoc) {
    nextDoc = incompleteDocs[0];
    difficulty = "medium";
  }
  
  const estimatedTime = difficulty === "easy" ? "5-10 minutes" : 
                        difficulty === "medium" ? "10-20 minutes" : 
                        "20-30 minutes";
  
  // Generate motivational message
  let motivationalMessage = "";
  if (percentageComplete >= 75) {
    motivationalMessage = `You're so close! Just ${remainingDocs} more document${remainingDocs > 1 ? 's' : ''} to go.`;
  } else if (percentageComplete >= 50) {
    motivationalMessage = `Great progress! You're over halfway done. Keep going!`;
  } else if (percentageComplete >= 25) {
    motivationalMessage = `You're off to a great start! You've already saved about $${estimatedMoneySaved} in legal fees.`;
  } else if (completedDocuments > 0) {
    motivationalMessage = `Nice work on your first document${completedDocuments > 1 ? 's' : ''}! Let's keep the momentum going.`;
  } else {
    motivationalMessage = `Let's start with something easy. This should only take about ${estimatedTime}.`;
  }
  
  // Get alternative steps (other incomplete docs)
  const alternativeSteps: GuidanceStep[] = incompleteDocs
    .filter(d => d.id !== nextDoc?.id)
    .slice(0, 3)
    .map(d => ({
      title: `Get ${d.documentTypeName}`,
      description: d.description || `Upload your ${d.documentTypeName} documents.`,
      action: "Ask AI Assistant",
      actionUrl: "/assistant",
      priority: "medium" as const,
      estimatedTime: "10-15 minutes",
      difficulty: "medium" as const,
    }));
  
  return {
    nextStep: {
      title: `Get ${nextDoc.documentTypeName}`,
      description: nextDoc.description || `Upload your ${nextDoc.documentTypeName} documents.`,
      action: "Ask AI Assistant for Help",
      actionUrl: "/assistant",
      priority: "high",
      estimatedTime,
      difficulty,
    },
    progress: {
      totalDocuments,
      completedDocuments,
      percentageComplete,
      estimatedTimeRemaining,
      estimatedMoneySaved,
      milestone,
    },
    motivationalMessage,
    alternativeSteps,
  };
}

/**
 * Generate proactive AI greeting based on user's progress
 */
export async function generateProactiveGreeting(userId: number): Promise<string> {
  const guidance = await getSmartGuidance(userId);
  const { progress, nextStep, motivationalMessage } = guidance;
  
  if (progress.percentageComplete === 0) {
    return `Hi! I'm your AI divorce document assistant. I'm here to guide you through gathering all the documents you'll need for your first attorney meeting. ${motivationalMessage}\n\nLet's start with: **${nextStep?.title}**\n\n${nextStep?.description}\n\nJust ask me "How do I get ${nextStep?.title}?" and I'll walk you through it step-by-step!`;
  }
  
  if (progress.percentageComplete === 100) {
    return `🎉 Congratulations! You've completed all required documents!\n\n${motivationalMessage}\n\nYou're now ready to meet with your attorney. Would you like me to help you:\n1. Download your PDF document package\n2. Create a secure share link for your attorney\n3. Review what you've gathered`;
  }
  
  if (progress.milestone) {
    return `${progress.milestone} ${motivationalMessage}\n\n**Your Next Step:** ${nextStep?.title}\n\n${nextStep?.description}\n\nWant help with this? Just ask "How do I get ${nextStep?.title}?" or let me know if you'd prefer to work on something else!`;
  }
  
  return `Welcome back! ${motivationalMessage}\n\n**Suggested Next Step:** ${nextStep?.title}\n\nEstimated time: ${nextStep?.estimatedTime}\n\nHow can I help you today?`;
}
