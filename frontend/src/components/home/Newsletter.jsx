import { useState } from "react";
import Container from "../common/Container";
import { newsletterService } from "../../services/newsletterService";

export default function Newsletter() {
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
    <section className="py-20 bg-cream">
      <Container>
        <div className="text-center">
          <p className="text-xs tracking-[0.3em] text-gold-dark">
            STAY IN TOUCH
          </p>

          <h2 className="mt-3 font-display text-4xl text-charcoal">
            Be first to know about new arrivals
          </h2>

          <p className="mt-4 text-charcoal/60">
            Join our list for early access to new collections and member-only offers.
          </p>

          {status === "done" ? (
            <p className="mt-6 text-sm text-gold-dark">{message}</p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-6 flex max-w-md"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                disabled={status === "loading"}
                className="flex-1 border border-charcoal/20 bg-cream px-4 py-3 text-sm"
              />

              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-charcoal px-6 py-3 text-sm text-cream"
              >
                {status === "loading" ? "..." : "Subscribe"}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="mt-3 text-sm text-red-600">{message}</p>
          )}
        </div>
      </Container>
    </section>
  );
}