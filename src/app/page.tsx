"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { AssetDashboard } from "@/features/asset-manager/components/AssetDashboard";
import Link from "next/link";

export default function Home() {
  const { connected } = useWallet();

  // If the wallet is connected, show the Command Center directly
  if (connected) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-black px-6 py-8 sm:px-12 sm:py-12">
        <div className="mx-auto max-w-5xl space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl">
              Asset Command Center
            </h1>
            <p className="mt-2 text-sm text-zinc-400 sm:text-base">
              View and manage your Solana portfolio.
            </p>
          </div>
          <AssetDashboard />
        </div>
      </main>
    );
  }

  // If the wallet is NOT connected, show the clean landing page
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-black px-6 py-16 flex flex-col items-center justify-center text-center sm:px-12">
      <div className="mx-auto max-w-4xl space-y-10">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-6xl">
            Solana Nexus
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-zinc-400">
            An open-source suite of power-user tools. Connect your wallet to
            access the Command Center, manage assets, and deploy tokens.
          </p>
        </div>

        {/* Minimalist Features Grid */}
        <div className="grid grid-cols-1 gap-6 text-left sm:grid-cols-3 pt-8">
          <Link
            href="/forge"
            className="block p-6 border border-zinc-900 bg-zinc-950/50 transition-colors hover:border-zinc-700 hover:bg-zinc-900"
          >
            <h3 className="text-lg font-bold text-white mb-2">Token Forge</h3>
            <p className="text-sm text-zinc-400">
              Mint and configure advanced Token-2022 assets.
            </p>
          </Link>

          <Link
            href="/dispatch"
            className="block p-6 border border-zinc-900 bg-zinc-950/50 transition-colors hover:border-zinc-700 hover:bg-zinc-900"
          >
            <h3 className="text-lg font-bold text-white mb-2">
              Bulk Dispatcher
            </h3>
            <p className="text-sm text-zinc-400">
              Batch transfer SOL and tokens to bypass network congestion.
            </p>
          </Link>

          <Link
            href="/reclaim"
            className="block p-6 border border-zinc-900 bg-zinc-950/50 transition-colors hover:border-zinc-700 hover:bg-zinc-900"
          >
            <h3 className="text-lg font-bold text-white mb-2">
              Rent Reclaimer
            </h3>
            <p className="text-sm text-zinc-400">
              Scan and sweep locked SOL from empty token accounts.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
