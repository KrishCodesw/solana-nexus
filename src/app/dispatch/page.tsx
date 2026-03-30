import React from "react";
import BulkDispatcherDashboard from "@/features/bulk-dispatcher/components/BulkDispatcherDashboard";

export const metadata = {
  title: "Bulk Dispatcher | Solana Nexus",
  description:
    "Efficiently send SOL to multiple addresses in batched transactions.",
};

export default function DispatchPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-4">
          Token Dispatcher
        </h1>
        <p className="text-lg text-zinc-400">
          Upload or paste a list of addresses to securely batch transfer SOL.
          Transactions are automatically chunked to bypass network limits.
        </p>
      </div>

      {/* The core feature component */}
      <BulkDispatcherDashboard />
    </main>
  );
}
