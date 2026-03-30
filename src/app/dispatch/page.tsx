import React from "react";
import BulkDispatcherDashboard from "@/features/bulk-dispatcher/components/BulkDispatcherDashboard";

export const metadata = {
  title: "Bulk Dispatcher | Solana Nexus",
  description:
    "Efficiently send SOL to multiple addresses in batched transactions.",
};

export default function DispatchPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-black px-6 py-8 sm:px-12 sm:py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl">
            Token Dispatcher
          </h1>
          <p className="mt-2 text-sm text-zinc-400 sm:text-base">
            Upload or paste a list of addresses to securely batch transfer SOL.
            Transactions are automatically chunked to bypass network limits.
          </p>
        </div>

        <BulkDispatcherDashboard />
      </div>
    </main>
  );
}
