import type { Metadata } from "next";
import "./globals.css";
import NavAuth from "@/components/NavAuth";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
	metadataBase: new URL('https://virtualhomeopathy.com'),
	title: "Virtual Homeopathy | Ebooks & Videos by Dr. Reshma Nizam",
	description: "Evidence-informed homeopathy ebooks and educational videos by Dr. Reshma Nizam. Modern homeopathy learning with 21+ years of clinical experience.",
	keywords: ["homeopathy", "ebooks", "Dr. Reshma Nizam", "virtual homeopathy", "materia medica", "clinical practice"],
	authors: [{ name: "Dr. Reshma Nizam" }],
	creator: "Dr. Reshma Nizam",
	publisher: "Virtual Homeopathy",
	icons: {
		icon: "/logo.png?v=2",
		shortcut: "/logo.png?v=2",
		apple: "/logo.png?v=2",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://virtualhomeopathy.com",
		siteName: "Virtual Homeopathy",
		title: "Virtual Homeopathy | Ebooks & Videos by Dr. Reshma Nizam",
		description: "Evidence-informed homeopathy ebooks and educational videos by Dr. Reshma Nizam.",
		images: [
			{
				url: "/medical-office.jpg",
				width: 1200,
				height: 630,
				alt: "Medical office with stethoscope and documents",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Virtual Homeopathy | Ebooks & Videos by Dr. Reshma Nizam",
		description: "Evidence-informed homeopathy ebooks and educational videos by Dr. Reshma Nizam.",
		images: ["/medical-office.jpg"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" type="image/png" href="/logo.png?v=2" sizes="any" />
				<link rel="shortcut icon" type="image/png" href="/logo.png?v=2" />
				<link rel="apple-touch-icon" href="/logo.png?v=2" />
			</head>
			<body className="bg-white text-[#111827]">
				<NavAuth />
				{children}
				<Footer />
				<script async src="https://checkout.razorpay.com/v1/checkout.js"></script>
			</body>
		</html>
	);
}
