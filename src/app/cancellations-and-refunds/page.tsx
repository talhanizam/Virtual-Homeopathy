import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cancellations and Refunds | Doctor Site",
  description:
    "Digital products only: no cancellations after access is granted; no refunds.",
  robots: { index: true, follow: true },
};

export default function CancellationsRefundsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Cancellations and Refunds</h1>
      <p className="mt-3 text-sm text-neutral-600">
        We sell only digital products. Payments are processed via Razorpay. Please review the policy
        below before making a purchase.
      </p>

      <section className="mt-8 space-y-4 text-sm">
        <div>
          <h2 className="text-lg font-semibold">Order Cancellation</h2>
          <p>
            Cancellations are not possible once access to the digital product has been granted.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Digital Products</h2>
          <p>
            Due to the nature of digital goods (ebooks, downloads), all sales are final once access
            is granted. If you were charged multiple times in error, contact us with your order ID.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Refund Eligibility</h2>
          <p>
            We do not offer refunds for digital purchases. For failed or duplicate transactions
            verified via Razorpay, contact us to review and resolve.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Refund Timelines</h2>
          <p>
            If a duplicate/failed charge is confirmed, refunds are initiated within 5–7 business
            days to the original payment method per Razorpay and issuing bank policies.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">How to Request</h2>
          <p>
            Email <a href="mailto:virtualhomeopathy@gmail.com" className="underline">virtualhomeopathy@gmail.com</a> with your order ID and payment reference. We may request additional verification for
            security.
          </p>
        </div>
      </section>
    </main>
  );
}


