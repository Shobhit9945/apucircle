export function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="h-36 animate-pulse bg-slate-200" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200" />
        <div className="flex gap-2">
          <div className="h-7 w-20 animate-pulse rounded-full bg-slate-200" />
          <div className="h-7 w-20 animate-pulse rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="card divide-y divide-slate-100 p-4">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="flex items-center justify-between py-4">
          <div className="space-y-2">
            <div className="h-4 w-44 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
          </div>
          <div className="h-8 w-24 animate-pulse rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}
