import { useState } from "react";
import { FiCheck, FiShare2 } from "react-icons/fi";

export default function ShareButton({ title, className = "" }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled the native share sheet — no error needed
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — silently no-op rather than error
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`flex items-center gap-1.5 text-xs tracking-wide text-charcoal/60 transition-colors hover:text-gold-dark ${className}`}
    >
      {copied ? <FiCheck size={14} /> : <FiShare2 size={14} />}
      {copied ? "Link copied" : "Share"}
    </button>
  );
}
