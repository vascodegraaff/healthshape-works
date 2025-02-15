import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import { Capacitor } from '@capacitor/core';

const Login = () => {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      // Use different redirect URLs for web and native platforms
      const redirectTo = Capacitor.isNativePlatform() 
        ? 'com.motion.app://login' // Match your app scheme from capacitor.config.ts
        : `${window.location.origin}/`;

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
          shouldCreateUser: true,
        }
      });

      if (error) throw error;

      // Different messages for web and mobile
      if (Capacitor.isNativePlatform()) {
        setMessage('Check your email and tap the login link. The app will open automatically.');
      } else {
        setMessage('Check your email for the login link!');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setMessage(error.message || 'Error sending magic link. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Motions</h1>
          <p className="text-muted-foreground">
            Track your workouts and achieve your fitness goals
          </p>
        </div>

        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
              autoComplete="email"
              inputMode="email"
            />
          </div>

          <Button 
            type="submit"
            className="w-full flex items-center justify-center gap-2" 
            size="lg"
            disabled={isSubmitting}
          >
            <Mail className="w-5 h-5" />
            {isSubmitting ? 'Sending...' : 'Sign in with Email'}
          </Button>

          {message && (
            <p className={`text-sm text-center ${
              message.includes('Error') ? 'text-destructive' : 'text-accent'
            }`}>
              {message}
            </p>
          )}
        </form>

        <p className="text-center text-sm text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Login; 