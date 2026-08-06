import ProductCard from "./ProductCard";

export default function ProductRow({ title, products }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="mt-20">
      <h2 className="mb-6 font-display text-2xl text-charcoal">{title}</h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
