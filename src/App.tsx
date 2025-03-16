
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ChatbotCreator from "./pages/ChatbotCreator";
import ChatbotsPage from "./pages/ChatbotsPage";
import ChatbotManager from "./pages/ChatbotManager";
import ChatbotPreview from "./pages/ChatbotPreview";
import ChatbotEditor from "./pages/ChatbotEditor";
import SignIn from "./pages/SignIn";
import AdminSignIn from "./pages/AdminSignIn";
import AdminDashboard from "./pages/AdminDashboard";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import AnalyticsPage from "./pages/AnalyticsPage";
import LeadsPage from "./pages/LeadsPage";
import TeamPage from "./pages/TeamPage";
import SettingsPage from "./pages/SettingsPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import IntegrationsPage from "./pages/IntegrationsPage";
import Guides from "./pages/Guides";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import { ChatbotProvider } from "./contexts/ChatbotContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ChatbotProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            
            {/* Client routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/chatbots" element={<ChatbotsPage />} />
            <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
            <Route path="/dashboard/leads" element={<LeadsPage />} />
            <Route path="/dashboard/integrations" element={<IntegrationsPage />} />
            <Route path="/dashboard/team" element={<TeamPage />} />
            <Route path="/dashboard/settings" element={<SettingsPage />} />
            <Route path="/dashboard/subscription" element={<SubscriptionPage />} />
            <Route path="/create-chatbot" element={<ChatbotCreator />} />
            <Route path="/chatbot/:id" element={<ChatbotManager />} />
            <Route path="/chatbot/:id/preview" element={<ChatbotPreview />} />
            <Route path="/chatbot/:id/edit" element={<ChatbotEditor />} />
            
            {/* Authentication routes */}
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Admin routes */}
            <Route path="/admin-sign-in" element={<AdminSignIn />} />
            <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
            
            {/* 404 catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ChatbotProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
