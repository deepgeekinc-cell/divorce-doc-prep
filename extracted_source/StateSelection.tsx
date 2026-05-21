  }

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <FileText className="h-5 w-5" /> },
    { label: "Checklist", path: "/checklist", icon: <CheckCircle2 className="h-5 w-5" /> },
    { label: "Documents", path: "/documents", icon: <FileText className="h-5 w-5" /> },
    { label: "AI Assistant", path: "/assistant", icon: <MessageSquare className="h-5 w-5" /> },
    { label: "Settings", path: "/state-selection", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <DashboardLayout navItems={navItems}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-gray-600 mt-2">
            Tell us about your situation to get a personalized document checklist
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Your State</CardTitle>
              <CardDescription>
                Select the state where you'll be filing for divorce
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="state">State</Label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    {statesLoading ? (
                      <SelectItem value="loading" disabled>Loading states...</SelectItem>
                    ) : (
                      states?.map((state) => (
                        <SelectItem key={state.stateCode} value={state.stateCode}>
                          {state.stateName}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
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