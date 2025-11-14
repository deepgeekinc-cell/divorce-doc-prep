/**
 * Stripe product and price definitions for DivorceDocPrep
 * 
 * These products represent the three paid tiers of access to the platform.
 * Prices are in cents (USD).
 */

export const PRODUCTS = {
  COMPLETE: {
    name: "Complete Package",
    description: "AI-powered document guidance that saves you $1,250-$7,500 in legal fees. Get expert help finding every document online.",
    priceId: "price_1STGP8Jzp75NKUCe7b22r0rk",
    productId: "prod_TQ6cjOMWqGyJ9h",
    priceInCents: 19700, // $197.00
    tier: "complete" as const,
    features: [
      "AI Paralegal Assistant (unlimited)",
      "Step-by-step website navigation guides",
      "All 50 states + state-specific requirements",
      "All 10 document categories (30+ document types)",
      "Unlimited document uploads & storage",
      "Lifetime access to your organized documents",
    ],
    popular: true,
  },
  PREMIUM: {
    name: "Premium Package",
    description: "Everything in Complete plus PDF export and advanced tracking for high-net-worth divorces.",
    priceId: "price_1STGPEJzp75NKUCe4vusOdLq",
    productId: "prod_TQ6cwkCb5WYDlF",
    priceInCents: 29700, // $297.00
    tier: "premium" as const,
    features: [
      "Everything in Complete Package",
      "One-click PDF export of all documents",
      "Multi-property & business tracking",
      "Business valuation document guidance",
      "Complex investment account tracking",
      "Priority access to new features",
    ],
  },
} as const;

export type PaymentTier = "free" | "basic" | "complete" | "premium";

/**
 * Check if a user has access to a specific feature based on their payment tier
 */
export function hasFeatureAccess(userTier: PaymentTier, requiredTier: PaymentTier): boolean {
  const tierHierarchy: PaymentTier[] = ["free", "basic", "complete", "premium"];
  const userIndex = tierHierarchy.indexOf(userTier);
  const requiredIndex = tierHierarchy.indexOf(requiredTier);
  return userIndex >= requiredIndex;
}

/**
 * Get feature gates for each tier
 */
export const FEATURE_GATES = {
  AI_ASSISTANT: "complete" as PaymentTier,
  UNLIMITED_UPLOADS: "complete" as PaymentTier,
  CHILD_DOCUMENTS: "complete" as PaymentTier,
  PROPERTY_DOCUMENTS: "complete" as PaymentTier,
  BUSINESS_DOCUMENTS: "complete" as PaymentTier,
  PDF_EXPORT: "premium" as PaymentTier,
} as const;

/**
 * Maximum document uploads by tier
 */
export const UPLOAD_LIMITS = {
  free: 0, // Can't upload in free tier
  basic: 30,
  complete: -1, // -1 means unlimited
  premium: -1,
} as const;
