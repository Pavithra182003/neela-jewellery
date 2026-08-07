export default function FAQ() {
  const faqs = [
    {
      question: "How can I place an order?",
      answer:
        "Browse our jewellery collection, add your favourite products to the cart, proceed to checkout, select your preferred payment method, and place your order.",
    },
    {
      question: "Which payment methods do you accept?",
      answer:
        "We accept Cash on Delivery (where available) and UPI/online payments through our WhatsApp ordering process.",
    },
    {
      question: "How do I track my order?",
      answer:
        "Login to your account and go to 'My Orders' to view your order status. You will also receive email updates as your order progresses.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Orders are usually delivered within 3–7 business days depending on your location.",
    },
    {
      question: "Can I cancel my order?",
      answer:
        "Yes. Orders can be cancelled before they are shipped. Once shipped, cancellation is no longer possible.",
    },
    {
      question: "What if I receive a damaged or incorrect product?",
      answer:
        "Please contact us immediately with your order number and photos of the product. Our support team will help resolve the issue as quickly as possible.",
    },
    {
      question: "Do you offer returns or refunds?",
      answer:
        "Yes. Eligible products can be returned according to our Refund Policy. Refunds are processed after the returned item passes inspection.",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "You can reach us through WhatsApp, phone, or email during our business hours. Visit the Contact Us page for our contact details.",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="text-center mb-12">
        <p className="uppercase tracking-[0.3em] text-gold-dark">
          Frequently Asked Questions
        </p>

        <h1 className="mt-3 font-display text-5xl text-charcoal">
          How Can We Help?
        </h1>

        <p className="mx-auto mt-5 max-w-3xl text-charcoal/70">
          Find answers to the most common questions about shopping with
          Neela Jewellery.
        </p>
      </div>

      <div className="space-y-5">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-xl border border-gold/20 bg-white p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-charcoal">
              {faq.question}
            </h3>

            <p className="mt-3 leading-7 text-charcoal/70">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-xl bg-cream p-8 text-center">
        <h2 className="font-display text-3xl text-charcoal">
          Still Need Help?
        </h2>

        <p className="mt-4 text-charcoal/70">
          If you couldn't find the answer you're looking for, please contact
          our customer support team.
        </p>

        <a
          href="https://wa.me/917794029720"
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block rounded-md bg-green-600 px-8 py-3 text-white hover:bg-green-700"
        >
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}