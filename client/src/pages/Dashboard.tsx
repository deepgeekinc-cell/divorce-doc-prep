import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { FileText, MessageSquare, Upload, Settings, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { getLoginUrl } from "@/const";

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: profile } = trpc.profile.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: documents } = trpc.documents.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: progress } = trpc.checklist.progress.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  if (!profile?.selectedState) {
    setLocation("/state-selection");
    return null;
  }

  const totalDocuments = progress?.length || 0;
  const completedDocuments = progress?.filter((p) => p.isCompleted).length || 0;
  const progressPercentage = totalDocuments > 0 ? Math.round((completedDocuments / totalDocuments) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-900">DivorceDocPrep</h1>
          <div className="flex gap-4 items-center">
            <span className="text-sm text-gray-600">Welcome, {user?.name || "User"}</span>
            <Link href="/assistant">
              <Button variant="ghost" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>
              {completedDocuments} of {totalDocuments} documents collected
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progressPercentage} className="h-3" />
            <p className="text-sm text-gray-600 mt-2">{progressPercentage}% complete</p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/documents">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Upload className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Upload Documents</h3>
                <p className="text-gray-600">
                  Upload and organize your divorce documents
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/assistant">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <MessageSquare className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">AI Assistant</h3>
                <p className="text-gray-600">
                  Get help finding documents online
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/documents">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <FileText className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Export Package</h3>
                <p className="text-gray-600">
                  Download all documents as PDF
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
            <CardDescription>
              Your most recently uploaded documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            {documents && documents.length > 0 ? (
              <div className="space-y-3">
                {documents.slice(0, 5).map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{doc.fileName}</p>
                        <p className="text-sm text-gray-600">{doc.categoryName}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">
                No documents uploaded yet. Start by uploading your first document!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
