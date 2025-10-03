"use client";
import { useEffect, useState } from "react";
import { createClientBrowser } from "@/lib/supabase-browser";
import GradientButton from "@/components/GradientButton";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Ebook = { id: string; slug: string; title: string; description: string | null; price_inr: number; cover_image_path: string | null };

type EbookWithCoverUrl = Ebook & { cover_url?: string | null };

export default function EbooksPage() {
	const supabase = createClientBrowser();
	const router = useRouter();
	const [ebooks, setEbooks] = useState<EbookWithCoverUrl[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [ownedIds, setOwnedIds] = useState<string[]>([]);

	useEffect(() => {
		(async () => {
			try {
				const { data, error } = await supabase
					.from("ebooks")
					.select("id, slug, title, description, price_inr, cover_image_path")
					.eq("is_published", true)
					.order("title");
				if (error) throw error;
				const items = data || [];
				const withCovers = await Promise.all(items.map(async (e) => {
					let cover_url: string | null | undefined = null;
					if (e.cover_image_path) {
						const res = await fetch('/api/covers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: e.cover_image_path }) });
						const json = await res.json();
						cover_url = res.ok ? json.url : null;
					}
					return { ...e, cover_url } as EbookWithCoverUrl;
				}));
				setEbooks(withCovers);

				// Also fetch owned ebook ids for the current user
				const { data: sessionData } = await supabase.auth.getSession();
				if (sessionData.session?.user) {
					const { data: purchaseRows } = await supabase
						.from('purchases')
						.select('ebook_id');
					setOwnedIds((purchaseRows || []).map(r => String((r as any).ebook_id)));
				} else {
					setOwnedIds([]);
				}
			} catch (e: any) {
				setError(e.message);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	async function buy(ebookId: string) {
		const { data } = await supabase.auth.getSession();
		const token = data.session?.access_token;
		const res = await fetch("/api/checkout/orders", {
			method: "POST",
			headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
			body: JSON.stringify({ ebook_id: ebookId }),
		});
		const payload = await res.json().catch(() => ({}));
		if (!res.ok) {
			alert(payload?.error || "Failed to create order");
			return;
		}
		const options = {
			key: payload.keyId,
			amount: payload.amount,
			currency: payload.currency,
			name: "Doctor Store",
			description: "Ebook purchase",
			order_id: payload.orderId,
			handler: () => {
				window.location.href = "/account?status=processing";
			},
			theme: { color: "#1E3A8A" },
		} as any;
		const rzp = new (window as any).Razorpay(options);
		rzp.open();
	}

	if (loading) return <p className="p-6">Loading...</p>;
	if (error) return <p className="p-6 text-red-600">{error}</p>;

	const ownedSet = new Set(ownedIds);

	return (
		<main className="relative min-h-screen bg-white">
			<div className="relative mx-auto max-w-6xl px-6 pt-10 pb-20">
				<h1 className="text-3xl md:text-4xl font-bold text-[#111827]">Ebooks</h1>
				<p className="text-[#374151] mt-2">Discover modern, insightful reads.</p>
				<div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{ebooks.map(e => (
						<Link key={e.id} href={`/ebooks/${e.slug}`} className="group relative rounded-3xl bg-white ring-1 ring-[#E5E7EB] p-5 shadow-[0_20px_60px_rgba(17,24,39,0.06)] overflow-hidden transition-transform duration-300 hover:-translate-y-1">
							<div className="relative z-10 flex flex-col h-full">
								<div className="h-48 rounded-2xl overflow-hidden ring-1 ring-[#E5E7EB]">
									{e.cover_url ? (
										<img src={e.cover_url} alt={e.title} className="w-full h-full object-cover" />
									) : (
										<div className="w-full h-full bg-[linear-gradient(135deg,#D6E4FF_0%,#EDE9FE_100%)]" />
									)}
								</div>
								<div className="flex-1 flex flex-col justify-between mt-4">
									<h3 className="text-lg font-semibold text-[#111827] min-h-[4.5rem] leading-tight">{e.title}</h3>
									<div className="mt-4 flex items-center justify-between">
										<span className="text-[#111827] font-bold">₹{e.price_inr}</span>
										{ownedSet.has(String(e.id)) ? (
											<div className="flex gap-2">
												<button
													onClick={(evt) => { evt.preventDefault(); evt.stopPropagation(); window.location.href = `/api/ebooks/${e.id}/download`; }}
													className="px-3 py-2 text-sm rounded-lg bg-[#1E3A8A] text-white hover:opacity-90"
													type="button"
												>
													📥 Download
												</button>
												<button
													onClick={(evt) => { evt.preventDefault(); evt.stopPropagation(); router.push(`/reader/${e.id}`); }}
													className="px-3 py-2 text-sm rounded-lg ring-1 ring-[#E5E7EB] hover:bg-[#F9FAFB]"
													type="button"
												>
													📖 Read
												</button>
											</div>
										) : (
											<div className="flex justify-end">
												<GradientButton onClick={(evt) => { evt.preventDefault(); buy(e.id); }}>Buy Now</GradientButton>
											</div>
										)}
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>
		</main>
	);
}
