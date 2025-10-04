"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientBrowser } from "@/lib/supabase-browser";
import GradientButton from "@/components/GradientButton";
import FloatingShapes from "@/components/FloatingShapes";

export default function ConfirmedPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClientBrowser();
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        setError("There was an error confirming your email. Please try again.");
        setLoading(false);
        return;
      }

      if (session) {
        setLoading(false);
      } else {
        setError("Email confirmation failed. Please try again.");
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <main className="relative min-h-[80vh] bg-white">
        <FloatingShapes />
        <div className="relative mx-auto max-w-md px-6 pt-16 pb-10">
          <div className="rounded-3xl bg-white p-6 ring-1 ring-[#E5E7EB] shadow-[0_20px_60px_rgba(17,24,39,0.06)] text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B82F6] mx-auto"></div>
            <p className="mt-4 text-[#374151]">Confirming your email...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="relative min-h-[80vh] bg-white">
        <FloatingShapes />
        <div className="relative mx-auto max-w-md px-6 pt-16 pb-10">
          <div className="rounded-3xl bg-white p-6 ring-1 ring-[#E5E7EB] shadow-[0_20px_60px_rgba(17,24,39,0.06)] text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-[#111827] mb-2">Confirmation Failed</h1>
            <p className="text-[#374151] mb-6">{error}</p>
            <div className="space-y-3">
              <GradientButton onClick={() => router.push('/login')} className="w-full">
                Try Again
              </GradientButton>
              <button 
                onClick={() => router.push('/signup')} 
                className="w-full text-[#3B82F6] hover:underline"
              >
                Sign up again
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-[80vh] bg-white">
      <FloatingShapes />
      <div className="relative mx-auto max-w-md px-6 pt-16 pb-10">
        <div className="rounded-3xl bg-white p-6 ring-1 ring-[#E5E7EB] shadow-[0_20px_60px_rgba(17,24,39,0.06)] text-center">
          <div className="text-green-500 text-4xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-[#111827] mb-2">Email Confirmed!</h1>
          <p className="text-[#374151] mb-6">
            Your email has been successfully confirmed. You can now access your account and purchased ebooks.
          </p>
          <GradientButton onClick={() => router.push('/account')} className="w-full">
            Go to Account
          </GradientButton>
        </div>
      </div>
    </main>
  );
}

