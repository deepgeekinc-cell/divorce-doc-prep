import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import StateSelection from "./pages/StateSelection";
import Checklist from "./pages/Checklist";
import Documents from "./pages/Documents";
import Assistant from "./pages/Assistant";
import Pricing from "./pages/Pricing";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Settings from "./pages/Settings";
import DocumentScanner from "./pages/DocumentScanner";
import PaymentSuccess from "./pages/PaymentSuccess";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/state-selection"} component={StateSelection} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/checklist"} component={Checklist} />
      <Route path={"/documents"} component={Documents} />
      <Route path={"/assistant"} component={Assistant} />
      <Route path={"/pricing"} component={Pricing} />
      <Route path="/payment-success" component={PaymentSuccess} />
      <Route path={"/scan"} component={DocumentScanner} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/privacy"} component={PrivacyPolicy} />
      <Route path={"/terms"} component={TermsOfService} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
