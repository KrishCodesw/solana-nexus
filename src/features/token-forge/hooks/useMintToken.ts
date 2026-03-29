import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { buildNativeMintTransaction } from "../api/buildMintTransaction";
import { TokenMintInput, ForgeTransactionResult } from "../types";

export function useMintToken() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const queryClient = useQueryClient();

  return useMutation<ForgeTransactionResult, Error, TokenMintInput>({
    mutationFn: async (input: TokenMintInput) => {
      if (!publicKey) throw new Error("Wallet not connected");

      // 1. Build the transaction and get the generated keypair
      const { transaction, mintKeypair } = await buildNativeMintTransaction(
        connection,
        publicKey,
        input
      );

      // 2. Fetch the latest blockhash to ensure the transaction doesn't expire
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // 3. Partially sign the transaction with the newly generated Mint Keypair.
      // The user's wallet will provide the second signature automatically via sendTransaction.
      transaction.sign(mintKeypair);

      // 4. Send the transaction to the network
      const signature = await sendTransaction(transaction, connection, {
        skipPreflight: false, // We want the RPC to simulate this before broadcasting
      });

      // 5. Await network confirmation
      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      }, "confirmed");

      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err.toString()}`);
      }

      return {
        signature,
        mintAddress: mintKeypair.publicKey.toBase58(),
      };
    },
    onSuccess: () => {
      // Invalidate the asset balances cache so the new token appears immediately in the Command Center
      queryClient.invalidateQueries({ queryKey: ["assetBalances"] });
    },
  });
}