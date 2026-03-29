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

    // A secondary browser confirmation for safety
    const isConfirmed = window.confirm(
      "WARNING: This action is mathematically irreversible. You will permanently lose this authority. Proceed?",
    );

    if (isConfirmed) {
      revokeMutation.mutate({ mintAddress, authorityType: authType });
    }
  };

  if (!connected) return null;

  return (
    <div className="w-full max-w-xl rounded-xl border border-red-900/30 bg-red-950/10 p-6 backdrop-blur-sm mt-8">
      <div className="mb-6 border-b border-red-900/30 pb-4">
        <h2 className="text-lg font-bold tracking-tight text-red-400">
          Authority Guard (Danger Zone)
        </h2>
        <p className="mt-1 text-sm text-red-300/70">
          Permanently revoke token authorities to establish community trust.
          This cannot be undone.
        </p>
      </div>

      <form onSubmit={handleRevoke} className="space-y-5">
        <div className="space-y-1">
          <label className="text-xs font-medium uppercase text-red-400/80">
            Target Mint Address
          </label>
          <input
            type="text"
            value={mintAddress}
            onChange={(e) => setMintAddress(e.target.value)}
            placeholder="Paste Token-2022 Mint Address"
            className="w-full rounded-md border border-red-900/50 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium uppercase text-red-400/80">
            Authority to Revoke
          </label>
          <select
            value={authType}
            onChange={(e) =>
              setAuthType(Number(e.target.value) as AuthorityType)
            }
            className="w-full rounded-md border border-red-900/50 bg-slate-950 px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
          >
            <option value={AuthorityType.MintTokens}>
              Mint Authority (Lock Supply)
            </option>
            <option value={AuthorityType.FreezeAccount}>
              Freeze Authority (Prevent Blacklisting)
            </option>
          </select>
        </div>

        {revokeMutation.isError && (
          <div className="rounded bg-red-900/40 p-3 text-sm text-red-200 border border-red-800">
            {revokeMutation.error.message}
          </div>
        )}

        {revokeMutation.isSuccess && (
          <div className="rounded bg-orange-900/40 p-3 text-sm text-orange-200 border border-orange-800">
            Authority permanently revoked. Signature:{" "}
            {revokeMutation.data.slice(0, 8)}...
          </div>
        )}

        <button
          type="submit"
          disabled={revokeMutation.isPending || !mintAddress}
          className="w-full rounded-md bg-red-900/80 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-800 disabled:bg-slate-800 disabled:text-slate-500 border border-red-700"
        >
          {revokeMutation.isPending
            ? "Revoking..."
            : "Permanently Revoke Authority"}
        </button>
      </form>
    </div>
  );
}
