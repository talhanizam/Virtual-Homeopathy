"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientBrowser } from '@/lib/supabase-browser';

interface AuthHandlerProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AuthHandler({ children, fallback }: AuthHandlerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClientBrowser();
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth error:', error);
          setIsAuthenticated(false);
        } else if (session) {
          setIsAuthenticated(true);
        } else {
          // Check if we're coming from an OAuth callback
          const urlParams = new URLSearchParams(window.location.search);
          const code = urlParams.get('code');
          
          if (code) {
            // We're in an OAuth callback, wait a bit for the session to be established
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const { data: { session: newSession } } = await supabase.auth.getSession();
            if (newSession) {
              setIsAuthenticated(true);
              // Clean up the URL
              const newUrl = window.location.pathname;
              window.history.replaceState({}, '', newUrl);
            } else {
              setIsAuthenticated(false);
            }
          } else {
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A8A] mx-auto mb-4"></div>
          <p className="text-[#6B7280]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#374151] mb-4">Please login to continue</p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-[#1E3A8A] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
