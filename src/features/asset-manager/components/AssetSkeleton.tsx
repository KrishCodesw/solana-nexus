export function AssetSkeleton() {
  return (
    <div className="w-full max-w-3xl space-y-6">
      {/* SOL Balance Skeleton */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <div className="h-5 w-32 animate-pulse rounded bg-slate-800" />
        <div className="mt-4 h-10 w-48 animate-pulse rounded bg-slate-800" />
      </div>

      {/* Token List Skeleton */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <div className="mb-4 h-5 w-40 animate-pulse rounded bg-slate-800" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg bg-slate-800/50 p-4"
            >
              <div className="h-5 w-32 animate-pulse rounded bg-slate-700" />
              <div className="h-5 w-24 animate-pulse rounded bg-slate-700" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
