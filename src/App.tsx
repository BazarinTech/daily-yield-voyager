
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Packages from "./pages/Packages";
import Investments from "./pages/Investments";
import InvestmentDetail from "./pages/InvestmentDetail";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Transactions from "./pages/Transactions";
import Team from "./pages/Team";
import Profile from "./pages/Profile";
import Bonus from "./pages/Bonus";
import AuthProvider from "./contexts/AuthContext";
import ProtectedRoute from "./route/ProtectedRoute";

const queryClient = new QueryClient();

// Create a function component for the app to properly use React hooks
const App = () => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/packages" element={<ProtectedRoute><Packages /></ProtectedRoute>} />
            <Route path="/investments" element={<ProtectedRoute><Investments /></ProtectedRoute>} />
            <Route path="/investments/:id" element={<ProtectedRoute><InvestmentDetail /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
            <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/bonus" element={<ProtectedRoute><Bonus /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;
