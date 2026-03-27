"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React, { useEffect, useState } from "react";

export function WalletConnect() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-12 w-40 animate-pulse rounded-md bg-slate-800" />;
  }

  return (
    <div className="wallet-adapter-custom">
      <WalletMultiButton />
    </div>
  );
}
