import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { APP_TITLE } from "@/const";

export default function Pricing() {
  const { isAuthenticated, user } = useAuth();
  const createCheckout = trpc.payment.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      toast.error("Failed to start checkout: " + error.message);
    },
  });

  const handleUpgrade = async (tier: "complete" | "premium") => {
    if (!isAuthenticated) {
      toast.error("Please sign in to purchase");
      return;
    }
    createCheckout.mutate({ tier });
  };

  const tiers = [
    {
      name: "Complete Package",
      price: "$197",
      tier: "complete" as const,
      description: "AI-powered guidance saves you $1,250-$7,500 in legal fees",
      popular: true,
      features: [
        { text: "AI Paralegal Assistant (unlimited)", included: true },
        { text: "Step-by-step website navigation guides", included: true },
        { text: "All 50 states + state-specific requirements", included: true },
        { text: "All 10 document categories (30+ types)", included: true },
        { text: "Unlimited document uploads & storage", included: true },
        { text: "Lifetime access to organized documents", included: true },
        { text: "One-click PDF export", included: false },
      ],
    },
    {
      name: "Premium Package",
      price: "$297",
      tier: "premium" as const,
      description: "For high-net-worth divorces with complex assets",
      features: [
        { text: "Everything in Complete Package", included: true },
        { text: "One-click PDF export of all documents", included: true },
        { text: "Multi-property & business tracking", included: true },
        { text: "Business valuation document guidance", included: true },
        { text: "Complex investment account tracking", included: true },
        { text: "Priority access to new features", included: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{APP_TITLE}</h1>
          {isAuthenticated && (
            <Button variant="outline" onClick={() => window.location.href = "/dashboard"}>
              Go to Dashboard
            </Button>
          )}
        </div>
      </header>

      {/* Savings Calculator */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-xl text-gray-600 mb-8">
            Save thousands in legal fees by preparing your documents yourself
          </p>
          
          <Card className="max-w-2xl mx-auto bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-2xl">Potential Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600">5-15 hours</div>
                  <div className="text-sm text-gray-600">Attorney time saved</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">$250-$500</div>
                  <div className="text-sm text-gray-600">Per hour attorney rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">$1,250-$7,500</div>
                  <div className="text-sm text-gray-600">Total potential savings</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Tiers */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier) => (
            <Card 
              key={tier.tier}
              className={`relative ${tier.popular ? 'border-blue-500 border-2 shadow-lg' : ''}`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    ⭐ MOST POPULAR
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-5xl font-bold">{tier.price}</span>
                  <span className="text-gray-600"> one-time</span>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? "text-gray-900" : "text-gray-400"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  size="lg"
                  variant={tier.popular ? "default" : "outline"}
                  onClick={() => handleUpgrade(tier.tier)}
                  disabled={createCheckout.isPending}
                >
                  {createCheckout.isPending ? "Processing..." : `Get ${tier.name}`}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ/Guarantee Section */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">Why Choose {APP_TITLE}?</h3>
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle>One-Time Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  No subscriptions, no recurring fees. Pay once and keep access to your documents forever.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Massive Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Save $1,250-$7,500 in attorney fees by gathering documents yourself with AI guidance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
