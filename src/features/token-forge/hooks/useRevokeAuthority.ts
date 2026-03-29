import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  AuthorityType,
  createSetAuthorityInstruction,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";

export interface RevokeAuthorityInput {
  mintAddress: string;
  authorityType: AuthorityType;
}

export function useRevokeAuthority() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const queryClient = useQueryClient();

  return useMutation<string, Error, RevokeAuthorityInput>({
    mutationFn: async ({ mintAddress, authorityType }) => {
      if (!publicKey) throw new Error("Wallet not connected");

      let mintPubKey: PublicKey;
      try {
        mintPubKey = new PublicKey(mintAddress);
      } catch {
        throw new Error("Invalid Mint Address");
      }

      // 1. Construct the Revocation Instruction
      // We pass `null` as the newAuthority to permanently burn the right.
      const revokeInstruction = createSetAuthorityInstruction(
        mintPubKey,
        publicKey, // Current authority (the connected wallet)
        authorityType,
        null, // New authority (null = revoked)
        [],
        TOKEN_2022_PROGRAM_ID
      );

      const transaction = new Transaction().add(revokeInstruction);

      // 2. Fetch the latest blockhash
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // 3. Broadcast and confirm
      const signature = await sendTransaction(transaction, connection);

      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      }, "confirmed");

      if (confirmation.value.err) {
        throw new Error("Failed to revoke authority. Are you the current authority?");
      }

      return signature;
    },
    onSuccess: () => {
      // Refresh the asset dashboard to reflect the updated token state
      queryClient.invalidateQueries({ queryKey: ["assetBalances"] });
    },
  });
}