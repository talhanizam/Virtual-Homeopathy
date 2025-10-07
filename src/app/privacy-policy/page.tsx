import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Doctor Site",
  description:
    "How we collect, use, and protect your personal data for digital purchases, including payment processing via Razorpay.",
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-3 text-sm text-neutral-600">
        We respect your privacy. This policy explains what information we collect and how it is used.
        Payment processing is handled by Razorpay; we do not store your full card details on our servers.
      </p>

      <section className="mt-8 space-y-4 text-sm">
        <div>
          <h2 className="text-lg font-semibold">Information We Collect</h2>
          <ul className="list-disc pl-5">
            <li>Name, email, and contact details provided during signup or purchase</li>
            <li>Order information and limited payment identifiers from Razorpay</li>
            <li>Usage analytics as described in our analytics settings</li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold">How We Use Information</h2>
          <ul className="list-disc pl-5">
            <li>To fulfill orders and provide access to digital products</li>
            <li>To send transactional emails and updates about your order</li>
            <li>To improve our services and troubleshoot issues</li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Payments via Razorpay</h2>
          <p>
            Razorpay is our payment gateway provider. They may collect and process your payment
            information in accordance with their privacy policy. We only receive payment status and
            reference identifiers necessary to complete your order.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Data Security</h2>
          <p>
            We implement reasonable technical and organizational measures to protect your personal
            information. However, no transmission over the internet is 100% secure.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Your Rights</h2>
          <p>
            You may request access, correction, or deletion of your personal information by
            contacting us at <a href="mailto:virtualhomeopathy@gmail.com" className="underline">virtualhomeopathy@gmail.com</a>.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Contact</h2>
          <p>
            Questions about this policy? Email <a href="mailto:virtualhomeopathy@gmail.com" className="underline">virtualhomeopathy@gmail.com</a>.
          </p>
        </div>
      </section>
    </main>
  );
}


