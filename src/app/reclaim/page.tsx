import React from "react";
import ReclaimerDashboard from "@/features/rent-reclaimer/components/ReclaimerDashboard";

export const metadata = {
  title: "Rent Reclaimer | Solana Nexus",
  description: "Scan and close empty token accounts to recover SOL rent.",
};

export default function ReclaimPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-black px-6 py-8 sm:px-12 sm:py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl">
            Rent Reclaimer
          </h1>
          <p className="mt-2 text-sm text-zinc-400 sm:text-base">
            Every token interaction creates an account that locks up a small
            amount of SOL for storage rent. Use this tool to find empty accounts
            and sweep that SOL back into your main wallet.
          </p>
        </div>

        <ReclaimerDashboard />
      </div>
    </main>
  );
}
