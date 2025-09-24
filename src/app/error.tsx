"use client";

import { useEffect } from "react";
import FloatingShapes from "@/components/FloatingShapes";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);

	return (
		<main className="relative min-h-screen bg-white">
			<FloatingShapes />
			<div className="relative z-10 flex items-center justify-center min-h-screen">
				<div className="text-center max-w-md mx-auto px-6">
					<h1 className="text-4xl font-bold text-[#DC2626] mb-4">Oops!</h1>
					<h2 className="text-xl font-semibold text-[#111827] mb-4">
						Something went wrong
					</h2>
					<p className="text-[#6B7280] mb-8">
						We encountered an unexpected error. Please try again or contact support if the problem persists.
					</p>
					<div className="flex gap-4 justify-center">
						<button
							onClick={reset}
							className="px-6 py-3 bg-[#1E3A8A] text-white rounded-lg hover:opacity-90 transition-opacity"
						>
							Try Again
						</button>
						<a
							href="/"
							className="px-6 py-3 border border-[#1E3A8A] text-[#1E3A8A] rounded-lg hover:bg-[#1E3A8A] hover:text-white transition-colors"
						>
							Go Home
						</a>
					</div>
				</div>
			</div>
		</main>
	);
}
