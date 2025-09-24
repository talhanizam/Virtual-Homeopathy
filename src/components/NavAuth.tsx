"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClientBrowser } from "@/lib/supabase-browser";

export default function NavAuth() {
	const supabase = createClientBrowser();
	const [isAuthed, setIsAuthed] = useState<boolean>(false);

	useEffect(() => {
		let mounted = true;
		(async () => {
			const { data } = await supabase.auth.getSession();
			if (mounted) setIsAuthed(!!data.session);
		})();
		const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
			setIsAuthed(!!session);
		});
		return () => {
			mounted = false;
			sub.subscription.unsubscribe();
		};
	}, []);

	async function logout() {
		await supabase.auth.signOut();
		setIsAuthed(false);
		window.location.href = "/";
	}

	return (
		<header className="sticky top-0 z-50">
			<nav className="mx-auto max-w-6xl px-6 py-3 mt-3 rounded-2xl bg-white backdrop-blur ring-1 ring-[#E5E7EB] shadow-[0_10px_30px_rgba(17,24,39,0.06)] flex items-center gap-6">
				<Link href="/" className="font-extrabold text-xl tracking-tight text-[#1E3A8A]">Virtual Homeopathy</Link>
				<div className="hidden md:flex items-center gap-5">
					<Link className="text-[#374151] hover:text-[#1E3A8A]" href="/ebooks">Ebooks</Link>
					<Link className="text-[#374151] hover:text-[#1E3A8A]" href="/youtube">Videos</Link>
				</div>
				<div className="ml-auto flex items-center gap-3">
					{!isAuthed ? (
						<>
							<Link className="rounded-xl px-3 py-2 text-[#1E3A8A] ring-1 ring-[#E5E7EB] hover:bg-[#F9FAFB] transition" href="/login">Login</Link>
							<Link className="rounded-xl px-3 py-2 text-white bg-[#1E3A8A] hover:bg-[#3B82F6] transition" href="/signup">Sign up</Link>
						</>
					) : (
						<>
							<Link className="rounded-xl px-3 py-2 text-white bg-[#1E3A8A] hover:bg-[#3B82F6] transition" href="/account">Account</Link>
							<button onClick={logout} className="rounded-xl px-3 py-2 text-white bg-[#1E3A8A] hover:bg-[#3B82F6] transition">Logout</button>
						</>
					)}
				</div>
			</nav>
		</header>
	);
}
