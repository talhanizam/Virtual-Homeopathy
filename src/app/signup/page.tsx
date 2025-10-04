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
				<p className="mt-4 text-center text-sm text-[#6B7280]">Already have an account? <a className="text-[#1E3A8A] underline" href="/login">Login</a></p>
			</div>
		</main>
	);
}
