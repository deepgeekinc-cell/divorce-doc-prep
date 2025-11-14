import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function StateSelection() {
  const [, setLocation] = useLocation();
  const [selectedState, setSelectedState] = useState("");
  const [hasChildren, setHasChildren] = useState(false);
  const [hasBusinessInterests, setHasBusinessInterests] = useState(false);
  const [hasRealEstate, setHasRealEstate] = useState(false);
  const [hasRetirementAccounts, setHasRetirementAccounts] = useState(false);

  const { data: states, isLoading: statesLoading } = trpc.states.list.useQuery();
  const upsertProfile = trpc.profile.upsert.useMutation({
    onSuccess: () => {
      toast.success("Profile saved successfully!");
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast.error(`Failed to save profile: ${error.message}`);
    },
  });

  const handleSubmit = () => {
    if (!selectedState) {
      toast.error("Please select your state");
      return;
    }

    upsertProfile.mutate({
      selectedState,
      hasChildren,
      hasBusinessInterests,
      hasRealEstate,
      hasRetirementAccounts,
    });
  };

  if (statesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Let's Get Started</h1>
          <p className="text-gray-600 mt-2">
            Tell us about your situation so we can customize your document checklist
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Your State</CardTitle>
            <CardDescription>
              Choose the state where you'll be filing for divorce
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent>
                {states?.map((state) => (
                  <SelectItem key={state.stateCode} value={state.stateCode}>
                    {state.stateName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Your Situation</CardTitle>
            <CardDescription>
              Answer these questions to customize your document checklist
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="children">Do you have children?</Label>
                <p className="text-sm text-gray-600">
                  This will add child-related documents to your checklist
                </p>
              </div>
              <Switch
                id="children"
                checked={hasChildren}
                onCheckedChange={setHasChildren}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="business">Do you own a business?</Label>
                <p className="text-sm text-gray-600">
                  Includes business tax returns and financial statements
                </p>
              </div>
              <Switch
                id="business"
                checked={hasBusinessInterests}
                onCheckedChange={setHasBusinessInterests}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="realestate">Do you own real estate?</Label>
                <p className="text-sm text-gray-600">
                  Includes property deeds, mortgages, and appraisals
                </p>
              </div>
              <Switch
                id="realestate"
                checked={hasRealEstate}
                onCheckedChange={setHasRealEstate}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="retirement">Do you have retirement accounts?</Label>
                <p className="text-sm text-gray-600">
                  Includes 401(k), IRA, pension statements
                </p>
              </div>
              <Switch
                id="retirement"
                checked={hasRetirementAccounts}
                onCheckedChange={setHasRetirementAccounts}
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex gap-4">
          <Button
            onClick={handleSubmit}
            disabled={!selectedState || upsertProfile.isPending}
            className="flex-1"
            size="lg"
          >
            {upsertProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
