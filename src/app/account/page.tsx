import Link from "next/link";
import { createClientServer } from "@/lib/supabase-server";
import { createServiceRoleClient } from "@/lib/supabase-server";
import FloatingShapes from "@/components/FloatingShapes";

export default async function AccountPage() {
	const supaSSR = await createClientServer();
	const { data: { user } } = await supaSSR.auth.getUser();
	if (!user) {
		return (
			<main className="min-h-screen px-6 py-10">
				<div className="mx-auto max-w-3xl rounded-2xl bg-white backdrop-blur ring-1 ring-[#E5E7EB] p-6">
					<p className="text-[#374151]">Please <Link className="underline" href="/login">login</Link> to view your purchases.</p>
				</div>
			</main>
		);
	}

	const service = await createServiceRoleClient();

	// Backfill purchases from any paid orders (self-heal in case verify/webhook missed)
	const { data: paidOrders } = await service
		.from('orders')
		.select('id, ebook_id')
		.eq('user_id', user.id)
		.eq('status', 'paid');

	if (Array.isArray(paidOrders) && paidOrders.length > 0) {
		const backfillPayload = paidOrders.map((o: any) => ({ user_id: user.id, ebook_id: o.ebook_id, order_id: o.id }));
		await service.from('purchases').upsert(backfillPayload, { onConflict: 'user_id,ebook_id' as any });
	}

	const { data: rows } = await service
		.from('purchases')
		.select('ebook_id, ebooks(title, ebook_file_path)')
		.eq('user_id', user.id);

	const purchases = (rows || []).map((r: any) => ({
		id: r.ebook_id,
		title: r.ebooks?.title,
		file_path: r.ebooks?.ebook_file_path,
	}));

	return (
		<main className="relative min-h-screen bg-white">
			<FloatingShapes />
			<div className="relative z-10 mx-auto max-w-6xl px-6 pt-10 pb-20">
				<div className="mb-8">
					<h1 className="text-3xl md:text-4xl font-bold text-[#111827]">My Account</h1>
					<p className="text-[#374151] mt-2">Manage your purchases and account settings.</p>
				</div>
				
				<section>
					<h2 className="text-2xl font-semibold text-[#111827] mb-6">Your Purchased Ebooks</h2>
					{purchases.length === 0 ? (
						<div className="text-center py-12 bg-white rounded-2xl ring-1 ring-[#E5E7EB]">
							<p className="text-[#6B7280] text-lg mb-4">No purchases yet.</p>
							<Link href="/ebooks" className="inline-block px-6 py-3 bg-[#1E3A8A] text-white rounded-lg hover:opacity-90 transition-opacity">
								Browse Ebooks
							</Link>
						</div>
					) : (
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{purchases.map(p => (
								<div key={p.id} className="group relative rounded-3xl bg-white backdrop-blur ring-1 ring-[#E5E7EB] p-6 shadow-[0_20px_60px_rgba(17,24,39,0.06)] overflow-hidden transition-transform duration-300 hover:-translate-y-1">
									<div className="flex flex-col gap-4">
										<div>
											<h3 className="text-lg font-semibold text-[#111827] mb-2">{p.title}</h3>
											<p className="text-sm text-[#6B7280]">Available for download and online reading</p>
										</div>
										<div className="flex gap-3">
											<Link 
												className="flex-1 text-center rounded-xl px-4 py-2 text-white bg-[#1E3A8A] hover:bg-[#3B82F6] transition-colors text-sm font-medium" 
												href={`/api/ebooks/${p.id}/download`}
											>
												📥 Download
											</Link>
											<Link 
												className="flex-1 text-center rounded-xl px-4 py-2 ring-1 ring-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors text-sm font-medium" 
												href={`/reader/${p.id}`}
											>
												📖 Read Online
											</Link>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</section>
			</div>
		</main>
	);
}
