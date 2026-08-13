import { useState } from "react";
import { Link } from "react-router-dom";
import { FiFacebook, FiInstagram, FiYoutube } from "react-icons/fi";
import Container from "../common/Container";
import { newsletterService } from "../../services/newsletterService";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); 
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  setStatus("loading");

  try {
    const data = await newsletterService.subscribe(email);

    setMessage(data.detail);
    setStatus("done");
    setEmail("");

  } catch (err) {
    setMessage(
      err.response?.data?.detail ||
      "Something went wrong. Please try again."
    );

    setStatus("error");
  }
};

  return (
    <footer className="mt-24 bg-charcoal text-cream">
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <span className="font-display text-2xl tracking-[0.2em]">NEELA</span>
            <span className="mt-1 block font-body text-[0.6rem] tracking-[0.4em] text-gold">
              JEWELLERY
            </span>
            <p className="mt-4 max-w-xs text-sm text-cream/60">
              Beautiful jewellery that reflects your style and celebrates every moment.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 flex max-w-sm">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              disabled={status === "loading"}
              className="flex-1 border border-cream/30 bg-transparent px-4 py-2 text-sm placeholder:text-cream/40 focus:border-gold focus:outline-none disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={status === "loading"}
              className="border border-gold px-4 py-2 text-sm text-gold transition-colors hover:bg-gold hover:text-charcoal disabled:opacity-50"
            >
              {status === "loading"
                ? "..."
                : status === "done"
                ? "Joined"
                : "Join"}
            </button>
          </form>

          {message && (
            <p
              className={`mt-2 text-xs ${
                status === "done"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}
          </div>

          <div>
            <h4 className="mb-4 text-xs tracking-[0.3em] text-gold">SHOP</h4>
            <ul className="space-y-2 text-sm text-cream/70">
              <li><Link to="/shop" className="hover:text-gold">All Jewelry</Link></li>
              <li><a href="/#shop-by-collection" className="hover:text-gold">Collections</a></li>
              <li><Link to="/shop?is_new_arrival=true" className="hover:text-gold">New Arrivals</Link></li>
              <li><Link to="/shop?is_bestseller=true" className="hover:text-gold">Best Sellers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs tracking-[0.3em] text-gold">SUPPORT</h4>
            <ul className="space-y-2 text-sm text-cream/70">
              <li><Link to="/contact" className="hover:text-gold">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-gold">FAQ</Link></li>
              {/*<li><Link to="/refund-policy" className="hover:text-gold">Refund Policy</Link></li>*/}
              <li><Link to="/account/orders" className="hover:text-gold">Track Order</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs tracking-[0.3em] text-gold">COMPANY</h4>
            <ul className="space-y-2 text-sm text-cream/70">
              <li><Link to="/about" className="hover:text-gold">About Us</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-gold">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-gold">Terms &amp; Conditions</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-cream/10 pt-8 sm:flex-row">
          <p className="text-xs text-cream/50">
            © {new Date().getFullYear()} Neela Jewellery. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a href="https://www.instagram.com/neela_jewellers/" aria-label="Instagram" className="text-cream/60 hover:text-gold">
              <FiInstagram size={18} />
            </a>
            {/*<a href="#" aria-label="Facebook" className="text-cream/60 hover:text-gold">
              <FiFacebook size={18} />
            </a>
            <a href="#" aria-label="YouTube" className="text-cream/60 hover:text-gold">
              <FiYoutube size={18} />
            </a>*/}
          </div>
        </div>
      </Container>
    </footer>
  );
}
