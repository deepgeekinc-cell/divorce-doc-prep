import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, FileText, MessageSquare, Settings } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  
  const { data: profile } = trpc.profile.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  
  const { data: progress } = trpc.checklist.getProgress.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  
  const { data: documents } = trpc.documents.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  
  const hasCompletedSetup = profile?.selectedState;
  
  const { data: guidance } = trpc.guidance.getNextStep.useQuery(undefined, {
    enabled: isAuthenticated && !!hasCompletedSetup,
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const totalItems = progress?.length || 0;
  const completedItems = progress?.filter(p => p.isCompleted).length || 0;
  const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  const documentCount = documents?.length || 0;

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <FileText className="h-5 w-5" /> },
    { label: "Checklist", path: "/checklist", icon: <CheckCircle2 className="h-5 w-5" /> },
    { label: "Documents", path: "/documents", icon: <FileText className="h-5 w-5" /> },
    { label: "AI Assistant", path: "/assistant", icon: <MessageSquare className="h-5 w-5" /> },
    { label: "Settings", path: "/settings", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <DashboardLayout navItems={navItems}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.name || "there"}!</h1>
          <p className="text-gray-600 mt-2">
            {hasCompletedSetup 
              ? `Track your divorce document preparation progress for ${profile.selectedState}`
              : "Let's get started with your divorce document preparation"}
          </p>
        </div>

        {!hasCompletedSetup ? (
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle>Complete Your Setup</CardTitle>
              <CardDescription>
                Start by selecting your state and answering a few questions to get your personalized document checklist.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setLocation("/state-selection")}>
                Select Your State
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Next Step Guidance Card */}
            {guidance && guidance.nextStep && (
              <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl">
                        {guidance.progress.milestone || "Your Next Step"}
                      </CardTitle>
                      <CardDescription className="text-base mt-2 text-gray-700">
                        {guidance.motivationalMessage}
                      </CardDescription>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-4xl font-bold text-blue-600">
                        {guidance.progress.percentageComplete}%
                      </div>
                      <div className="text-sm text-gray-600">Complete</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${guidance.progress.percentageComplete}%` }}
                      />
                    </div>
                    
                    {/* Next Step Card */}
                    <div className="bg-white p-6 rounded-lg border-2 border-blue-300 shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-blue-900">
                            📋 {guidance.nextStep.title}
                          </h3>
                          <p className="text-gray-600 mt-2">
                            {guidance.nextStep.description}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-sm font-medium text-gray-600">
                            Est. Time
                          </div>
                          <div className="text-lg font-bold text-blue-600">
                            ⏱️ {guidance.nextStep.estimatedTime}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button 
                          onClick={() => setLocation(guidance.nextStep!.actionUrl)}
                          size="lg"
                          className="gap-2"
                        >
                          <MessageSquare className="h-5 w-5" />
                          {guidance.nextStep.action}
                        </Button>
                        
                        <Button 
                          onClick={() => setLocation("/checklist")}
                          variant="outline"
                          size="lg"
                        >
                          View All Documents
                        </Button>
                      </div>
                    </div>
                    
                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          ✅ {guidance.progress.completedDocuments}
                        </div>
                        <div className="text-sm text-gray-600">Completed</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          📝 {guidance.progress.totalDocuments - guidance.progress.completedDocuments}
                        </div>
                        <div className="text-sm text-gray-600">Remaining</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          💰 ${guidance.progress.estimatedMoneySaved.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Saved So Far</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">Overall Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{progressPercentage}%</div>
                  <Progress value={progressPercentage} className="h-2" />
                  <p className="text-sm text-gray-600 mt-2">{completedItems} of {totalItems} items complete</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">Documents Uploaded</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{documentCount}</div>
                  <p className="text-sm text-gray-600">files securely stored</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">Your State</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{profile.selectedState}</div>
                  <Button variant="link" className="p-0 h-auto text-sm" onClick={() => setLocation("/state-selection")}>Change state</Button>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start h-auto py-4" onClick={() => setLocation("/checklist")}>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">View Checklist</div>
                    <div className="text-sm text-gray-600">See what documents you need</div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-4" onClick={() => setLocation("/documents")}>
                  <FileText className="mr-2 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">Upload Documents</div>
                    <div className="text-sm text-gray-600">Add your collected files</div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-4" onClick={() => setLocation("/assistant")}>
                  <MessageSquare className="mr-2 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">Ask AI Assistant</div>
                    <div className="text-sm text-gray-600">Get help finding documents</div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-4" onClick={() => setLocation("/state-selection")}>
                  <Settings className="mr-2 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">Update Profile</div>
                    <div className="text-sm text-gray-600">Change your situation details</div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
