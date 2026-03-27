"use client";

import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAssetBalances } from "../hooks/useAssetBalances";
import { AssetSkeleton } from "./AssetSkeleton";

// Utility to truncate long addresses (e.g., "7xKX...3bQs")
const truncateAddress = (address: string) =>
  `${address.slice(0, 4)}...${address.slice(-4)}`;

export function AssetDashboard() {
  const { connected } = useWallet();
  const { data: portfolio, isLoading, error } = useAssetBalances();

  // State 1: Disconnected
  if (!connected) {
    return (
      <div className="flex min-h-[400px]ull max-w-3xl flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/20 p-6 text-center">
        <h2 className="text-xl font-medium text-slate-300">
          Wallet Disconnected
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Connect your wallet to view your Solana & Token-2022 assets.
        </p>
      </div>
    );
  }

  // State 2: Fetching Data
  if (isLoading) return <AssetSkeleton />;

  // State 3: RPC Error
  if (error) {
    return (
      <div className="w-full max-w-3xl rounded-xl border border-red-900/50 bg-red-950/20 p-6 text-red-400">
        <p>Failed to load assets: {error.message}</p>
      </div>
    );
  }

  // State 4: Success
  return (
    <div className="w-full max-w-3xl space-y-6">
      {/* SOL Balance Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-sm">
        <h2 className="text-sm font-medium uppercase tracking-wider text-slate-400">
          Native SOL Balance
        </h2>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-4xl font-bold tracking-tight text-white">
            {portfolio?.solBalance.toFixed(4) || "0.0000"}
          </span>
          <span className="text-lg font-medium text-purple-400">SOL</span>
        </div>
      </div>

      {/* Token List Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-sm">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-slate-400">
          SPL & Token-2022 Assets ({portfolio?.tokens.length || 0})
        </h2>

        {portfolio?.tokens.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-500">
            No tokens found in this wallet.
          </div>
        ) : (
          <div className="space-y-2">
            {portfolio?.tokens.map((token) => (
              <div
                key={token.associatedTokenAddress}
                className="flex items-center justify-between rounded-lg border border-slate-800/50 bg-slate-950 p-4 transition-colors hover:border-slate-700 hover:bg-slate-900"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-slate-300">
                      {truncateAddress(token.mint)}
                    </span>
                    {token.isToken2022 ? (
                      <span className="rounded bg-purple-900/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-300">
                        Token-2022
                      </span>
                    ) : (
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Legacy
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-base font-medium text-white">
                    {token.uiAmountString}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
