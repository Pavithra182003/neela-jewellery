import { FiPhone, FiMail, FiMapPin, FiClock } from "react-icons/fi";

export default function Contact() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="text-center">
        <p className="tracking-[0.3em] uppercase text-gold-dark">
          Contact Us
        </p>

        <h1 className="mt-3 font-display text-5xl text-charcoal">
          We're Here to Help
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-charcoal/70">
          Have a question about our jewellery, your order, custom designs, or
          shipping? Feel free to contact us anytime.
        </p>
      </div>

      <div className="mt-14 grid gap-8 md:grid-cols-2">
        <div className="rounded-xl border border-gold/20 p-8">
          <h2 className="mb-8 font-display text-3xl text-charcoal">
            Contact Information
          </h2>

          <div className="space-y-7">
            <div className="flex items-center gap-4">
              <FiPhone className="text-2xl text-gold-dark" />
              <div>
                <h3 className="font-semibold">Phone / WhatsApp</h3>
                <a
                  href="tel:+917794029720"
                  className="text-charcoal/70 hover:text-gold-dark"
                >
                  +91 7794029720
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <FiMail className="text-2xl text-gold-dark" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <a
                  href="mailto:jewwllwesnella@gmail.com"
                  className="text-charcoal/70 hover:text-gold-dark"
                >
                  jewellersneela@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <FiMapPin className="text-2xl text-gold-dark" />
              <div>
                <h3 className="font-semibold">Location</h3>
                <p className="text-charcoal/70">
                  Hyderabad,
                  <br />
                  Telangana, India
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <FiClock className="text-2xl text-gold-dark" />
              <div>
                <h3 className="font-semibold">Customer Support</h3>
                <p className="text-charcoal/70">
                  Monday – Saturday
                  <br />
                  10:00 AM – 7:00 PM
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex gap-4">
            <a
              href="https://wa.me/917794029720"
              target="_blank"
              rel="noreferrer"
              className="rounded bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700"
            >
              Chat on WhatsApp
            </a>

            <a
              href="mailto:jewellersneela@gmail.com"
              className="rounded border border-gold-dark px-6 py-3 font-medium text-gold-dark hover:bg-gold-dark hover:text-white"
            >
              Send Email
            </a>
          </div>
        </div>

        <div className="rounded-xl border border-gold/20 bg-cream p-8">
          <h2 className="mb-6 font-display text-3xl text-charcoal">
            Need Assistance?
          </h2>

          <ul className="space-y-4 text-charcoal/70">
            <li>✓ Order Status & Tracking</li>
            <li>✓ Product Information</li>
            <li>✓ Jewellery Care</li>
            <li>✓ Returns & Refunds</li>
            <li>✓ Custom Jewellery Enquiries</li>
            <li>✓ Shipping & Delivery</li>
            <li>✓ Payment Assistance</li>
          </ul>

          <div className="mt-10 rounded-lg bg-gold/10 p-5">
            <h3 className="font-semibold text-charcoal">
              Quick Response
            </h3>

            <p className="mt-2 text-sm text-charcoal/70">
              For faster assistance, contact us on WhatsApp. We usually
              respond within a few minutes during business hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}