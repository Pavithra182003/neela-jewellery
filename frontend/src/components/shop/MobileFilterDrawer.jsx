import { AnimatePresence, motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import ShopFilters from "./ShopFilters";

export default function MobileFilterDrawer({ open, onClose, filters, onChange, onClearAll, categories }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 z-50 h-full w-80 max-w-[88vw] overflow-y-auto bg-cream px-6 py-5 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between border-b border-gold/15 pb-4">
              <span className="font-display text-lg text-charcoal">Filters</span>
              <button onClick={onClose} aria-label="Close filters" className="text-charcoal">
                <FiX size={20} />
              </button>
            </div>
            <ShopFilters filters={filters} onChange={onChange} onClearAll={onClearAll} categories={categories} />
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-sm bg-charcoal py-3 text-sm tracking-wide text-cream transition-colors hover:bg-gold-dark"
            >
              Show Results
            </button>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
