import { WalletConnect } from "@/shared/components/WalletConnect";
import { AssetDashboard } from "@/features/asset-manager/components/AssetDashboard";

export default function Home() {
  return (
    <main className="min-h-screen p-8 sm:p-12 md:p-24">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Header Section */}
        <header className="flex flex-col items-start justify-between gap-4 border-b border-slate-800 pb-8 sm:flex-row sm:items-center sm:gap-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Solana Nexus
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Unified utility framework for Token-2022.
            </p>
          </div>
          <WalletConnect />
        </header>

        {/* Dashboard Content */}
        <section className="flex justify-center">
          <AssetDashboard />
        </section>
      </div>
    </main>
  );
}
