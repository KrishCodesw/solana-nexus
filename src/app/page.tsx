import { AssetDashboard } from "@/features/asset-manager/components/AssetDashboard";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-4rem)] p-8 sm:p-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">
            Asset Command Center
          </h1>
          <p className="mt-1 text-sm text-black-400">
            View and manage your Solana portfolio.
          </p>
        </div>
        <AssetDashboard />
      </div>
    </main>
  );
}
