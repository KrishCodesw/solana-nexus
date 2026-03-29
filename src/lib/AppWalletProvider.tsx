"use client";

import React, { useMemo, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { env } from "@/env/schema";3

// Import the default styles for the wallet modal
import "@solana/wallet-adapter-react-ui/styles.css";

export default function AppWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Consume the validated RPC URL directly from the zod schema
  const endpoint = env.NEXT_PUBLIC_SOLANA_RPC_URL;

  // Wallets that support the Wallet Standard are auto-detected.
  // Legacy wallets can be added to this array if strict support is required.
  const wallets = useMemo(() => [], []);

  // Initialize QueryClient within state to prevent data sharing across requests
  // in Next.js App Router, while setting a 1-minute stale time to reduce RPC load.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
