'use client'

export function SkeletonProductDetail() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start animate-pulse">
      {/* Image skeleton */}
      <div className="md:col-span-7">
        <div className="relative w-full aspect-[4/5] overflow-hidden rounded-sm bg-[#13100c]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#13100c] via-[#1f1a12] to-[#13100c] bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite]" />
        </div>
      </div>

      {/* Details skeleton */}
      <div className="md:col-span-5 flex flex-col pt-8 md:pt-16 space-y-6">
        {/* Product name */}
        <div className="h-10 w-3/4 rounded bg-[#1f1a12]" />
        {/* Subtitle */}
        <div className="h-5 w-2/3 rounded bg-[#1f1a12]" />
        {/* Description lines */}
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-[#1f1a12]" />
          <div className="h-4 w-full rounded bg-[#1f1a12]" />
          <div className="h-4 w-3/4 rounded bg-[#1f1a12]" />
        </div>

        {/* Scent pyramid skeleton */}
        <div className="bg-[#13100c] p-6 rounded-sm border border-[#2a2218] space-y-4">
          <div className="mx-auto h-4 w-32 rounded bg-[#1f1a12]" />
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-1">
              <div className="h-2.5 w-10 rounded bg-[#1f1a12]" />
              <div className="h-4 w-28 rounded bg-[#1f1a12]" />
            </div>
            <div className="w-px h-6 bg-[#2a2218]" />
            <div className="flex flex-col items-center gap-1">
              <div className="h-2.5 w-10 rounded bg-[#1f1a12]" />
              <div className="h-4 w-28 rounded bg-[#1f1a12]" />
            </div>
            <div className="w-px h-6 bg-[#2a2218]" />
            <div className="flex flex-col items-center gap-1">
              <div className="h-2.5 w-10 rounded bg-[#1f1a12]" />
              <div className="h-4 w-28 rounded bg-[#1f1a12]" />
            </div>
          </div>
        </div>

        {/* Volume selector skeleton */}
        <div className="space-y-4">
          <div className="h-3 w-16 rounded bg-[#1f1a12]" />
          <div className="flex gap-4">
            <div className="flex-1 h-12 rounded border border-[#2a2218]" />
            <div className="flex-1 h-12 rounded border border-[#2a2218]" />
            <div className="flex-1 h-12 rounded border border-[#2a2218]" />
          </div>
        </div>

        {/* Buttons skeleton */}
        <div className="flex flex-col gap-4 mt-auto">
          <div className="w-full h-14 rounded bg-[#1f1a12]" />
          <div className="w-full h-14 rounded border border-[#2a2218]" />
        </div>
      </div>
    </div>
  )
}
