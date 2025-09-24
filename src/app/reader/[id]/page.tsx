"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import FloatingShapes from "@/components/FloatingShapes";

export default function ReaderPage({ params }: { params: { id: string } }) {
	const [url, setUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const res = await fetch(`/api/ebooks/${params.id}/download`, { redirect: 'manual' as any });
				if (res.status >= 300 && res.status < 400) {
					const location = res.headers.get('Location');
					setUrl(location);
				} else if (!res.ok) {
					const data = await res.json().catch(() => null);
					setError(data?.error || 'Failed to load ebook');
				}
			} catch (e: any) {
				setError(e.message);
			} finally {
				setLoading(false);
			}
		})();
	}, [params.id]);

	if (loading) {
		return (
			<main className="relative min-h-screen bg-white">
				<FloatingShapes />
				<div className="relative z-10 flex items-center justify-center min-h-screen">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A8A] mx-auto mb-4"></div>
						<p className="text-[#374151] text-lg">Loading ebook...</p>
					</div>
				</div>
			</main>
		);
	}

	if (error) {
		return (
			<main className="relative min-h-screen bg-white">
				<FloatingShapes />
				<div className="relative z-10 flex items-center justify-center min-h-screen">
					<div className="text-center max-w-md mx-auto px-6">
						<div className="text-6xl mb-4">📚</div>
						<h1 className="text-2xl font-bold text-[#111827] mb-4">Unable to Load Ebook</h1>
						<p className="text-[#6B7280] mb-8">{error}</p>
						<div className="flex gap-4 justify-center">
							<Link 
								href="/account"
								className="px-6 py-3 bg-[#1E3A8A] text-white rounded-lg hover:opacity-90 transition-opacity"
							>
								Back to My Account
							</Link>
							<Link 
								href="/ebooks"
								className="px-6 py-3 border border-[#1E3A8A] text-[#1E3A8A] rounded-lg hover:bg-[#1E3A8A] hover:text-white transition-colors"
							>
								Browse Ebooks
							</Link>
						</div>
					</div>
				</div>
			</main>
		);
	}

	return (
		<div className="relative min-h-screen bg-white">
			{/* Reader Header */}
			<div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Link 
						href="/account"
						className="text-[#6B7280] hover:text-[#1E3A8A] transition-colors"
					>
						← Back to Account
					</Link>
					<div className="w-px h-6 bg-gray-300"></div>
					<span className="text-sm text-[#6B7280]">Online Reader</span>
				</div>
				<div className="flex items-center gap-2">
					<button 
						onClick={() => window.print()}
						className="px-3 py-1 text-sm text-[#6B7280] hover:text-[#1E3A8A] transition-colors"
					>
						🖨️ Print
					</button>
					<Link 
						href={`/api/ebooks/${params.id}/download`}
						className="px-3 py-1 text-sm text-[#6B7280] hover:text-[#1E3A8A] transition-colors"
					>
						📥 Download
					</Link>
				</div>
			</div>
			
			{/* PDF Viewer */}
			<div className="h-[calc(100vh-64px)]">
				<iframe 
					src={url || undefined} 
					className="w-full h-full border-0"
					title="Ebook Reader"
				/>
			</div>
		</div>
	);
}
