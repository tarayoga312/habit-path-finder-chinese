
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./auth/AuthProvider";
import Auth from "./pages/Auth";
import Header from "./components/Header";
import CreateChallenge from "./pages/CreateChallenge";
import ChallengeDetail from "./pages/ChallengeDetail";
import MyChallenges from "./pages/MyChallenges";
import ParticipantDashboard from "./pages/ParticipantDashboard";
import ProgressTrends from "./pages/ProgressTrends";
import JoinChallenge from "./pages/JoinChallenge";
import ResultsReport from "./pages/ResultsReport";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/create-challenge" element={<CreateChallenge />} />
            <Route path="/join-challenge/:id" element={<JoinChallenge />} />
            <Route path="/challenge/:id" element={<ChallengeDetail />} />
            <Route path="/my-challenges" element={<MyChallenges />} />
            <Route path="/my-challenges/:userChallengeId" element={<ParticipantDashboard />} />
            <Route path="/my-challenges/:userChallengeId/progress" element={<ProgressTrends />} />
            <Route path="/my-challenges/:userChallengeId/report" element={<ResultsReport />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
