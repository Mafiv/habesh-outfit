export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="surface rounded-lg overflow-hidden animate-pulse">
          <div className="aspect-[3/4] bg-gray-200 dark:bg-dark-elevated" />
          <div className="p-3 space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-dark-elevated rounded w-1/2" />
            <div className="h-4 bg-gray-200 dark:bg-dark-elevated rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-dark-elevated rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse pb-28 surface-page min-h-screen">
      <div className="aspect-[3/4] bg-gray-200 dark:bg-dark-elevated" />
      <div className="px-4 py-5 space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-dark-elevated rounded w-1/4" />
        <div className="h-6 bg-gray-200 dark:bg-dark-elevated rounded w-2/3" />
        <div className="h-8 bg-gray-200 dark:bg-dark-elevated rounded w-1/3" />
        <div className="h-12 bg-gray-200 dark:bg-dark-elevated rounded w-full" />
        <div className="h-12 bg-gray-200 dark:bg-dark-elevated rounded w-full" />
        <div className="h-20 bg-gray-200 dark:bg-dark-elevated rounded w-full" />
      </div>
    </div>
  )
}

export function HorizontalProductSkeleton() {
  return (
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-[148px] animate-pulse">
          <div className="aspect-[3/4] bg-gray-200 dark:bg-dark-elevated rounded-lg" />
          <div className="mt-2 h-3 bg-gray-200 dark:bg-dark-elevated rounded w-3/4" />
          <div className="mt-1 h-3 bg-gray-200 dark:bg-dark-elevated rounded w-1/2" />
        </div>
      ))}
    </div>
  )
}
