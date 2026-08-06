import { useState } from "react";
import Container from "../common/Container";
import { newsletterService } from "../../services/newsletterService";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const data = await newsletterService.subscribe(email);
      setMessage(data.detail);
      setStatus("done");
      setEmail("");
    } catch {
      setMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <section className="border-y border-gold/20 bg-gold/5 py-16">
      <Container className="max-w-2xl text-center">
        <p className="mb-2 text-xs tracking-[0.35em] text-gold-dark">STAY IN TOUCH</p>
        <h2 className="font-display text-2xl text-charcoal sm:text-3xl">
          Be first to know about new arrivals
        </h2>
        <p className="mt-3 text-sm text-charcoal/60">
          Join our list for early access to new collections and member-only offers.
        </p>

        {status === "done" ? (
          <p className="mt-6 text-sm text-gold-dark">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-md">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              disabled={status === "loading"}
              className="flex-1 border border-charcoal/20 bg-cream px-4 py-3 text-sm placeholder:text-charcoal/40 focus:border-gold-dark focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-charcoal px-6 py-3 text-sm tracking-wide text-cream transition-colors hover:bg-gold-dark disabled:opacity-50"
            >
              {status === "loading" ? "…" : "Subscribe"}
            </button>
          </form>
        )}
        {status === "error" && <p className="mt-3 text-xs text-red-600">{message}</p>}
      </Container>
    </section>
  );
}
