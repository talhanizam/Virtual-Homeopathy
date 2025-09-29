import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Doctor Site",
  description:
    "Get in touch for support, billing, or general inquiries about digital purchases.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactUsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Contact Us</h1>
      <p className="mt-3 text-sm text-neutral-600">
        Have questions about your digital order or billing via Razorpay? Reach out using the email
        below.
      </p>

      <section className="mt-8 space-y-2 text-sm">
        <div>
          <span className="font-medium">Email:</span> <a href="mailto:drreshev@gmail.com" className="underline">drreshev@gmail.com</a>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Razorpay Payments</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Payments are securely processed by Razorpay. For any payment-related issues, please
          contact us with your order ID.
        </p>
      </section>
    </main>
  );
}


