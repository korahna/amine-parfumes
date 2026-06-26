'use client'

export function SkeletonCard() {
  return (
    <div className="flex flex-col">
      {/* Image skeleton — matches aspect-square of ProductCard */}
      <div className="relative aspect-square overflow-hidden bg-[#13100c] rounded-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-[#13100c] via-[#1f1a12] to-[#13100c] bg-[length:200%_100%] animate-shimmer" />
      </div>

      {/* Info skeleton — matches mt-4 text-center layout */}
      <div className="mt-4 text-center space-y-2">
        {/* Brand line */}
        <div className="mx-auto h-2.5 w-24 rounded bg-[#1f1a12]" />
        {/* Product name */}
        <div className="mx-auto h-5 w-36 rounded bg-[#1f1a12]" />
        {/* Scent pills */}
        <div className="flex items-center justify-center gap-1.5">
          <div className="h-5 w-14 rounded-full border border-[#2a2218] bg-transparent" />
          <div className="h-5 w-12 rounded-full border border-[#2a2218] bg-transparent" />
          <div className="h-5 w-16 rounded-full border border-[#2a2218] bg-transparent" />
        </div>
        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-1">
          <div className="h-6 w-20 rounded bg-[#1f1a12]" />
          <div className="h-8 w-20 rounded border border-[#2a2218] bg-transparent" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
