
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

const queryClient = new QueryClient();

// Create a function component for the app to properly use React hooks
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/investments/:id" element={<InvestmentDetail />} />
          <Route path="/history" element={<History />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/team" element={<Team />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/bonus" element={<Bonus />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
