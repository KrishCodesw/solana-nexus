import { Connection, SystemProgram, Transaction, PublicKey } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { RawRecipient, ValidatedRecipient, ValidationResult } from '../types';

// 1. Data Validation
export function validateRecipients(recipients: RawRecipient[]): ValidationResult {
    const valid: ValidatedRecipient[] = [];
    const invalid: RawRecipient[] = [];

    for (const rec of recipients) {
        try {
            const pubkey = new PublicKey(rec.address);
            
            // Validate amount and convert SOL to Lamports (1 SOL = 10^9 Lamports)
            if (isNaN(rec.amount) || rec.amount <= 0) {
                throw new Error("Invalid amount");
            }
            const lamports = Math.floor(rec.amount * 1_000_000_000);
            
            valid.push({ pubkey, lamports });
        } catch (error) {
            // Catches malformed base58 strings or invalid amounts
            invalid.push(rec);
        }
    }

    return { valid, invalid };
}

// 2. Transaction Chunking
export function chunkRecipients<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}

// 3. The Dispatch Engine
export async function dispatchBulkSol(
    connection: Connection,
    wallet: WalletContextState,
    recipients: ValidatedRecipient[],
    batchSize: number = 15 // Safe limit for standard SOL transfers
): Promise<string[]> {
    if (!wallet.publicKey || !wallet.signAllTransactions) {
        throw new Error("Wallet not connected or does not support bulk signing");
    }

    const chunks = chunkRecipients(recipients, batchSize);
    const transactions: Transaction[] = [];

    // Build the transaction instructions
    for (const chunk of chunks) {
        const transaction = new Transaction();
        
        for (const recipient of chunk) {
            transaction.add(
                SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: recipient.pubkey,
                    lamports: recipient.lamports,
                })
            );
        }

        // Fetch fresh blockhash for each chunk
        const { blockhash } = await connection.getLatestBlockhash('confirmed');
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = wallet.publicKey;
        
        transactions.push(transaction);
    }

    try {
        // Prompt wallet once for all chunks
        const signedTxs = await wallet.signAllTransactions(transactions);
        const txSignatures: string[] = [];

        // Send to network
        for (const signedTx of signedTxs) {
            const signature = await connection.sendRawTransaction(signedTx.serialize(), {
                skipPreflight: false,
                preflightCommitment: 'confirmed'
            });
            txSignatures.push(signature);
        }
        
        return txSignatures;
    } catch (error) {
        console.error("Bulk dispatch failed:", error);
        throw error;
    }
}