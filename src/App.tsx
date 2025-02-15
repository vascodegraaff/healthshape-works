import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import History from "./pages/History";
import { useEffect } from "react";
import { syncManager } from "@/lib/syncManager";
import ExerciseLibrary from "./pages/ExerciseLibrary";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import { supabase } from '@/lib/supabase';
import { App as CapApp } from '@capacitor/app';

const queryClient = new QueryClient();

// Create a new component to handle auth redirects
const AuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/', { replace: true });
      }
    });

    // Handle deep links for Capacitor
    CapApp.addListener('appUrlOpen', async ({ url }) => {
      // Example url: com.example.app://login#access_token=123&refresh_token=456
      if (url.includes('access_token') || url.includes('refresh_token')) {
        // Extract the tokens from the URL
        const params = new URLSearchParams(url.split('#')[1]);
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');

        if (access_token && refresh_token) {
          // Set the session in Supabase
          const { data: { session }, error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (session && !error) {
            navigate('/', { replace: true });
          }
        }
      }
    });

    return () => {
      CapApp.removeAllListeners();
    };
  }, [navigate]);

  return null;
};

const App = () => {
  useEffect(() => {
    syncManager.initialize();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthRedirect />
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Index />} />
                <Route path="/history" element={<History/>} />
                <Route path="/exercises" element={<ExerciseLibrary />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;