import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_TITLE, getLoginUrl } from "@/const";
import { CheckCircle2, FileText, MessageSquare, Shield, Clock, DollarSign } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    } else {
      window.location.href = getLoginUrl();
    }
  };

  const features = [
    {
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      title: "State-Specific Guidance",
      description: "Get customized document checklists based on your state's divorce requirements and your unique situation."
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-blue-600" />,
      title: "AI-Powered Assistant",
      description: "Expert AI guidance helps you find every document online, from tax returns to property deeds."
    },
    {
      icon: <CheckCircle2 className="h-8 w-8 text-blue-600" />,
      title: "Track Your Progress",
      description: "Visual checklist keeps you organized and shows exactly what's left to gather."
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Secure Storage",
      description: "Upload and organize all your documents in one secure, encrypted location."
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-600" />,
      title: "Save Time",
      description: "Arrive at your first lawyer meeting fully prepared, eliminating weeks of back-and-forth."
    },
    {
      icon: <DollarSign className="h-8 w-8 text-blue-600" />,
      title: "Save Money",
      description: "Reduce attorney billable hours by $1,250-$7,500 by doing document prep yourself."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Prepare for Your Divorce Meeting with Confidence
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Stop paying lawyers $250-$500/hour to chase down documents. Our intelligent platform guides you through gathering every required document before your first meeting, potentially saving you thousands in legal fees.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => setLocation("/pricing")}
              className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700"
            >
              Get Started - $197
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => {
                const element = document.getElementById('how-it-works');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-lg px-8 py-6"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Cost Savings Highlight */}
        <Card className="max-w-3xl mx-auto mb-16 border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Potential Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
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

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose {APP_TITLE}?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div id="how-it-works" className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="max-w-3xl mx-auto space-y-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">1</div>
                  <CardTitle>Select Your State</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Tell us which state you're filing in and answer a few questions about your situation (children, property, business interests).</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">2</div>
                  <CardTitle>Get Your Custom Checklist</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Receive a personalized document checklist tailored to your state's requirements and your specific circumstances.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">3</div>
                  <CardTitle>Gather Documents with AI Help</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Our AI assistant guides you to find each document online - from IRS transcripts to bank statements to property records.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">4</div>
                  <CardTitle>Upload and Organize</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Securely upload and organize all documents in one place, ready to share with your attorney.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">5</div>
                  <CardTitle>Meet Your Lawyer Prepared</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Show up to your first meeting with everything organized, saving thousands in billable hours.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="max-w-3xl mx-auto bg-blue-600 text-white border-0">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-white">Ready to Get Started?</CardTitle>
            <CardDescription className="text-blue-100 text-center text-lg">
              Join thousands who have saved time and money on their divorce preparation
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => setLocation("/pricing")}
              className="text-lg px-8 py-6"
            >
              Get Started Now - $197
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">{APP_TITLE}</h3>
              <p className="text-gray-400">
                Prepare for your divorce meeting with confidence. Save thousands in legal fees.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/privacy" className="text-gray-400 hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-gray-400 hover:text-white transition">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Security</h4>
              <ul className="space-y-2 text-gray-400">
                <li>🔒 256-bit AES encryption</li>
                <li>🛡️ HTTPS/TLS security</li>
                <li>🔐 OAuth 2.0 authentication</li>
                <li>✅ GDPR & CCPA compliant</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 DivorceDocPrep. All rights reserved. Not a law firm. Does not provide legal advice.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
