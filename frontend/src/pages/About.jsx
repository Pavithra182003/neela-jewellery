export default function About() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-12 text-center">
        <p className="mb-3 tracking-[0.3em] text-gold-dark uppercase">
          About Us
        </p>

        <h1 className="font-display text-5xl text-charcoal">
          Welcome to Neela Jewellery
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-charcoal/70">
          At Neela Jewellery, we believe every piece of jewellery tells a
          beautiful story. Our collections are carefully designed with elegance,
          quality, and timeless craftsmanship to make every occasion memorable.
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="mb-4 font-display text-3xl text-charcoal">
            Our Story
          </h2>

          <p className="mb-4 leading-8 text-charcoal/70">
            Neela Jewellery was founded with a passion for creating jewellery
            that combines traditional artistry with modern elegance. Every
            design reflects beauty, quality, and attention to detail.
          </p>

          <p className="leading-8 text-charcoal/70">
            Whether you're celebrating a wedding, anniversary, birthday, or
            gifting someone special, our jewellery is crafted to make every
            moment unforgettable.
          </p>
        </div>

        <div>
          <h2 className="mb-4 font-display text-3xl text-charcoal">
            Why Choose Us?
          </h2>

          <ul className="space-y-4 text-charcoal/70">
            <li>✔ Premium Quality Jewellery</li>
            <li>✔ Elegant & Trendy Designs</li>
            <li>✔ Secure Online Shopping</li>
            <li>✔ Fast & Safe Delivery</li>
            <li>✔ Dedicated Customer Support</li>
            <li>✔ Trusted by Happy Customers</li>
          </ul>
        </div>
      </div>

      <div className="mt-16 rounded-xl bg-[#f8f5ef] p-10 text-center">
        <h2 className="mb-4 font-display text-3xl text-charcoal">
          Our Mission
        </h2>

        <p className="mx-auto max-w-4xl leading-8 text-charcoal/70">
          Our mission is to make luxury jewellery affordable, accessible, and
          meaningful for everyone. We strive to deliver beautiful jewellery,
          exceptional customer service, and a shopping experience you'll always
          remember.
        </p>
      </div>
    </div>
  );
}