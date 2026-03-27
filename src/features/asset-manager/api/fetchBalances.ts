import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { WalletPortfolio, TokenAsset } from "../types";

export async function fetchWalletPortfolio(
  connection: Connection,
  walletAddress: PublicKey
): Promise<WalletPortfolio> {
  try {
    // 1. Fetch Native SOL Balance
    const solBalanceLamports = await connection.getBalance(walletAddress);
    const solBalance = solBalanceLamports / LAMPORTS_PER_SOL;

    // 2. Fetch Legacy SPL Tokens
    const legacyTokensResponse = await connection.getParsedTokenAccountsByOwner(
      walletAddress,
      { programId: TOKEN_PROGRAM_ID }
    );

    // 3. Fetch Token-2022 Tokens
    const token2022Response = await connection.getParsedTokenAccountsByOwner(
      walletAddress,
      { programId: TOKEN_2022_PROGRAM_ID }
    );

    const tokens: TokenAsset[] = [];

    // Helper function to parse the RPC response safely
    const parseTokenAccounts = (accounts: any[], isToken2022: boolean) => {
      accounts.forEach((accountInfo) => {
        const parsedData = accountInfo.account.data.parsed.info;
        
        // Only include accounts that actually hold a balance greater than 0
        // (Empty accounts will be handled separately by the Rent Reclaimer module)
        if (parsedData.tokenAmount.uiAmount > 0) {
          tokens.push({
            mint: parsedData.mint,
            amount: parsedData.tokenAmount.amount,
            decimals: parsedData.tokenAmount.decimals,
            uiAmountString: parsedData.tokenAmount.uiAmountString,
            associatedTokenAddress: accountInfo.pubkey.toBase58(),
            isToken2022,
          });
        }
      });
    };

    parseTokenAccounts(legacyTokensResponse.value, false);
    parseTokenAccounts(token2022Response.value, true);

    return {
      solBalance,
      tokens,
    };
  } catch (error) {
    console.error("Error fetching wallet portfolio:", error);
    throw new Error("Failed to retrieve asset balances from the blockchain.");
  }
}