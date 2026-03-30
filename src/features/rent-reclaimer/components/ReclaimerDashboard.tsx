"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRentReclaimer } from "../hooks/useRentReclaimer";

export default function ReclaimerDashboard() {
  const { connected } = useWallet();
  const {
    accounts,
    totalReclaimableSol,
    isScanning,
    isReclaiming,
    error,
    signatures,
    scan,
    reclaim,
  } = useRentReclaimer();

  return (
    <div className="max-w-3xl mx-auto p-6 bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg text-zinc-100">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Rent Reclaimer</h2>
        <p className="text-zinc-400 text-sm">
          Scan your wallet for empty token accounts. Closing these redundant
          accounts will refund the storage rent (SOL) back to your main balance.
        </p>
      </div>

      {/* Step 1: Scan Button */}
      <div className="mb-8">
        <button
          onClick={scan}
          disabled={!connected || isScanning || isReclaiming}
          className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 rounded-lg font-medium transition-colors flex justify-center items-center gap-2"
        >
          {isScanning ? (
            <span className="animate-pulse">Scanning Blockchain...</span>
          ) : !connected ? (
            "Connect Wallet to Scan"
          ) : (
            "Scan for Empty Accounts"
          )}
        </button>
      </div>

      {/* Error & Success States */}
      {error && (
        <div className="p-4 mb-6 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {signatures.length > 0 && (
        <div className="p-4 mb-6 bg-emerald-900/30 border border-emerald-800 rounded-lg text-emerald-400 text-sm flex flex-col gap-2">
          <p className="font-semibold">Successfully reclaimed rent!</p>
          {signatures.map((sig, idx) => (
            <a
              key={idx}
              href={`https://explorer.solana.com/tx/${sig}?cluster=devnet`}
              target="_blank"
              rel="noreferrer"
              className="hover:underline truncate"
            >
              Transaction {idx + 1}: {sig}
            </a>
          ))}
        </div>
      )}

      {/* Step 2: The Results & Reclaim Action */}
      <AnimatePresence>
        {accounts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-zinc-800">
                <div>
                  <h3 className="text-lg font-medium text-zinc-200">
                    Found {accounts.length} Accounts
                  </h3>
                  <p className="text-sm text-zinc-500">Ready to be closed</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-zinc-500">Total Reclaimable</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    ~{totalReclaimableSol.toFixed(4)} SOL
                  </p>
                </div>
              </div>

              <div className="max-h-48 overflow-y-auto pr-2 space-y-2 mb-6 custom-scrollbar">
                {accounts.map((acc) => (
                  <div
                    key={acc.pubkey.toBase58()}
                    className="flex justify-between items-center text-sm p-2 bg-zinc-900 rounded"
                  >
                    <span className="font-mono text-zinc-400 truncate w-2/3">
                      {acc.pubkey.toBase58()}
                    </span>
                    <span className="text-emerald-500">
                      {(acc.rentLamports / 1_000_000_000).toFixed(4)} SOL
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={reclaim}
                disabled={isReclaiming}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-500 rounded-lg font-bold transition-colors flex justify-center items-center gap-2"
              >
                {isReclaiming ? (
                  <span className="animate-pulse">Executing Reclaim...</span>
                ) : (
                  `Reclaim ${totalReclaimableSol.toFixed(4)} SOL`
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Empty State after scan */}
        {accounts.length === 0 &&
          !isScanning &&
          signatures.length === 0 &&
          !error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-zinc-500 text-sm"
            >
              Click scan to find redundant accounts.
            </motion.p>
          )}
      </AnimatePresence>
    </div>
  );
}
