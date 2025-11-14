import { drizzle } from "drizzle-orm/mysql2";
import { documentCategories, documentTypes, stateRequirements } from "../drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL!);

async function seed() {
  console.log("Seeding database...");

  // Insert document categories
  const categories = [
    { name: "Personal Identification", description: "Marriage certificates, birth certificates, social security cards", icon: "User", sortOrder: 1 },
    { name: "Income & Employment", description: "Tax returns, W-2s, pay stubs, 1099 forms", icon: "DollarSign", sortOrder: 2 },
    { name: "Bank Accounts & Investments", description: "Bank statements, investment accounts, cryptocurrency", icon: "Building", sortOrder: 3 },
    { name: "Real Estate & Property", description: "Property deeds, mortgages, appraisals, vehicle titles", icon: "Home", sortOrder: 4 },
    { name: "Debts & Liabilities", description: "Credit card statements, student loans, credit reports", icon: "CreditCard", sortOrder: 5 },
    { name: "Insurance Policies", description: "Health, life, auto insurance documents", icon: "Shield", sortOrder: 6 },
    { name: "Legal Agreements", description: "Prenuptial agreements, trust documents", icon: "FileText", sortOrder: 7 },
    { name: "Monthly Expenses", description: "Utility bills, phone bills, budget worksheets", icon: "Receipt", sortOrder: 8 },
    { name: "Child-Related Documents", description: "Childcare expenses, school records, medical records", icon: "Baby", sortOrder: 9 },
    { name: "Business Documents", description: "Business tax returns, partnership agreements, financial statements", icon: "Briefcase", sortOrder: 10 },
  ];

  for (const category of categories) {
    await db.insert(documentCategories).values(category).onDuplicateKeyUpdate({ set: category });
  }

  console.log("✓ Document categories seeded");

  // Insert all 50 states
  const states = [
    { stateCode: "AL", stateName: "Alabama", isCommunityProperty: false, residencyRequirement: "6 months", waitingPeriod: "30 days", financialDisclosureInfo: "Required" },
    { stateCode: "AK", stateName: "Alaska", isCommunityProperty: false, residencyRequirement: "None", waitingPeriod: "30 days", financialDisclosureInfo: "Required" },
    { stateCode: "AZ", stateName: "Arizona", isCommunityProperty: true, residencyRequirement: "90 days", waitingPeriod: "60 days", financialDisclosureInfo: "Required" },
    { stateCode: "AR", stateName: "Arkansas", isCommunityProperty: false, residencyRequirement: "60 days", waitingPeriod: "30 days", financialDisclosureInfo: "Required" },
    { stateCode: "CA", stateName: "California", isCommunityProperty: true, residencyRequirement: "6 months", waitingPeriod: "6 months", financialDisclosureInfo: "Required" },
    { stateCode: "CO", stateName: "Colorado", isCommunityProperty: false, residencyRequirement: "91 days", waitingPeriod: "91 days", financialDisclosureInfo: "Required" },
    { stateCode: "CT", stateName: "Connecticut", isCommunityProperty: false, residencyRequirement: "12 months", waitingPeriod: "90 days", financialDisclosureInfo: "Required" },
    { stateCode: "DE", stateName: "Delaware", isCommunityProperty: false, residencyRequirement: "6 months", waitingPeriod: "None", financialDisclosureInfo: "Required" },
    { stateCode: "FL", stateName: "Florida", isCommunityProperty: false, residencyRequirement: "6 months", waitingPeriod: "20 days", financialDisclosureInfo: "Required" },
    { stateCode: "GA", stateName: "Georgia", isCommunityProperty: false, residencyRequirement: "6 months", waitingPeriod: "31 days", financialDisclosureInfo: "Required" },
    { stateCode: "HI", stateName: "Hawaii", isCommunityProperty: false, residencyRequirement: "6 months", waitingPeriod: "None", financialDisclosureInfo: "Required" },
    { stateCode: "ID", stateName: "Idaho", isCommunityProperty: true, residencyRequirement: "6 weeks", waitingPeriod: "None", financialDisclosureInfo: "Required" },
    { stateCode: "IL", stateName: "Illinois", isCommunityProperty: false, residencyRequirement: "90 days", waitingPeriod: "None", financialDisclosureInfo: "Required" },
    { stateCode: "IN", stateName: "Indiana", isCommunityProperty: false, residencyRequirement: "6 months", waitingPeriod: "60 days", financialDisclosureInfo: "Required" },
    { stateCode: "IA", stateName: "Iowa", isCommunityProperty: false, residencyRequirement: "1 year", waitingPeriod: "90 days", financialDisclosureInfo: "Required" },
    { stateCode: "KS", stateName: "Kansas", isCommunityProperty: false, residencyRequirement: "60 days", waitingPeriod: "60 days", financialDisclosureInfo: "Required" },
    { stateCode: "KY", stateName: "Kentucky", isCommunityProperty: false, residencyRequirement: "180 days", waitingPeriod: "60 days", financialDisclosureInfo: "Required" },
    { stateCode: "LA", stateName: "Louisiana", isCommunityProperty: true, residencyRequirement: "12 months", waitingPeriod: "None", financialDisclosureInfo: "Required" },
    { stateCode: "ME", stateName: "Maine", isCommunityProperty: false, residencyRequirement: "6 months", waitingPeriod: "60 days", financialDisclosureInfo: "Required" },
    { stateCode: "MD", stateName: "Maryland", isCommunityProperty: false, residencyRequirement: "1 year", waitingPeriod: "None", financialDisclosureInfo: "Required" },
    { stateCode: "MA", stateName: "Massachusetts", isCommunityProperty: false, residencyRequirement: "1 year", waitingPeriod: "None", financialDisclosureInfo: "Required" },
    { stateCode: "MI", stateName: "Michigan", isCommunityProperty: false, residencyRequirement: "180 days", waitingPeriod: "None", financialDisclosureInfo: "Required" },
    { stateCode: "MN", stateName: "Minnesota", isCommunityProperty: false, residencyRequirement: "180 days", waitingPeriod: "None", financialDisclosureInfo: "Required" },
    { stateCode: "MS", stateName: "Mississippi", isCommunityProperty: false, residencyRequirement: "6 months", waitingPeriod: "60 days", financialDisclosureInfo: "Required" },
    { stateCode: "MO", stateName: "Missouri", isCommunityProperty: false, residencyRequirement: "90 days", waitingPeriod: "30 days", financialDisclosureInfo: "Required" },
    { stateCode: "MT", stateName: "Montana", isCommunityProperty: false, residencyRequirement: "90 days", waitingPeriod: "None", financialDisclosureInfo: "Required" },
    { stateCode: "NE", stateName: "Nebraska", isCommunityProperty: false, residencyRequirement: "1 year", waitingPeriod: "60 days", financialDisclosureInfo: "Required" },
    { stateCode: "NV", stateName: "Nevada", isCommunityProperty: true, residencyRequirement: "6 weeks", waitingPeriod: "None", financialDisclosureInfo: "Required" },
    { stateCode: "NH", stateName: "New Hampshire", isCommunityProperty: false, residencyRequirement: "1 year", waitingPeriod: "None", financialDisclosureInfo: "Required" },
    { stateCode: "NJ", stateName: "New Jersey", isCommunityProperty: false, residencyRequirement: "1 year", waitingPeriod: "None", financialDisclosureInfo: "Required" },
    { stateCode: "NM", stateName: "New Mexico", isCommunityProperty: true, residencyRequirement: "6 months", waitingPeriod: "30 days", financialDisclosureInfo: "Required" },
    { stateCode: "NY", stateName: "New York", isCommunityProperty: false, residencyRequirement: "1 year", waitingPeriod: "None", financialDisclosureInfo: "Required" },
    { stateCode: "NC", stateName: "North Carolina", isCommunityProperty: false, residencyRequirement: "6 months", waitingPeriod: "30 days", financialDisclosureInfo: "Required" },
    { stateCode: "ND", stateName: "North Dakota", isCommunityProperty: false, residencyRequirement: "6 months", waitingPeriod: "None", financialDisclosureInfo: "Required" },
    { stateCode: "OH", stateName: "Ohio", isCommunityProperty: false, residencyRequirement: "6 months", waitingPeriod: "None", financialDisclosureInfo: "Required" },
    { stateCode: "OK", stateName: "Oklahoma", isCommunityProperty: false, residencyRequirement: "6 months", waitingPeriod: "None", financialDisclosureInfo: "Required" },
    { stateCode: "OR", stateName: "Oregon", isCommunityProperty: false, residencyRequirement: "6 months", waitingPeriod: "None", financialDisclosureInfo: "Required" },
    { stateCode: "PA", stateName: "Pennsylvania", isCommunityProperty: false, residencyRequirement: "6 months", waitingPeriod: "None", financialDisclosureInfo: "Required" },
    { stateCode: "RI", stateName: "Rhode Island", isCommunityProperty: false, residencyRequirement: "1 year", waitingPeriod: "None", financialDisclosureInfo: "Required" },
    { stateCode: "SC", stateName: "South Carolina", isCommunityProperty: false, residencyRequirement: "1 year", waitingPeriod: "90 days", financialDisclosureInfo: "Required" },
    { stateCode: "SD", stateName: "South Dakota", isCommunityProperty: false, residencyRequirement: "None", waitingPeriod: "60 days", financialDisclosureInfo: "Required" },
    { stateCode: "TN", stateName: "Tennessee", isCommunityProperty: false, residencyRequirement: "6 months", waitingPeriod: "60 days", financialDisclosureInfo: "Required" },
    { stateCode: "TX", stateName: "Texas", isCommunityProperty: true, residencyRequirement: "6 months", waitingPeriod: "60 days", financialDisclosureInfo: "Required" },
    { stateCode: "UT", stateName: "Utah", isCommunityProperty: false, residencyRequirement: "90 days", waitingPeriod: "None", financialDisclosureInfo: "Required" },
    { stateCode: "VT", stateName: "Vermont", isCommunityProperty: false, residencyRequirement: "6 months", waitingPeriod: "None", financialDisclosureInfo: "Required" },
    { stateCode: "VA", stateName: "Virginia", isCommunityProperty: false, residencyRequirement: "6 months", waitingPeriod: "None", financialDisclosureInfo: "Required" },
    { stateCode: "WA", stateName: "Washington", isCommunityProperty: true, residencyRequirement: "None", waitingPeriod: "90 days", financialDisclosureInfo: "Required" },
    { stateCode: "WV", stateName: "West Virginia", isCommunityProperty: false, residencyRequirement: "1 year", waitingPeriod: "None", financialDisclosureInfo: "Required" },
    { stateCode: "WI", stateName: "Wisconsin", isCommunityProperty: true, residencyRequirement: "6 months", waitingPeriod: "120 days", financialDisclosureInfo: "Required" },
    { stateCode: "WY", stateName: "Wyoming", isCommunityProperty: false, residencyRequirement: "60 days", waitingPeriod: "None", financialDisclosureInfo: "Required" },
  ];

  for (const state of states) {
    await db.insert(stateRequirements).values(state).onDuplicateKeyUpdate({ set: state });
  }

  console.log("✓ All 50 states seeded");

  // Sample document types (you can expand this list)
  const docTypes = [
    // Personal Identification (category 1)
    { categoryId: 1, name: "Marriage Certificate", description: "Official marriage certificate", isRequired: true, sortOrder: 1, whereToFind: "County clerk's office or vital records department" },
    { categoryId: 1, name: "Birth Certificates", description: "Birth certificates for you, spouse, and children", isRequired: true, sortOrder: 2, whereToFind: "State vital records office" },
    { categoryId: 1, name: "Social Security Cards", description: "SSN cards for all family members", isRequired: true, sortOrder: 3, whereToFind: "Social Security Administration" },
    
    // Income & Employment (category 2)
    { categoryId: 2, name: "Tax Returns (Last 3 Years)", description: "Federal and state tax returns", isRequired: true, sortOrder: 1, whereToFind: "IRS.gov - Get Transcript or your tax preparer" },
    { categoryId: 2, name: "W-2 Forms", description: "Most recent W-2 forms", isRequired: true, sortOrder: 2, whereToFind: "Employer or payroll department" },
    { categoryId: 2, name: "Pay Stubs (Last 3 Months)", description: "Recent pay stubs showing income", isRequired: true, sortOrder: 3, whereToFind: "Employer payroll portal or HR department" },
    { categoryId: 2, name: "1099 Forms", description: "1099 forms for contract work or investments", isRequired: false, sortOrder: 4, whereToFind: "Clients or investment companies" },
    
    // Bank Accounts & Investments (category 3)
    { categoryId: 3, name: "Bank Statements (Last 6 Months)", description: "Checking and savings account statements", isRequired: true, sortOrder: 1, whereToFind: "Online banking portal" },
    { categoryId: 3, name: "Investment Account Statements", description: "Brokerage, stocks, bonds statements", isRequired: false, sortOrder: 2, whereToFind: "Investment company website" },
    { categoryId: 3, name: "Cryptocurrency Holdings", description: "Crypto exchange statements", isRequired: false, sortOrder: 3, whereToFind: "Exchange platform (Coinbase, Binance, etc.)" },
    
    // Real Estate & Property (category 4)
    { categoryId: 4, name: "Property Deeds", description: "Deeds for all real estate owned", isRequired: false, requiresRealEstate: true, sortOrder: 1, whereToFind: "County recorder's office" },
    { categoryId: 4, name: "Mortgage Statements", description: "Current mortgage statements", isRequired: false, requiresRealEstate: true, sortOrder: 2, whereToFind: "Mortgage lender website" },
    { categoryId: 4, name: "Property Appraisals", description: "Recent property valuations", isRequired: false, requiresRealEstate: true, sortOrder: 3, whereToFind: "County assessor or hire appraiser" },
    { categoryId: 4, name: "Vehicle Titles", description: "Car, boat, RV titles", isRequired: false, sortOrder: 4, whereToFind: "DMV or lender if financed" },
    
    // Debts & Liabilities (category 5)
    { categoryId: 5, name: "Credit Card Statements", description: "All credit card statements", isRequired: true, sortOrder: 1, whereToFind: "Credit card company website" },
    { categoryId: 5, name: "Loan Documents", description: "Student loans, personal loans, auto loans", isRequired: true, sortOrder: 2, whereToFind: "Lender website or servicer" },
    { categoryId: 5, name: "Credit Reports", description: "Credit reports from all 3 bureaus", isRequired: true, sortOrder: 3, whereToFind: "AnnualCreditReport.com (free)" },
    
    // Insurance Policies (category 6)
    { categoryId: 6, name: "Health Insurance", description: "Health insurance policies and cards", isRequired: true, sortOrder: 1, whereToFind: "Insurance company or employer HR" },
    { categoryId: 6, name: "Life Insurance", description: "Life insurance policies", isRequired: false, sortOrder: 2, whereToFind: "Insurance company" },
    { categoryId: 6, name: "Auto Insurance", description: "Auto insurance policies", isRequired: true, sortOrder: 3, whereToFind: "Insurance company" },
    
    // Legal Agreements (category 7)
    { categoryId: 7, name: "Prenuptial Agreement", description: "Prenup if one exists", isRequired: false, sortOrder: 1, whereToFind: "Your attorney or personal files" },
    { categoryId: 7, name: "Trust Documents", description: "Any trust agreements", isRequired: false, sortOrder: 2, whereToFind: "Estate planning attorney" },
    
    // Monthly Expenses (category 8)
    { categoryId: 8, name: "Utility Bills", description: "Electric, gas, water bills", isRequired: true, sortOrder: 1, whereToFind: "Utility company websites" },
    { categoryId: 8, name: "Phone Bills", description: "Cell phone and landline bills", isRequired: true, sortOrder: 2, whereToFind: "Phone carrier website" },
    
    // Child-Related (category 9)
    { categoryId: 9, name: "Childcare Expenses", description: "Daycare, after-school program costs", isRequired: false, requiresChildren: true, sortOrder: 1, whereToFind: "Childcare provider" },
    { categoryId: 9, name: "School Records", description: "Report cards, enrollment records", isRequired: false, requiresChildren: true, sortOrder: 2, whereToFind: "School office" },
    { categoryId: 9, name: "Medical Records (Children)", description: "Children's medical and dental records", isRequired: false, requiresChildren: true, sortOrder: 3, whereToFind: "Pediatrician and dentist offices" },
    
    // Business Documents (category 10)
    { categoryId: 10, name: "Business Tax Returns", description: "Business tax returns if self-employed", isRequired: false, requiresBusiness: true, sortOrder: 1, whereToFind: "Your accountant or IRS" },
    { categoryId: 10, name: "Business Financial Statements", description: "P&L, balance sheets", isRequired: false, requiresBusiness: true, sortOrder: 2, whereToFind: "Your accountant or bookkeeper" },
  ];

  for (const docType of docTypes) {
    await db.insert(documentTypes).values(docType).onDuplicateKeyUpdate({ set: docType });
  }

  console.log("✓ Document types seeded");
  console.log("Database seeding complete!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
