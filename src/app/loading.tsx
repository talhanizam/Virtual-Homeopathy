import FloatingShapes from "@/components/FloatingShapes";

export default function Loading() {
	return (
		<main className="relative min-h-screen bg-white flex items-center justify-center">
			<FloatingShapes />
			<div className="relative z-10 text-center">
				<h2 className="text-2xl font-bold text-[#1E3A8A]">Virtual Homeopathy</h2>
				<p className="text-[#374151] mt-2">Loading...</p>
			</div>
		</main>
	);
}
