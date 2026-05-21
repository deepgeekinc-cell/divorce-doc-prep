/**
 * Paralegal-level knowledge base for divorce document preparation
 * Contains detailed website navigation guides and expert instructions
 */

export const DOCUMENT_NAVIGATION_GUIDES = {
  // TAX DOCUMENTS
  "Tax Returns (Last 3 Years)": {
    websites: [
      {
        name: "IRS Get Transcript Online",
        url: "https://www.irs.gov/individuals/get-transcript",
        steps: [
          "Go to IRS.gov/individuals/get-transcript",
          "Click 'Get Transcript Online' (fastest method - immediate access)",
          "Create an account or sign in (requires ID verification with ID.me)",
          "Select 'Tax Return Transcript' for each year needed (last 3 years)",
          "Choose the tax year from the dropdown menu",
          "Click 'Download' or 'Print' - save as PDF",
          "Repeat for each of the last 3 years",
        ],
        tips: [
          "Tax Return Transcript shows most line items from your original return",
          "If you can't verify online, use 'Get Transcript by Mail' (5-10 days)",
          "You can also call 1-800-908-9946 for phone ordering",
          "Transcripts are FREE - never pay a third party",
        ],
        troubleshooting: [
          "If ID verification fails: Try 'Get Transcript by Mail' instead",
          "If transcript not available: You may have filed recently (wait 2-3 weeks)",
          "If you didn't file: You'll need to explain this to your attorney",
        ],
      },
      {
        name: "Tax Preparation Software",
        url: "varies by provider",
        steps: [
          "Log into your tax software (TurboTax, H&R Block, TaxAct, etc.)",
          "Go to 'Tax Returns' or 'Documents' section",
          "Find returns for the last 3 years",
          "Download each return as PDF",
          "If using a CPA: Contact them directly for copies",
        ],
      },
    ],
  },

  "Pay Stubs (Last 3 Months)": {
    websites: [
      {
        name: "Employer Payroll Portal",
        url: "varies by employer",
        steps: [
          "Check your employer's intranet or HR portal",
          "Common portals: ADP, Paychex, Gusto, Paylocity, Workday",
          "Log in with your employee credentials",
          "Navigate to 'Pay' or 'Payroll' section",
          "Select 'Pay Stubs' or 'Earnings Statements'",
          "Download the last 3 months (or 6 pay periods if bi-weekly)",
          "Save each as a separate PDF",
        ],
        tips: [
          "If you're paid bi-weekly, get 6 pay stubs (covers 3 months)",
          "If you're paid monthly, get exactly 3 pay stubs",
          "Make sure pay stubs show: Gross pay, deductions, net pay, YTD totals",
          "If you can't access online: Ask HR or payroll department",
        ],
      },
    ],
  },

  "Bank Statements (Last 6 Months)": {
    websites: [
      {
        name: "Online Banking Portal",
        url: "varies by bank",
        steps: [
          "Log into your bank's website or mobile app",
          "Navigate to the account you need statements for",
          "Look for 'Statements' or 'Documents' tab",
          "Select date range: Last 6 months",
          "Download each monthly statement as PDF",
          "Repeat for ALL accounts (checking, savings, money market)",
        ],
        tips: [
          "You need statements for EVERY account in your name",
          "Include joint accounts with your spouse",
          "Include accounts at ALL banks/credit unions",
          "Statements should show: Beginning balance, all transactions, ending balance",
          "Most banks keep 7 years of statements online",
        ],
        troubleshooting: [
          "If statements not available online: Visit branch or call customer service",
          "If account was closed: You can still request statements (may have fee)",
          "If you forgot login: Use 'Forgot Password' - you'll need account number",
        ],
      },
    ],
  },

  "Credit Card Statements (Last 6 Months)": {
    websites: [
      {
        name: "Credit Card Online Account",
        url: "varies by issuer",
        steps: [
          "Log into each credit card account online",
          "Go to 'Statements' or 'Documents' section",
          "Download the last 6 monthly statements as PDF",
          "Repeat for EVERY credit card (yours, joint, spouse's if you know)",
        ],
        tips: [
          "Include store cards (Target, Amazon, etc.)",
          "Include business cards if used for personal expenses",
          "Statements show spending patterns - important for expense calculations",
        ],
      },
    ],
  },

  "Mortgage Statement": {
    websites: [
      {
        name: "Mortgage Servicer Website",
        url: "varies by servicer",
        steps: [
          "Log into your mortgage servicer's website",
          "Common servicers: Rocket Mortgage, Chase, Wells Fargo, Bank of America",
          "Navigate to 'Statements' or 'Loan Documents'",
          "Download most recent mortgage statement",
          "Also download: Payoff statement (shows current balance)",
        ],
        tips: [
          "You need: Current balance, monthly payment, interest rate, property address",
          "If you refinanced recently: Get documents from new and old lender",
          "Payoff statement is different from regular statement - get both",
        ],
      },
    ],
  },

  "Property Deed": {
    websites: [
      {
        name: "County Recorder's Office",
        url: "varies by county",
        steps: [
          "Google '[Your County Name] County Recorder' or 'County Assessor'",
          "Look for 'Property Search' or 'Document Search' on their website",
          "Search by property address or parcel number",
          "Find the most recent deed (Grant Deed, Warranty Deed, etc.)",
          "Download or request certified copy (may have small fee $5-20)",
        ],
        tips: [
          "The deed shows who owns the property and when it was purchased",
          "You may also find: Purchase price, legal description, liens",
          "If you can't find online: Visit county recorder's office in person",
        ],
      },
    ],
  },

  "Property Tax Assessment": {
    websites: [
      {
        name: "County Assessor or Tax Collector",
        url: "varies by county",
        steps: [
          "Google '[Your County Name] Property Tax' or 'County Assessor'",
          "Find 'Property Search' tool",
          "Enter your property address",
          "Download current tax assessment and payment history",
          "Look for 'Assessed Value' - this is important for property valuation",
        ],
      },
    ],
  },

  "Vehicle Registration": {
    websites: [
      {
        name: "State DMV Website",
        url: "varies by state",
        steps: [
          "Go to your state's DMV website",
          "Look for 'Online Services' or 'Vehicle Registration'",
          "Log in or create account",
          "Find your vehicle registration documents",
          "Download current registration showing: Year, make, model, VIN, value",
        ],
        tips: [
          "You need registration for ALL vehicles in your name",
          "Include: Cars, trucks, motorcycles, RVs, boats, trailers",
          "Registration shows legal owner and lien holder (if financed)",
        ],
      },
    ],
  },

  "401(k) or Retirement Account Statement": {
    websites: [
      {
        name: "Retirement Plan Provider",
        url: "varies by provider",
        steps: [
          "Log into your 401(k) provider (Fidelity, Vanguard, Charles Schwab, etc.)",
          "Navigate to 'Statements' or 'Documents'",
          "Download most recent quarterly statement",
          "Make sure it shows: Current balance, contribution history, investment breakdown",
        ],
        tips: [
          "You need statements for ALL retirement accounts: 401(k), IRA, Roth IRA, pension",
          "Include employer match information",
          "If you left a job: Don't forget old 401(k) accounts",
        ],
      },
    ],
  },

  "Social Security Statement": {
    websites: [
      {
        name: "Social Security Administration",
        url: "https://www.ssa.gov/myaccount/",
        steps: [
          "Go to ssa.gov/myaccount",
          "Create a my Social Security account (requires ID verification)",
          "Once logged in, click 'Get Your Social Security Statement'",
          "Download the PDF",
          "This shows: Earnings history, estimated benefits, credits earned",
        ],
        tips: [
          "Useful for calculating spousal support and retirement division",
          "Shows your lifetime earnings - important for long marriages",
        ],
      },
    ],
  },

  "Life Insurance Policy": {
    websites: [
      {
        name: "Insurance Company Website",
        url: "varies by insurer",
        steps: [
          "Log into your life insurance provider's website",
          "Navigate to 'Policy Documents' or 'My Policies'",
          "Download: Policy declarations page, current cash value statement",
          "Note: Beneficiary information, coverage amount, premium",
        ],
        tips: [
          "Include ALL policies: Term life, whole life, employer-provided",
          "Cash value policies are marital assets",
          "Beneficiary designations may need to change after divorce",
        ],
      },
    ],
  },

  "Health Insurance Information": {
    websites: [
      {
        name: "Insurance Provider Portal",
        url: "varies by insurer",
        steps: [
          "Log into your health insurance website",
          "Download: Insurance card, summary of benefits, premium information",
          "If employer-provided: Get from HR or benefits portal",
        ],
      },
    ],
  },

  "Credit Report": {
    websites: [
      {
        name: "AnnualCreditReport.com",
        url: "https://www.annualcreditreport.com",
        steps: [
          "Go to AnnualCreditReport.com (the ONLY official free site)",
          "Request reports from all 3 bureaus: Equifax, Experian, TransUnion",
          "Verify your identity",
          "Download or print each report",
          "Review for: All debts, credit cards, loans, payment history",
        ],
        tips: [
          "You get one free report per year from each bureau",
          "This is FREE - never pay for credit reports",
          "Beware of lookalike sites (CreditReport.com is NOT the official site)",
          "Shows all debts in your name - important for debt division",
        ],
      },
    ],
  },

  "Business Financial Statements": {
    websites: [
      {
        name: "Accounting Software or CPA",
        url: "varies",
        steps: [
          "If you use QuickBooks, Xero, or similar: Log in and generate reports",
          "Download: Profit & Loss (last 3 years), Balance Sheet (current)",
          "If you have a CPA: Request compiled or reviewed financial statements",
          "Include: Business tax returns (Form 1120, 1120S, or 1065)",
        ],
        tips: [
          "Business valuation is complex - you may need an expert",
          "Include: Operating agreements, partnership agreements, corporate docs",
        ],
      },
    ],
  },

  "Investment Account Statements": {
    websites: [
      {
        name: "Brokerage Account",
        url: "varies by broker",
        steps: [
          "Log into brokerage account (E*TRADE, TD Ameritrade, Robinhood, etc.)",
          "Download most recent monthly or quarterly statement",
          "Include: Stock holdings, bonds, mutual funds, crypto",
          "Show: Current value, cost basis, gains/losses",
        ],
      },
    ],
  },
};

/**
 * Expert paralegal system prompt for AI assistant
 */
export const PARALEGAL_SYSTEM_PROMPT = `You are an expert paralegal assistant specializing in divorce document preparation. Your role is to help users gather ALL required financial and personal documents for their divorce proceedings.

**Your Expertise:**
- Deep knowledge of divorce document requirements across all 50 states
- Expert at navigating government websites (IRS, SSA, DMV, county recorders)
- Familiar with all major financial institutions' online portals
- Understanding of what documents are legally required vs. helpful
- Ability to provide step-by-step website navigation instructions
- Knowledge of common obstacles and troubleshooting solutions

**Your Communication Style:**
- Professional but warm and empathetic (divorce is stressful)
- Clear, step-by-step instructions with specific URLs
- Anticipate user's questions and address them proactively
- Provide alternatives when primary method doesn't work
- Use simple language - avoid legal jargon unless necessary
- Be encouraging - gathering documents is overwhelming

**When a user asks about a document:**
1. Confirm which specific document they need
2. Provide the exact website URL to obtain it
3. Give detailed step-by-step navigation instructions
4. Include login requirements and verification steps
5. Mention any fees (most documents are free)
6. Provide troubleshooting tips for common issues
7. Offer alternative methods if online access isn't available
8. Explain WHY this document is needed (builds understanding)

**Important Guidelines:**
- NEVER give legal advice (you're not a lawyer)
- NEVER tell them what to do in their divorce case
- ALWAYS refer complex legal questions to their attorney
- FOCUS on document gathering only
- Be aware of state-specific requirements
- Remind them that financial disclosure is legally required (hiding assets is illegal)
- Encourage thoroughness - missing documents delay the process

**Red Flags to Watch For:**
- If user asks about hiding assets → Firmly explain this is illegal and unethical
- If user asks for legal strategy → Redirect to their attorney
- If user seems confused about basic process → Provide educational context
- If user is overwhelmed → Break task into smaller steps, offer encouragement

**Your Goal:**
Help the user show up to their first attorney meeting with a COMPLETE document package, saving them thousands in legal fees and weeks of back-and-forth.`;

/**
 * Get navigation guide for a specific document type
 */
export function getDocumentGuide(documentName: string) {
  return DOCUMENT_NAVIGATION_GUIDES[documentName as keyof typeof DOCUMENT_NAVIGATION_GUIDES];
}

/**
 * Generate AI response with paralegal expertise
 */
export function generateParalegalContext(
  documentName: string | null,
  userState: string | null,
  userProfile: {
    hasChildren?: boolean;
    hasBusinessInterests?: boolean;
    hasRealEstate?: boolean;
    hasRetirementAccounts?: boolean;
  }
) {
  let context = PARALEGAL_SYSTEM_PROMPT + "\n\n";

  if (userState) {
    context += `**User's State:** ${userState}\n`;
    context += `Remember to provide state-specific guidance for ${userState} when relevant.\n\n`;
  }

  if (userProfile) {
    context += `**User's Situation:**\n`;
    if (userProfile.hasChildren) context += `- Has children (need child-related documents)\n`;
    if (userProfile.hasBusinessInterests) context += `- Has business interests (need business financials)\n`;
    if (userProfile.hasRealEstate) context += `- Has real estate (need property documents)\n`;
    if (userProfile.hasRetirementAccounts) context += `- Has retirement accounts (need 401k/IRA statements)\n`;
    context += `\n`;
  }

  if (documentName && DOCUMENT_NAVIGATION_GUIDES[documentName as keyof typeof DOCUMENT_NAVIGATION_GUIDES]) {
    const guide = DOCUMENT_NAVIGATION_GUIDES[documentName as keyof typeof DOCUMENT_NAVIGATION_GUIDES];
    context += `**The user is asking about: ${documentName}**\n\n`;
    context += `Here is the expert navigation guide for this document:\n\n`;
    context += JSON.stringify(guide, null, 2);
    context += `\n\nUse this guide to provide detailed, step-by-step instructions to the user.`;
  }

  return context;
}
