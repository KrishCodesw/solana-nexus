import { Connection, Transaction, PublicKey } from '@solana/web3.js';
import { createCloseAccountInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { ReclaimableAccount } from '../types';

// A quick local chunking helper, or you can import the one from bulk-dispatcher
function chunkAccounts<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}

export async function executeRentReclaim(
    connection: Connection,
    wallet: WalletContextState,
    accountsToClose: ReclaimableAccount[],
    batchSize: number = 12 // 12-15 is usually very safe for close instructions
): Promise<string[]> {
    if (!wallet.publicKey || !wallet.signAllTransactions) {
        throw new Error("Wallet not connected or does not support bulk signing");
    }

    const chunks = chunkAccounts(accountsToClose, batchSize);
    const transactions: Transaction[] = [];

    // Step 1: Build the batched transactions
    for (const chunk of chunks) {
        const transaction = new Transaction();
        
        for (const account of chunk) {
            transaction.add(
                createCloseAccountInstruction(
                    account.pubkey,        // The token account to close
                    wallet.publicKey,      // The destination for the reclaimed SOL
                    wallet.publicKey,      // The owner of the token account
                    [],                    // Multisig signers (empty for standard wallets)
                    TOKEN_PROGRAM_ID       // The SPL Token Program ID
                )
            );
        }

        const { blockhash } = await connection.getLatestBlockhash('confirmed');
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = wallet.publicKey;
        
        transactions.push(transaction);
    }

    try {
        // Step 2: Prompt wallet to sign all batches at once
        const signedTxs = await wallet.signAllTransactions(transactions);
        const txSignatures: string[] = [];

        // Step 3: Dispatch to the network
        for (const signedTx of signedTxs) {
            const signature = await connection.sendRawTransaction(signedTx.serialize(), {
                skipPreflight: false,
                preflightCommitment: 'confirmed'
            });
            txSignatures.push(signature);
        }
        
        return txSignatures;
    } catch (error) {
        console.error("Failed to execute rent reclaim:", error);
        throw error;
    }
}