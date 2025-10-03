"use client";
import { createClientBrowser } from "@/lib/supabase-browser";

type BuyButtonProps = {
	ebookId: string;
	className?: string;
	bookSlug?: string;
};

export default function BuyButton({ ebookId, className, bookSlug }: BuyButtonProps) {
	const supabase = createClientBrowser();

	async function buy() {
		const { data } = await supabase.auth.getSession();
		const token = data.session?.access_token;
		if (!token) {
			const redirectUrl = bookSlug ? `/ebooks/${bookSlug}` : `/ebooks`;
			window.location.href = `/login?next=${encodeURIComponent(redirectUrl)}`;
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
		const callbackUrl = `${window.location.origin}/api/checkout/verify`;
		const options = {
			key: payload.keyId,
			amount: payload.amount,
			currency: payload.currency,
			name: "Doctor Store",
			description: "Ebook purchase",
			order_id: payload.orderId,
			callback_url: callbackUrl,
			redirect: true,
			handler: async (response: any) => {
				try {
					const verifyRes = await fetch('/api/checkout/verify', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							razorpay_order_id: response.razorpay_order_id,
							razorpay_payment_id: response.razorpay_payment_id,
							razorpay_signature: response.razorpay_signature,
						}),
					});
					if (!verifyRes.ok) {
						const err = await verifyRes.json().catch(() => ({}));
						throw new Error(err?.error || 'Verification failed');
					}
					const ok = await verifyRes.json().catch(() => ({}));
					console.log('verify result', ok);
					window.location.href = "/account";
				} catch (e: any) {
					console.error('Verification error', e);
					alert(e?.message || 'Could not verify payment. Please contact support.');
				}
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


