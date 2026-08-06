import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

function getPageList(current, total) {
  const pages = [];
  const window = 1;
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - window && i <= current + window)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }
  return pages;
}

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = getPageList(page, totalPages);

  const buttonBase =
    "flex h-9 min-w-[36px] items-center justify-center rounded-sm px-2 text-sm transition-colors";

  return (
    <div className="mt-14 flex items-center justify-center gap-1.5">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Previous page"
        className={`${buttonBase} border border-gold/25 text-charcoal disabled:cursor-not-allowed disabled:opacity-30 hover:border-gold-dark hover:text-gold-dark`}
      >
        <FiChevronLeft size={16} />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-1 text-charcoal/40">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`${buttonBase} ${
              p === page
                ? "bg-charcoal text-cream"
                : "text-charcoal/70 hover:bg-gold/10 hover:text-gold-dark"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Next page"
        className={`${buttonBase} border border-gold/25 text-charcoal disabled:cursor-not-allowed disabled:opacity-30 hover:border-gold-dark hover:text-gold-dark`}
      >
        <FiChevronRight size={16} />
      </button>
    </div>
  );
}
