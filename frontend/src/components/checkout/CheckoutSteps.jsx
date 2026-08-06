import { FiCheck } from "react-icons/fi";

const STEPS = ["Address", "Review", "Payment"];

export default function CheckoutSteps({ currentStep }) {
  const currentIndex = STEPS.indexOf(currentStep);

  return (
    <div className="mb-12 flex items-center justify-center">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm transition-colors ${
                i < currentIndex
                  ? "border-gold-dark bg-gold-dark text-cream"
                  : i === currentIndex
                  ? "border-gold-dark text-gold-dark"
                  : "border-charcoal/20 text-charcoal/30"
              }`}
            >
              {i < currentIndex ? <FiCheck size={15} /> : i + 1}
            </div>
            <span
              className={`mt-2 text-xs tracking-wide ${
                i <= currentIndex ? "text-charcoal" : "text-charcoal/30"
              }`}
            >
              {step}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`mx-3 mb-5 h-px w-12 sm:w-24 ${i < currentIndex ? "bg-gold-dark" : "bg-charcoal/15"}`} />
          )}
        </div>
      ))}
    </div>
  );
}
