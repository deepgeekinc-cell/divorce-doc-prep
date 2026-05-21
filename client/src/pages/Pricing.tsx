import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Pricing() {
  const { user, isAuthenticated } = useAuth();

  const createCheckout = trpc.payment.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      toast.error(`Checkout failed: ${error.message}`);
    },
  });

  const handlePurchase = (tier: "complete" | "premium") => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    createCheckout.mutate({ tier });
  };

  const plans = [
    {
      name: "Complete Package",
      price: "$197",
      tier: "complete" as const,
      description: "Everything you need to prepare for your divorce",
      features: [
        "State-specific document checklist",
        "AI-powered document assistant",
        "Unlimited document uploads",
        "Secure cloud storage",
        "Professional PDF export",
        "Progress tracking",
        "All 50 states supported",
      ],
      popular: true,
    },
    {
      name: "Premium Package",
      price: "$297",
      tier: "premium" as const,
      description: "For complex cases with extensive assets",
      features: [
        "Everything in Complete Package",
        "Priority AI assistance",
        "Advanced document organization",
        "Secure attorney sharing",
        "Document extraction (OCR)",
        "Extended storage (2 years)",
        "Premium support",
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold text-blue-900 cursor-pointer">{APP_TITLE}</h1>
          </Link>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button variant="ghost">Sign In</Button>
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            One-time payment. No subscriptions. Lifetime access to your documents.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.tier}
              className={`relative ${
                plan.popular ? "border-blue-600 border-2 shadow-xl" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <div className="text-5xl font-bold text-blue-600 mb-2">
                  {plan.price}
                </div>
                <CardDescription className="text-base">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  size="lg"
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handlePurchase(plan.tier)}
                  disabled={createCheckout.isPending}
                >
                  {createCheckout.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Money-Back Guarantee */}
        <div className="text-center mt-16 max-w-3xl mx-auto">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold text-green-900 mb-2">
                💰 Satisfaction Guaranteed
              </h3>
              <p className="text-green-800">
                If our platform doesn't save you at least $1,000 in legal fees, we'll refund your purchase. No questions asked.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is this a subscription?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  No! This is a one-time payment. You get lifetime access to your documents and can download them anytime.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How much can I really save?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Divorce attorneys typically charge $250-$500/hour. Document gathering can take 5-15 hours of billable time. By doing it yourself with our guidance, you can save $1,250-$7,500.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is my data secure?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes. We use bank-level 256-bit encryption for all documents. Your data is stored securely in the cloud and only you have access to it.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
