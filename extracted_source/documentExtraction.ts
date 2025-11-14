import { invokeLLM } from "./_core/llm";

/**
 * Document extraction service using vision AI
 * Analyzes document images and extracts structured data
 */

export interface ExtractedData {
  documentType: string;
  confidence: number;
  fields: Record<string, any>;
  rawText?: string;
}

export interface DocumentExtractionRules {
  [key: string]: {
    description: string;
    fields: string[];
    examples: string[];
  };
}

// Define extraction rules for each document type
export const EXTRACTION_RULES: DocumentExtractionRules = {
  "Tax Return (1040)": {
    description: "Federal income tax return form 1040",
    fields: [
      "filing_status",
      "tax_year",
      "taxpayer_name",
      "spouse_name",
      "ssn",
      "spouse_ssn",
      "total_income",
      "adjusted_gross_income",
      "taxable_income",
      "total_tax",
      "refund_or_owed",
      "dependents",
    ],
    examples: ["Form 1040", "U.S. Individual Income Tax Return"],
  },
  "W-2 Wage Statement": {
    description: "Employer wage and tax statement",
    fields: [
      "employer_name",
      "employer_ein",
      "employee_name",
      "employee_ssn",
      "wages_tips_compensation",
      "federal_income_tax_withheld",
      "social_security_wages",
      "medicare_wages",
      "tax_year",
    ],
    examples: ["Form W-2", "Wage and Tax Statement"],
  },
  "Bank Statement": {
    description: "Monthly bank account statement",
    fields: [
      "bank_name",
      "account_holder_name",
      "account_number",
      "statement_period",
      "beginning_balance",
      "ending_balance",
      "total_deposits",
      "total_withdrawals",
      "account_type",
    ],
    examples: ["Bank Statement", "Account Summary"],
  },
  "Pay Stub": {
    description: "Employee paycheck stub",
    fields: [
      "employer_name",
      "employee_name",
      "pay_period",
      "pay_date",
      "gross_pay",
      "net_pay",
      "ytd_gross",
      "ytd_net",
      "deductions",
      "taxes_withheld",
    ],
    examples: ["Pay Stub", "Paycheck", "Earnings Statement"],
  },
  "Property Deed": {
    description: "Real estate property deed",
    fields: [
      "property_address",
      "owner_names",
      "deed_type",
      "recording_date",
      "parcel_number",
      "legal_description",
      "assessed_value",
      "county",
    ],
    examples: ["Warranty Deed", "Quitclaim Deed", "Property Deed"],
  },
  "Retirement Account Statement": {
    description: "401k, IRA, or other retirement account statement",
    fields: [
      "account_type",
      "account_number",
      "account_holder_name",
      "statement_date",
      "current_balance",
      "contributions_ytd",
      "employer_match",
      "investment_breakdown",
      "beneficiaries",
    ],
    examples: ["401(k) Statement", "IRA Statement", "Retirement Account"],
  },
  "Credit Report": {
    description: "Consumer credit report",
    fields: [
      "consumer_name",
      "report_date",
      "credit_score",
      "credit_accounts",
      "total_debt",
      "payment_history",
      "inquiries",
      "public_records",
    ],
    examples: ["Credit Report", "FICO Score", "Experian", "Equifax", "TransUnion"],
  },
  "Vehicle Title": {
    description: "Motor vehicle title/registration",
    fields: [
      "vin",
      "make",
      "model",
      "year",
      "owner_name",
      "title_number",
      "lien_holder",
      "issue_date",
      "odometer_reading",
    ],
    examples: ["Certificate of Title", "Vehicle Title", "Car Title"],
  },
  "Mortgage Statement": {
    description: "Home mortgage loan statement",
    fields: [
      "lender_name",
      "borrower_name",
      "loan_number",
      "property_address",
      "statement_date",
      "principal_balance",
      "interest_rate",
      "monthly_payment",
      "escrow_balance",
      "ytd_interest_paid",
    ],
    examples: ["Mortgage Statement", "Home Loan Statement"],
  },
  "Insurance Policy": {
    description: "Insurance policy document",
    fields: [
      "policy_type",
      "policy_number",
      "policyholder_name",
      "insurance_company",
      "coverage_amount",
      "premium_amount",
      "effective_date",
      "expiration_date",
      "beneficiaries",
    ],
    examples: ["Insurance Policy", "Life Insurance", "Auto Insurance", "Home Insurance"],
  },
};

/**
 * Analyze document image and extract structured data using vision AI
 */
export async function extractDocumentData(
  imageUrl: string,
  suggestedType?: string
): Promise<ExtractedData> {
  // Build system prompt with extraction rules
  const systemPrompt = `You are an expert paralegal assistant specializing in divorce document analysis. 
Your task is to analyze document images and extract structured data with high accuracy.

EXTRACTION RULES:
${Object.entries(EXTRACTION_RULES)
  .map(
    ([type, rules]) =>
      `${type}: ${rules.description}\nFields to extract: ${rules.fields.join(", ")}`
  )
  .join("\n\n")}

INSTRUCTIONS:
1. First, identify the document type from the image
2. Extract all relevant fields for that document type
3. Return ONLY valid JSON with this exact structure:
{
  "documentType": "exact type from EXTRACTION_RULES",
  "confidence": 0.0-1.0,
  "fields": {
    "field_name": "extracted value",
    ...
  },
  "rawText": "any important text not captured in fields"
}

4. Use null for fields that cannot be found
5. Be precise with numbers (no commas in numeric values)
6. Extract dates in YYYY-MM-DD format when possible
7. For currency, extract numeric value only (no $ symbol)`;

  const userPrompt = suggestedType
    ? `Analyze this ${suggestedType} document and extract all relevant data.`
    : `Analyze this document, identify its type, and extract all relevant data.`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            { type: "text", text: userPrompt },
            { type: "image_url", image_url: { url: imageUrl, detail: "high" } },
          ] as any,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "document_extraction",
          strict: true,
          schema: {
            type: "object",
            properties: {
              documentType: { type: "string" },
              confidence: { type: "number" },
              fields: {
                type: "object",
                additionalProperties: true,
              },
              rawText: { type: "string" },
            },
            required: ["documentType", "confidence", "fields"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from vision AI");
    }

    const extracted: ExtractedData = JSON.parse(content as string);
    return extracted;
  } catch (error) {
    console.error("Document extraction error:", error);
    throw new Error(`Failed to extract document data: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Get suggested fields for a document type
 */
export function getDocumentFields(documentType: string): string[] {
  const rules = EXTRACTION_RULES[documentType];
  return rules ? rules.fields : [];
}

/**
 * Get all supported document types
 */
export function getSupportedDocumentTypes(): string[] {
  return Object.keys(EXTRACTION_RULES);
}
