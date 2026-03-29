import { z } from "zod";

// Zod schema for runtime form validation
export const TokenMintSchema = z.object({
  name: z.string().min(1, "Name is required").max(32, "Name is too long"),
  symbol: z.string().min(1, "Symbol is required").max(10, "Symbol is too long"),
  uri: z.string().url("Must be a valid URL (e.g., Arweave/IPFS link)"),
  decimals: z.number().int().min(0).max(9),
});

export type TokenMintInput = z.infer<typeof TokenMintSchema>;

export interface ForgeTransactionResult {
  signature: string;
  mintAddress: string;
}