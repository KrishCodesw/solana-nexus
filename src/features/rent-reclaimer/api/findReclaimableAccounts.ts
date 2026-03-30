import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { ReclaimableAccount } from '../types';

export async function findReclaimableAccounts(
    connection: Connection,
    walletAddress: PublicKey
): Promise<ReclaimableAccount[]> {
    try {
        // Fetch all token accounts owned by the user
        const response = await connection.getParsedTokenAccountsByOwner(
            walletAddress,
            { programId: TOKEN_PROGRAM_ID }
        );

        const reclaimable: ReclaimableAccount[] = [];

        for (const accountInfo of response.value) {
            const parsedData = accountInfo.account.data.parsed.info;
            const tokenAmount = parsedData.tokenAmount;

            // We only want to close accounts that have exactly 0 tokens
            if (tokenAmount.uiAmount === 0) {
                // The account data gives us the rent lamports allocated
                const rentLamports = accountInfo.account.lamports;
                
                reclaimable.push({
                    pubkey: accountInfo.pubkey,
                    mint: new PublicKey(parsedData.mint),
                    rentLamports: rentLamports,
                });
            }
        }

        return reclaimable;
    } catch (error) {
        console.error("Error scanning for reclaimable accounts:", error);
        throw new Error("Failed to scan for empty accounts. Please try again.");
    }
}