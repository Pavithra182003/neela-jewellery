import {
  FiAward,
  FiHeadphones,
  FiRefreshCw,
  FiShield,
  FiTruck,
} from "react-icons/fi";
import { HiShieldCheck } from "react-icons/hi";

import Container from "../common/Container";

const FEATURES = [
  
  {
    icon: FiAward,
    title: "Premium Quality",
    description:
      "Hand-finished by master artisans using only certified materials.",
  },
  {
    icon: FiShield,
    title: "Secure Payments",
    description:
      "Bank-grade encryption on every transaction, powered by Razorpay.",
  },
  {
    icon: FiRefreshCw,
    title: "Easy Returns",
    description:
      "Not the perfect fit? Return or exchange within 15 days, no questions asked.",
  },
  {
    icon: FiTruck,
    title: "Fast Shipping",
    description:
      "Complimentary, fully-insured delivery across India on every order.",
  },
  {
    icon: FiHeadphones,
    title: "Customer Support",
    description:
      "Our stylists are here every day to help you find the perfect piece.",
  },
];

export default function WhyChooseNeela() {
  return (
    <section className="py-24">
      <Container>
        <div className="mb-14 text-center">
          <p className="mb-2 text-xs tracking-[0.35em] text-gold-dark">
            THE NEELA PROMISE
          </p>

          <h2 className="font-display text-3xl text-charcoal sm:text-4xl">
            Why Choose Neela
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-lg border border-gold/10 bg-cream p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 text-gold-dark transition-colors duration-300 group-hover:bg-gold-dark group-hover:text-cream">
                  <Icon size={22} />
                </div>

                <h3 className="font-display text-lg text-charcoal">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-charcoal/60">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}