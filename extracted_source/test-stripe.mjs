import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

console.log("Testing Stripe connection...");
console.log("Secret key exists:", !!process.env.STRIPE_SECRET_KEY);
console.log("Secret key prefix:", process.env.STRIPE_SECRET_KEY?.substring(0, 7));

try {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price: "price_1STEZOJzp75NKUCelbbSmDJl", // Complete package price ID
        quantity: 1,
      },
    ],
    success_url: "https://example.com/success",
    cancel_url: "https://example.com/cancel",
    client_reference_id: "test123",
    metadata: {
      tier: "complete",
      userId: "test123",
    },
  });
  
  console.log("✅ Checkout session created successfully!");
  console.log("Session ID:", session.id);
  console.log("Checkout URL:", session.url);
} catch (error) {
  console.error("❌ Error creating checkout session:");
  console.error(error.message);
  console.error("Full error:", error);
}
