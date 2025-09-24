import Link from "next/link";
import FloatingShapes from "@/components/FloatingShapes";

export default function NotFound() {
	return (
		<main className="relative min-h-screen bg-white">
			<FloatingShapes />
			<div className="relative z-10 flex items-center justify-center min-h-screen">
				<div className="text-center">
					<h1 className="text-6xl font-bold text-[#1E3A8A] mb-4">404</h1>
					<h2 className="text-2xl font-semibold text-[#111827] mb-2">Page Not Found</h2>
					<p className="text-[#6B7280] mb-8 max-w-md mx-auto">
						The page you're looking for doesn't exist or has been moved.
					</p>
					<div className="flex gap-4 justify-center">
						<Link 
							href="/" 
							className="px-6 py-3 bg-[#1E3A8A] text-white rounded-lg hover:opacity-90 transition-opacity"
						>
							Go Home
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
