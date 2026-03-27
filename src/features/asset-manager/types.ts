import { PublicKey } from "@solana/web3.js";

export interface TokenAsset {
  mint: string;
  amount: number;
  decimals: number;
  uiAmountString: string;
  isToken2022: boolean;
  associatedTokenAddress: string;
}

export interface WalletPortfolio {
  solBalance: number;
  tokens: TokenAsset[];
}