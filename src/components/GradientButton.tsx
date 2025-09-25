"use client";
import { motion } from "framer-motion";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type Props = PropsWithChildren<{
	as?: "button" | "a";
	href?: string;
	className?: string;
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}> & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' | 'onDragStart' | 'onDrag' | 'onDragEnd' | 'onDragEnter' | 'onDragExit' | 'onDragLeave' | 'onDragOver' | 'onDrop'>;

export default function GradientButton({ children, as = "button", href, className = "", ...rest }: Props) {
	const base = "relative inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold text-white transition-all duration-300 will-change-transform";
	const bg = "bg-[linear-gradient(90deg,#3B82F6,#8B5CF6)]";
	const effects = "shadow-lg hover:shadow-blue-500/30 hover:scale-105";
	const ring = "ring-1 ring-blue-200/50";
	const classes = `${base} ${bg} ${effects} ${ring} ${className}`;
	if (as === "a") {
		return (
			<motion.a whileHover={{ y: -2 }} whileTap={{ y: 0 }} href={href} className={classes}>
				<span className="relative z-10">{children}</span>
				<span className="absolute inset-0 rounded-2xl bg-white/10 blur-[2px]" />
			</motion.a>
		);
	}
	return (
		<motion.button whileHover={{ y: -2 }} whileTap={{ y: 0 }} className={classes} {...rest}>
			<span className="relative z-10">{children}</span>
			<span className="absolute inset-0 rounded-2xl bg-white/10 blur-[2px]" />
		</motion.button>
	);
}
