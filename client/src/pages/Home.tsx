import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, FileText, MessageSquare, Shield, Clock, DollarSign } from "lucide-react";
import { Link } from "wouter";
import { APP_TITLE, getLoginUrl } from "@/const";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-900">{APP_TITLE}</h1>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Link href="/pricing">
                  <Button>Get Started</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/pricing">
                  <Button variant="ghost">Pricing</Button>
                </Link>
                <a href={getLoginUrl()}>
                  <Button>Sign In</Button>
                </a>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Prepare for Your Divorce Meeting
          <br />
          <span className="text-blue-600">Save Thousands in Legal Fees</span>
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Gather all required documents before meeting your attorney. Our AI-powered platform guides you step-by-step, 
          potentially saving $1,250-$7,500 in billable hours.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/pricing">
            <Button size="lg" className="text-lg px-8">
              Get Started Now
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="outline" className="text-lg px-8">
              View Pricing
            </Button>
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Why DivorceDocPrep?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <DollarSign className="h-12 w-12 text-green-600 mb-4" />
                <h4 className="text-xl font-bold mb-2">Save Money</h4>
                <p className="text-gray-600">
                  Reduce attorney billable hours by $1,250-$7,500 by doing document prep yourself
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Clock className="h-12 w-12 text-blue-600 mb-4" />
                <h4 className="text-xl font-bold mb-2">Save Time</h4>
                <p className="text-gray-600">
                  Arrive at your first lawyer meeting fully prepared, eliminating weeks of back-and-forth
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <MessageSquare className="h-12 w-12 text-purple-600 mb-4" />
                <h4 className="text-xl font-bold mb-2">AI-Powered Guidance</h4>
                <p className="text-gray-600">
                  Expert AI assistant helps you find every document online, from tax returns to property deeds
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Complete Document Preparation</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              "State-specific document checklists",
              "AI assistant for finding documents online",
              "Secure cloud storage for all files",
              "Progress tracking and organization",
              "Professional PDF export for attorneys",
              "All 50 states supported"
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-lg">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-blue-50 py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Select Your State", desc: "Choose where you'll be filing for divorce" },
              { step: "2", title: "Get Your Checklist", desc: "Receive a customized document list based on your situation" },
              { step: "3", title: "Gather Documents", desc: "Use our AI assistant to find each document online" },
              { step: "4", title: "Meet Your Lawyer", desc: "Show up fully prepared with all documents organized" }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Shield className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h3 className="text-3xl font-bold mb-4">Your Privacy & Security Matter</h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            All documents are encrypted and stored securely. We use bank-level security to protect your sensitive information.
          </p>
          <div className="flex gap-4 justify-center text-sm text-gray-500">
            <span>🔒 256-bit Encryption</span>
            <span>•</span>
            <span>☁️ Secure Cloud Storage</span>
            <span>•</span>
            <span>🛡️ GDPR Compliant</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold mb-6">Ready to Get Started?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of people who have saved thousands on legal fees
          </p>
          <Link href="/pricing">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              View Pricing & Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 {APP_TITLE}. All rights reserved.
          </p>
          <div className="mt-4 flex gap-6 justify-center text-sm">
            <a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a>
            <a href="/terms" className="text-gray-400 hover:text-white">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
