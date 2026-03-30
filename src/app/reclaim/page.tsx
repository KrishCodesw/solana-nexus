import React from "react";
import ReclaimerDashboard from "@/features/rent-reclaimer/components/ReclaimerDashboard";

export const metadata = {
  title: "Rent Reclaimer | Solana Nexus",
  description: "Scan and close empty token accounts to recover SOL rent.",
};

export default function ReclaimPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-4">
          Rent Reclaimer
        </h1>
        <p className="text-lg text-zinc-400">
          Every token interaction creates an account that locks up a small
          amount of SOL for storage rent. Use this tool to find empty accounts
          and sweep that SOL back into your main wallet.
        </p>
      </div>

      <ReclaimerDashboard />
    </main>
  );
}
