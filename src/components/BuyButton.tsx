"use client";
import { createClientBrowser } from "@/lib/supabase-browser";

type BuyButtonProps = {
	ebookId: string;
	className?: string;
};

export default function BuyButton({ ebookId, className }: BuyButtonProps) {
	const supabase = createClientBrowser();

	async function buy() {
		const { data } = await supabase.auth.getSession();
		const token = data.session?.access_token;
		if (!token) {
			window.location.href = `/login?next=${encodeURIComponent(`/ebooks/${ebookId}`)}`;
			return;
		}
		const res = await fetch("/api/checkout/orders", {
			method: "POST",
			headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
			body: JSON.stringify({ ebook_id: ebookId }),
		});
		const payload = await res.json().catch(() => ({}));
		if (!res.ok) {
			alert(payload?.error || "Failed to create order");
			return;
		}
		if (!payload?.orderId || !payload?.keyId || !payload?.amount || !payload?.currency) {
			alert("Invalid order response. Please try again.");
			return;
		}
		const options = {
			key: payload.keyId,
			amount: payload.amount,
			currency: payload.currency,
			name: "Doctor Store",
			description: "Ebook purchase",
			order_id: payload.orderId,
			handler: () => {
				window.location.href = "/account?status=processing";
			},
			modal: { ondismiss: () => console.warn('Checkout dismissed') },
			theme: { color: "#1E3A8A" },
		} as any;
		const rzp = new (window as any).Razorpay(options);
		rzp.on('payment.failed', (response: any) => {
			console.error('Razorpay payment failed', response);
			alert(response?.error?.description || 'Payment failed. Please try again.');
		});
		rzp.open();
	}

	return (
		<button onClick={buy} className={className}>
			Buy Now
		</button>
	);
}


