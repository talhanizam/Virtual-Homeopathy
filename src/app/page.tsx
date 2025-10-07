import Link from "next/link";
import Image from "next/image";
import FloatingShapes from "@/components/FloatingShapes";
import GradientButton from "@/components/GradientButton";
import { createServiceRoleClient } from "@/lib/supabase-server";


export default async function Home() {
	const supa = await createServiceRoleClient();
	let featured: { id: string; slug?: string; title: string; description: string | null; price_inr: number; cover_url: string | null }[] = [];
	try {
		const { data, error } = await supa
			.from("ebooks")
			.select("id, slug, title, description, price_inr, cover_image_path, is_published")
			.eq("is_published", true)
			.order("title")
			.limit(3);
		if (!error && data) {
			featured = await Promise.all(
				data.map(async (e: any) => {
					let cover_url: string | null = null;
					if (e.cover_image_path) {
						const { data: signed, error: signErr } = await supa.storage
							.from("ebook-covers")
							.createSignedUrl(e.cover_image_path, 3600);
						cover_url = signErr ? null : signed?.signedUrl ?? null;
					}
					return { id: e.id, slug: e.slug, title: e.title, description: e.description, price_inr: e.price_inr, cover_url };
				})
			);
		}
	} catch {}

	return (
		<main className="relative min-h-screen bg-white">
			<FloatingShapes />
			<section className="relative mx-auto max-w-6xl px-6 pt-20 pb-16">
				<div className="grid items-center gap-10 md:grid-cols-2">
					<div>
					<h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#111827]">
							Virtual Homeopathy
						</h1>
						<p className="mt-5 text-lg text-[#374151] max-w-prose">
							Evidence-informed ebooks and videos by Dr. Reshma Nizam. Explore modern homeopathy with a futuristic reading experience.
						</p>
						<div className="mt-8 flex gap-4">
							<GradientButton as="a" href="/ebooks">Explore Ebooks</GradientButton>
							<GradientButton as="a" href="/youtube">Watch Videos</GradientButton>
						</div>
					</div>
					<div className="relative">
						<div className="relative h-72 md:h-96 rounded-3xl backdrop-blur shadow-[0_20px_60px_rgba(17,24,39,0.08)] ring-1 ring-[#E5E7EB] overflow-hidden">
							<Image 
								src="/medical-office.jpg" 
								alt="Medical office with stethoscope and documents" 
								width={800}
								height={600}
								priority
								className="w-full h-full object-cover"
							/>
						</div>
					</div>
				</div>
			</section>

			<section className="relative mx-auto max-w-6xl px-6 pb-16">
				<h2 className="text-2xl md:text-3xl font-bold text-[#111827]">Featured Ebooks</h2>
				<p className="text-[#374151] mt-2">A curated selection to get you started.</p>
				<div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{(featured.length > 0 ? featured : Array.from({ length: 3 }).map((_, i) => ({ id: String(i), slug: undefined, title: "", description: null, price_inr: 0, cover_url: null })) ).map((e, idx) => (
						<Link key={e.id ?? idx} href={e.slug ? `/ebooks/${e.slug}` : "/ebooks"} className="group relative rounded-3xl bg-white ring-1 ring-[#E5E7EB] p-5 shadow-[0_20px_60px_rgba(17,24,39,0.06)] overflow-hidden transition-transform duration-300 hover:-translate-y-1">
							<div className="relative z-10">
								<div className="h-44 rounded-2xl overflow-hidden ring-1 ring-[#E5E7EB]">
									{e.cover_url ? (
										<img src={e.cover_url} alt={e.title} className="w-full h-full object-cover" />
									) : (
										<div className="w-full h-full bg-[linear-gradient(135deg,#D6E4FF_0%,#EDE9FE_100%)] animate-pulse" />
									)}
								</div>
								<h3 className="mt-4 text-lg font-semibold text-[#111827]">{e.title || `Loading...`}</h3>
							</div>
						</Link>
					))}
				</div>
			</section>

			<section className="relative mx-auto max-w-6xl px-6 pb-16">
				<h2 className="text-2xl md:text-3xl font-bold text-[#111827]">About Dr. Reshma Nizam</h2>
				<div className="mt-6 grid gap-6 md:grid-cols-3">
					<div className="md:col-span-2 rounded-3xl bg-white p-6 ring-1 ring-[#E5E7EB] shadow-sm">
						<p className="text-[#374151]">I am a homeopathic doctor with over 21 years of clinical and teaching experience, dedicated to making homeopathy both practical and modern. Over the course of my career, I have guided countless students and practitioners through the complexities of materia medica and acute prescribing — always with one goal in mind: clarity and confidence in practice.</p>
						<p className="text-[#374151] mt-4">Throughout these two decades, I have not only treated patients but also conducted numerous webinars, lectures, and study sessions for homeopathy students across different platforms.</p>
						<p className="text-[#374151] mt-4">Through Virtual Homeopathy, my focus is on practical, modern learning — using remedy clusters, comparisons, and clinical storytelling to make homeopathy clear, relevant, and easy to apply.</p>
					</div>
					<div className="rounded-3xl bg-white p-6 ring-1 ring-[#E5E7EB] shadow-sm">
						<p className="text-[#10B981] font-semibold">21+ years experience</p>
						<p className="text-[#6B7280]">Clinical and teaching expertise.</p>
					</div>
				</div>
			</section>
		</main>
	);
}
