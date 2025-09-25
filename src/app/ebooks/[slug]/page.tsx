import { createClientServer } from "@/lib/supabase-server";
import { createServiceRoleClient } from "@/lib/supabase-server";
import BuyButton from "@/components/BuyButton";
import Link from "next/link";
import FloatingShapes from "@/components/FloatingShapes";

export default async function EbookDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug: raw } = await params;
	const slug = decodeURIComponent(raw).trim();
	const supa = await createClientServer();
	const service = await createServiceRoleClient();

	// Get user to check purchase status
	const { data: { user } } = await supa.auth.getUser();

	let { data, error } = await supa
		.from("ebooks")
		.select("id, slug, title, description, price_inr, cover_image_path, is_published")
		.eq("slug", slug)
		.eq("is_published", true)
		.limit(1)
		.maybeSingle();

	if ((!data || error) && !error) {
		const fallback = await supa
			.from("ebooks")
			.select("id, slug, title, description, price_inr, cover_image_path, is_published")
			.eq("title", slug)
			.eq("is_published", true)
			.limit(1)
			.maybeSingle();
		data = fallback.data as any;
		error = fallback.error as any;
	}

	if (error || !data) {
		return (
			<main className="relative min-h-screen bg-white">
				<div className="relative mx-auto max-w-3xl px-6 pt-10 pb-20">
					<h1 className="text-2xl font-semibold text-[#111827]">Ebook not found</h1>
					<p className="mt-2 text-[#6B7280]">
						This ebook is unavailable. Return to <Link href="/ebooks" className="text-[#1E3A8A] underline">Ebooks</Link>.
					</p>
				</div>
			</main>
		);
	}

	let coverUrl: string | null = null;
	if (data.cover_image_path) {
		const { data: signed, error: signErr } = await supa.storage
			.from("ebook-covers")
			.createSignedUrl(data.cover_image_path, 3600);
		coverUrl = signErr ? null : signed?.signedUrl ?? null;
	}

	// Check if user has purchased this ebook
	let isPurchased = false;
	if (user) {
		const { data: purchase } = await service
			.from('purchases')
			.select('id')
			.eq('user_id', user.id)
			.eq('ebook_id', data.id)
			.single();
		isPurchased = !!purchase;
	}

	return (
		<main className="relative min-h-screen bg-white">
			<FloatingShapes />
			<div className="relative z-10 mx-auto max-w-4xl px-6 pt-10 pb-20">
				<nav className="text-sm text-[#6B7280] mb-6">
					<Link href="/ebooks" className="hover:underline">Ebooks</Link>
					<span className="mx-2">/</span>
					<span className="text-[#111827]">{data.title}</span>
				</nav>
				
				<div className="grid gap-8 md:grid-cols-3">
					<div className="md:col-span-1">
						<div className="h-80 rounded-2xl overflow-hidden ring-1 ring-[#E5E7EB] bg-white shadow-lg">
							{coverUrl ? (
								<img src={coverUrl} alt={data.title} className="w-full h-full object-cover" />
							) : (
								<div className="w-full h-full bg-[linear-gradient(135deg,#D6E4FF_0%,#EDE9FE_100%)]" />
							)}
						</div>
					</div>
					
					<div className="md:col-span-2">
						<div className="flex items-start justify-between mb-4">
							<h1 className="text-3xl font-bold text-[#111827]">{data.title}</h1>
							{isPurchased && (
								<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
									✓ Purchased
								</span>
							)}
						</div>
						
						<p className="text-[#374151] whitespace-pre-line mb-6">{data.description}</p>
						
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<span className="text-3xl font-bold text-[#111827]">₹{data.price_inr}</span>
							</div>
							
							{data.is_published ? (
								isPurchased ? (
									<div className="space-y-3">
										<p className="text-green-600 font-medium">✅ You own this ebook!</p>
										<div className="flex gap-3">
											<Link 
												href={`/api/ebooks/${data.id}/download`}
												className="flex-1 text-center px-6 py-3 bg-[#1E3A8A] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
											>
												📥 Download PDF
											</Link>
											<Link 
												href={`/reader/${data.id}`}
												className="flex-1 text-center px-6 py-3 border border-[#1E3A8A] text-[#1E3A8A] rounded-lg hover:bg-[#1E3A8A] hover:text-white transition-colors font-medium"
											>
												📖 Read Online
											</Link>
										</div>
									</div>
								) : (
									<div>
										<BuyButton ebookId={data.id} className="w-full px-6 py-3 rounded-lg bg-[#1E3A8A] text-white hover:opacity-90 font-medium" />
									</div>
								)
							) : (
								<div className="text-center py-4 px-6 bg-gray-50 rounded-lg">
									<span className="text-[#6B7280] font-medium">Coming soon</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}


