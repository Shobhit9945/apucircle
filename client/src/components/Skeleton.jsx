export function SkeletonCard() {
  return (
    <div className="card overflow-hidden flex flex-col">
      <div className="h-32 animate-pulse bg-surface-container-high" />
      <div className="p-5 pt-8 relative space-y-3">
        <div className="absolute -top-5 left-5 w-10 h-10 rounded-full bg-surface-container-highest animate-pulse" />
        <div className="h-5 w-2/3 animate-pulse rounded-full bg-surface-container-highest" />
        <div className="h-4 w-1/2 animate-pulse rounded-full bg-surface-container-high" />
        <div className="flex gap-2">
          <div className="h-6 w-16 animate-pulse rounded-md bg-surface-container-high" />
          <div className="h-6 w-20 animate-pulse rounded-md bg-surface-container-high" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="card divide-y divide-outline-variant p-4">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="flex items-center justify-between py-4">
          <div className="space-y-2">
            <div className="h-4 w-44 animate-pulse rounded-full bg-surface-container-high" />
            <div className="h-3 w-28 animate-pulse rounded-full bg-surface-container-high" />
          </div>
          <div className="h-8 w-24 animate-pulse rounded-full bg-surface-container-high" />
        </div>
      ))}
    </div>
  );
}
