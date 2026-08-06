export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square bg-charcoal/5" />
      <div className="mt-3 space-y-2">
        <div className="h-2.5 w-1/3 bg-charcoal/10" />
        <div className="h-4 w-2/3 bg-charcoal/10" />
        <div className="h-4 w-1/2 bg-charcoal/10" />
      </div>
    </div>
  );
}
