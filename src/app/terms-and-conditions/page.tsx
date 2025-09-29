import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | Doctor Site",
  description:
    "The terms governing access, purchases via Razorpay, intellectual property, and liability.",
  robots: { index: true, follow: true },
};

export default function TermsAndConditionsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Terms and Conditions</h1>
      <p className="mt-3 text-sm text-neutral-600">
        By accessing our website and purchasing digital products, you agree to the terms below. Payments
        are securely processed by Razorpay.
      </p>

      <section className="mt-8 space-y-4 text-sm">
        <div>
          <h2 className="text-lg font-semibold">Use of the Site</h2>
          <p>
            You agree to use the site for lawful purposes only and not to infringe the rights of any
            third party.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Accounts</h2>
          <p>
            You are responsible for safeguarding your account credentials and for all activities
            under your account.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Payments</h2>
          <p>
            All payments are processed via Razorpay. By completing a purchase, you authorize us and
            Razorpay to charge your selected payment method.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Refunds</h2>
          <p>
            Due to the nature of digital goods, all sales are final and non-refundable. If you were
            charged multiple times in error, contact us at <a href="mailto:drreshev@gmail.com" className="underline">drreshev@gmail.com</a> with your order ID.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Intellectual Property</h2>
          <p>
            All content, trademarks, and logos are owned by us or licensed to us and may not be
            reproduced without permission.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, we are not liable for indirect or consequential
            damages arising from your use of the site or products.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Changes to Terms</h2>
          <p>
            We may update these terms from time to time. Continued use of the site constitutes
            acceptance of the updated terms.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Contact</h2>
          <p>
            Questions about these terms? Email <a href="mailto:drreshev@gmail.com" className="underline">drreshev@gmail.com</a>.
          </p>
        </div>
      </section>
    </main>
  );
}


