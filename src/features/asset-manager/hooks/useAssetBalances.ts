import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { fetchWalletPortfolio } from "../api/fetchBalances";
import { WalletPortfolio } from "../types";

export function useAssetBalances() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  return useQuery<WalletPortfolio | null, Error>({
    // The query key ensures the cache is uniquely tied to the user's public key
    queryKey: ["assetBalances", publicKey?.toBase58()],
    queryFn: async () => {
      if (!publicKey) return null;
      return await fetchWalletPortfolio(connection, publicKey);
    },
    // Prevent fetching if the wallet is not connected
    enabled: !!publicKey,
    // Data is considered fresh for 30 seconds to minimize redundant RPC calls
    staleTime: 30 * 1000, 
    refetchOnMount: true,
  });
}