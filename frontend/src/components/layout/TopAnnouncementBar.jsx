import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiX } from "react-icons/fi";

const MESSAGES = [
  "Free Shipping Across India",
  "Hallmarked Jewellery",
  "Secure Payments",
  "Easy Returns",
];

const DISMISS_KEY = "nj_announcement_dismissed";

export default function TopAnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem(DISMISS_KEY) === "true"
  );

  useEffect(() => {
    if (dismissed) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [dismissed]);

  if (dismissed) return null;

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "true");
    setDismissed(true);
  };

  return (
    <div className="relative flex h-9 items-center justify-center overflow-hidden bg-charcoal px-8 text-center text-xs tracking-wide text-cream sm:text-sm">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.4 }}
        >
          {MESSAGES[index]}
        </motion.span>
      </AnimatePresence>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/60 transition-colors hover:text-gold"
      >
        <FiX size={14} />
      </button>
    </div>
  );
}
