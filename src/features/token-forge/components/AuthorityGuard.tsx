"use client";

import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { AuthorityType } from "@solana/spl-token";
import { useRevokeAuthority } from "../hooks/useRevokeAuthority";

export function AuthorityGuard() {
  const { connected } = useWallet();
  const revokeMutation = useRevokeAuthority();
  const [mintAddress, setMintAddress] = useState("");
  const [authType, setAuthType] = useState<AuthorityType>(
    AuthorityType.MintTokens,
  );

  const handleRevoke = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mintAddress.trim()) return;
    const isConfirmed = window.confirm(
      "[CRITICAL WARNING] This action is mathematically irreversible. Proceed?",
    );
    if (isConfirmed) {
      revokeMutation.mutate({ mintAddress, authorityType: authType });
    }
  };

  if (!connected) return null;

  return (
    <div className="mt-8 w-full border border-red-900/50 bg-[#0a0000] p-6 font-mono">
      <div className="mb-6 flex items-center justify-between pb-4">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-red-500">
          Authority Override (Danger)
        </h2>
        <span className="text-[10px] uppercase text-red-900">Irreversible</span>
      </div>

      <form onSubmit={handleRevoke} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-red-500/70">
            Target Mint
          </label>
          <input
            type="text"
            value={mintAddress}
            onChange={(e) => setMintAddress(e.target.value)}
            placeholder="Address..."
            className="w-full border border-black-900/50 bg-black px-4 py-3 text-sm text-white placeholder-zinc-800 transition-colors focus:border-red-500 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-red-500/70">
            Protocol
          </label>
          <select
            value={authType}
            onChange={(e) =>
              setAuthType(Number(e.target.value) as AuthorityType)
            }
            className="w-full border border-black-900/50 bg-black px-4 py-3 text-sm text-white transition-colors focus:border-red-500 focus:outline-none"
          >
            <option value={AuthorityType.MintTokens}>
              Burn Mint Authority (Lock Supply)
            </option>
            <option value={AuthorityType.FreezeAccount}>
              Burn Freeze Authority
            </option>
          </select>
        </div>

        {revokeMutation.isError && (
          <div className="border border-red-800 bg-black-950/20 p-4 text-xs uppercase text-red-400">
            [ERR] {revokeMutation.error.message}
          </div>
        )}

        <button
          type="submit"
          disabled={revokeMutation.isPending || !mintAddress}
          className="w-full border border-red-900 bg-transparent px-4 py-4 text-xs font-bold uppercase tracking-widest text-red-500 transition-all hover:bg-red-950 hover:text-red-400 disabled:border-zinc-900 disabled:text-zinc-700"
        >
          {revokeMutation.isPending ? "Revoking..." : "Initiate Burn"}
        </button>
      </form>
    </div>
  );
}
