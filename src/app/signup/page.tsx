"use client";
import { useState } from "react";
import { createClientBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import GradientButton from "@/components/GradientButton";
import FloatingShapes from "@/components/FloatingShapes";

export default function SignupPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [message, setMessage] = useState<string | null>(null);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setMessage(null);
		const supabase = createClientBrowser();
		const { error } = await supabase.auth.signUp({ 
			email, 
			password,
			options: {
				emailRedirectTo: `${window.location.origin}/auth/confirmed`
			}
		});
		setLoading(false);
		if (error) {
			setError(error.message);
			return;
		}
		setMessage("Check your email to confirm your account.");
		router.push("/login");
	}

	async function signInWithGoogle() {
		setLoading(true);
		setError(null);
		setMessage(null);
		const supabase = createClientBrowser();
		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${window.location.origin}/auth/callback?next=/account`,
				queryParams: {
					access_type: 'offline',
					prompt: 'consent',
				}
			}
		});
		if (error) {
			setError(error.message);
			setLoading(false);
		}
	}

	return (
		<main className="relative min-h-[80vh] bg-white">
			<FloatingShapes />
			<div className="relative mx-auto max-w-md px-6 pt-16 pb-10">
				<h1 className="text-3xl font-extrabold text-[#111827] text-center">Create account</h1>
				<p className="text-[#374151] text-center mt-2">Start your learning journey</p>
				<form onSubmit={onSubmit} className="mt-8 rounded-3xl bg-white p-6 ring-1 ring-[#E5E7EB] shadow-[0_20px_60px_rgba(17,24,39,0.06)] grid gap-4">
					<label className="grid gap-2">
						<span className="text-sm text-[#374151]">Email</span>
						<input className="rounded-xl border border-[#E5E7EB] px-3 py-2 outline-none focus:ring-2 focus:ring-[#3B82F6]" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required />
					</label>
					<label className="grid gap-2">
						<span className="text-sm text-[#374151]">Password</span>
						<input className="rounded-xl border border-[#E5E7EB] px-3 py-2 outline-none focus:ring-2 focus:ring-[#3B82F6]" type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required />
					</label>
					{error && <p className="text-red-600 text-sm">{error}</p>}
					{message && <p className="text-[#10B981] text-sm">{message}</p>}
					<GradientButton type="submit" className="w-full">{loading?"Creating...":"Sign up"}</GradientButton>
				</form>
				
				<div className="mt-6">
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-300" />
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-2 bg-white text-gray-500">Or continue with</span>
						</div>
					</div>
					
					<button
						onClick={signInWithGoogle}
						disabled={loading}
						className="mt-4 w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
							<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
							<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
							<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
							<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
						</svg>
						{loading ? "Signing up..." : "Continue with Google"}
					</button>
				</div>
				<p className="mt-4 text-center text-sm text-[#6B7280]">Already have an account? <a className="text-[#1E3A8A] underline" href="/login">Login</a></p>
			</div>
		</main>
	);
}
