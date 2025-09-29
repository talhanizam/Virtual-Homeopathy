import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delivery Policy (Digital) | Doctor Site",
  description: "Access and delivery terms for purely digital products.",
  robots: { index: true, follow: true },
};

export default function ShippingPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Delivery Policy (Digital)</h1>
      <p className="mt-3 text-sm text-neutral-600">
        We sell only digital products. Payments are processed via Razorpay. Below are our delivery
        terms for digital access.
      </p>

      <section className="mt-8 space-y-4 text-sm">
        <div>
          <h2 className="text-lg font-semibold">Instant Access</h2>
          <p>
            For ebooks or downloadable content, access is provided instantly upon successful
            payment. You will receive a confirmation email with instructions and links.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Contact</h2>
          <p>
            For delivery/access issues, contact <a href="mailto:drreshev@gmail.com" className="underline">drreshev@gmail.com</a>
            with your order ID.
          </p>
        </div>
      </section>
    </main>
  );
}


