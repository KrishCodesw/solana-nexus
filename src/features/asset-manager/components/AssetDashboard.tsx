"use client";

import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAssetBalances } from "../hooks/useAssetBalances";

const truncateAddress = (address: string) =>
  `${address.slice(0, 4)}...${address.slice(-4)}`;

export function AssetDashboard() {
  const { connected } = useWallet();
  const { data: portfolio, isLoading, error } = useAssetBalances();

  // STATE 1: Disconnected
  if (!connected) {
    return (
      <div className="flex min-h-[300px] w-full items-center justify-center border border-zinc-800 bg-black p-6">
        <div className="text-center font-mono">
          <div className="mb-4 inline-block border border-zinc-800 bg-zinc-950 px-4 py-2 text-xs uppercase tracking-widest text-zinc-500">
            System Offline
          </div>
          <p className="text-sm text-zinc-400">
            Awaiting wallet connection sequence.
          </p>
        </div>
      </div>
    );
  }

  // STATE 2: Loading (Skeleton Bento Box)
  if (isLoading) {
    return (
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
        <div className="col-span-1 h-48 animate-pulse border border-zinc-800 bg-zinc-950/50" />
        <div className="col-span-1 h-48 animate-pulse border border-zinc-800 bg-zinc-950/50 md:col-span-2" />
      </div>
    );
  }

  // STATE 3: Error
  if (error) {
    return (
      <div className="border border-red-900/50 bg-[#0a0000] p-6 font-mono text-sm uppercase text-red-500">
        [ERROR] Data retrieval failed: {error.message}
      </div>
    );
  }

  // STATE 4: Success (The Bento Box UI)
  return (
    <div className="grid w-full grid-cols-1 gap-4 font-mono md:grid-cols-3">
      {/* BOX 1: NATIVE SOL */}
      <div className="col-span-1 flex flex-col justify-between border border-zinc-800 bg-black p-6 transition-colors hover:border-zinc-700">
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-bold uppercase tracking-widest text-zinc-200">
            Native SOL Balance
          </h2>
          {/* Pulsing online indicator */}
          {/* <div className="h-2 w-2 animate-pulse rounded-full bg-[#14F195] shadow-[0_0_10px_rgba(20,241,149,0.5)]" /> */}
        </div>

        <div className="mt-8">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-light tracking-tight text-white">
              {portfolio?.solBalance.toFixed(4) || "0.0000"}
            </span>
          </div>
          <span className="text-sm text-[#14F195]">SOL</span>
        </div>
      </div>

      {/* BOX 2: TOKEN LEDGER */}
      <div className="flex flex-col border border-zinc-800 bg-black p-6 transition-colors hover:border-zinc-700 md:col-span-2">
        <div className="mb-6 flex items-center justify-between border-b border-zinc-900 pb-4">
          <h2 className="text-[17px] font-bold uppercase tracking-widest text-zinc-200">
            SPL & Token-2022 Assets
          </h2>
          <span className="text-sm text-zinc-200">
            [{portfolio?.tokens.length || 0} RECORDS]
          </span>
        </div>

        {portfolio?.tokens.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs uppercase tracking-widest text-zinc-600">
            No external tokens detected
          </div>
        ) : (
          // Dense, interlocking list
          <div className="max-h-[200px] space-y-1 overflow-y-auto pr-2">
            {portfolio?.tokens.map((token) => (
              <div
                key={token.associatedTokenAddress}
                className="group flex items-center justify-between border border-transparent bg-zinc-950/50 px-4 py-3 transition-all hover:border-zinc-800 hover:bg-zinc-900"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm text-zinc-400 transition-colors group-hover:text-white">
                    {truncateAddress(token.mint)}
                  </span>
                  {token.isToken2022 ? (
                    <span className="border border-[#00E1F0]/30 bg-[#00E1F0]/10 px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-[#00E1F0]">
                      T-2022
                    </span>
                  ) : (
                    <span className="border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-zinc-500">
                      Legacy
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-sm text-white">
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
