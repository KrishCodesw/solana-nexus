import { PublicKey } from '@solana/web3.js';

export interface ReclaimableAccount {
    pubkey: PublicKey;      // The actual token account address
    mint: PublicKey;        // The token mint address (for UI display purposes)
    rentLamports: number;   // The amount of SOL locked in the account
}