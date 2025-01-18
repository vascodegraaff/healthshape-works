import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import History from "./pages/History";
import { useEffect } from "react";
import { syncManager } from "@/lib/syncManager";
import ExerciseLibrary from "./pages/ExerciseLibrary";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    syncManager.initialize();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/history" element={<History/>} />
            <Route path="/exercises" element={<ExerciseLibrary />} />
            <Route path="/social" element={<Index />} />
            <Route path="/profile" element={<Index />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;