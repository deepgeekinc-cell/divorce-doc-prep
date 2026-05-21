import { useState } from "react";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Loader2, FileText, Download, Lock } from "lucide-react";
import { toast } from "sonner";
import { APP_TITLE } from "@/const";

export default function ShareAccess() {
  const [, params] = useRoute("/share/:token");
  const token = params?.token || "";
  const [password, setPassword] = useState("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [recipientName, setRecipientName] = useState<string | null>(null);

  const accessShare = trpc.share.access.useMutation({
    onSuccess: (data) => {
      setPdfUrl(data.pdfUrl);
      setRecipientName(data.recipientName || "Attorney");
      toast.success("Access granted! Your document package is ready.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      toast.error("Please enter the access password");
      return;
    }
    accessShare.mutate({ token, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-blue-900">{APP_TITLE}</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16 max-w-2xl">
        {!pdfUrl ? (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Lock className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Secure Document Access</CardTitle>
              <CardDescription>
                Enter the password provided by your client to access their divorce document package
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="password">Access Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    disabled={accessShare.isPending}
                    autoFocus
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!password.trim() || accessShare.isPending}
                >
                  {accessShare.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Access Documents"
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 text-center">
                  <strong>For attorneys:</strong> This secure link provides access to your client's organized divorce documents.
                  All access is logged for security purposes.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Document Package Ready</CardTitle>
              <CardDescription>
                {recipientName}'s complete divorce document package
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <p className="text-sm text-gray-700 mb-4">
                  The document package has been generated and is ready for download.
                  It includes all uploaded documents organized by category.
                </p>
                <Button
                  onClick={() => window.open(pdfUrl, "_blank")}
                  size="lg"
                  className="w-full"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Document Package (PDF)
                </Button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-sm">What's Included:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Cover page with client information</li>
                  <li>• Table of contents</li>
                  <li>• Documents organized by category</li>
                  <li>• Category separators and labels</li>
                </ul>
              </div>

              <p className="text-xs text-gray-500 text-center">
                This link will expire after the maximum number of views or on the expiration date set by your client.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Security Notice */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            🔒 All documents are encrypted and transmitted securely
          </p>
        </div>
      </div>
    </div>
  );
}
