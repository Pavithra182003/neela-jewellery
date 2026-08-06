import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function MegaMenu({ categories, onNavigate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="absolute left-0 top-full w-full border-b border-t border-gold/30 bg-cream shadow-xl"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-4 gap-10 px-8 py-10">
        {categories.map((category) => (
          <div key={category.id} className="border-l border-gold/20 pl-6 first:border-l-0 first:pl-0">
            <Link
              to={`/shop?category=${category.slug}`}
              onClick={onNavigate}
              className="font-display text-lg text-charcoal transition-colors hover:text-gold-dark"
            >
              {category.name}
            </Link>
            <ul className="mt-4 space-y-2">
              {category.subcategories?.map((sub) => (
                <li key={sub.id}>
                  <Link
                    to={`/shop?category=${sub.slug}`}
                    onClick={onNavigate}
                    className="text-sm text-charcoal/70 transition-colors hover:text-gold-dark"
                  >
                    {sub.name}
                  </Link>
                </li>
              ))}
              {(!category.subcategories || category.subcategories.length === 0) && (
                <li className="text-sm italic text-charcoal/40">
                  Shop all {category.name.toLowerCase()}
                </li>
              )}
            </ul>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="col-span-4 text-sm text-charcoal/50">Categories coming soon.</p>
        )}
      </div>
    </motion.div>
  );
}
