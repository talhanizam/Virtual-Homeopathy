"use client";
import { motion } from "framer-motion";

export default function FloatingShapes() {
	return (
		<div className="pointer-events-none absolute inset-0 overflow-hidden">
			<motion.div
				className="absolute -top-20 -left-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,#D6E4FF_0%,#EDE9FE_60%,transparent_70%)] blur-3xl opacity-60"
				animate={{ y: [0, 20, -10, 0], x: [0, 10, -5, 0] }}
				transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.div
				className="absolute top-1/3 right-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,#EDE9FE_0%,#D6E4FF_60%,transparent_70%)] blur-3xl opacity-50"
				animate={{ y: [0, -30, 10, 0], x: [0, -15, 5, 0] }}
				transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.div
				className="absolute bottom-0 left-1/4 h-96 w-96 rounded-[40%] bg-[radial-gradient(circle,#D6E4FF_0%,#EDE9FE_60%,transparent_70%)] blur-3xl opacity-40"
				animate={{ y: [0, 15, -20, 0] }}
				transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
			/>
		</div>
	);
}
