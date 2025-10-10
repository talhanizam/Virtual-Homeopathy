"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientBrowser } from '@/lib/supabase-browser';
import FloatingShapes from '@/components/FloatingShapes';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const supabase = createClientBrowser();
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setError(error.message);
          setStatus('error');
          return;
        }

        if (data.session) {
          setStatus('success');
          // Redirect to the intended page after a short delay
          const nextUrl = searchParams.get('next') || '/account';
          setTimeout(() => {
            router.push(nextUrl);
          }, 1000);
        } else {
          // If no session, try to get it from the URL hash
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          
          if (accessToken && refreshToken) {
            const { error: setSessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            
            if (setSessionError) {
              setError(setSessionError.message);
              setStatus('error');
            } else {
              setStatus('success');
              const nextUrl = searchParams.get('next') || '/account';
              setTimeout(() => {
                router.push(nextUrl);
              }, 1000);
            }
          } else {
            setError('No authentication data found');
            setStatus('error');
          }
        }
      } catch (err) {
        setError('An unexpected error occurred');
        setStatus('error');
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  if (status === 'loading') {
    return (
      <main className="relative min-h-screen bg-white">
        <FloatingShapes />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A8A] mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-[#111827] mb-2">Completing sign in...</h2>
            <p className="text-[#6B7280]">Please wait while we authenticate your account.</p>
          </div>
        </div>
      </main>
    );
  }

  if (status === 'success') {
    return (
      <main className="relative min-h-screen bg-white">
        <FloatingShapes />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[#111827] mb-2">Successfully signed in!</h2>
            <p className="text-[#6B7280]">Redirecting you to your account...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-white">
      <FloatingShapes />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-[#111827] mb-2">Sign in failed</h2>
          <p className="text-[#6B7280] mb-4">{error || 'An error occurred during authentication'}</p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-[#1E3A8A] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
        </div>
      </div>
    </main>
  );
}
