import { PublicKey } from '@solana/web3.js';

export interface RawRecipient {
    address: string;
    amount: number; // Amount in SOL
}

export interface ValidatedRecipient {
    pubkey: PublicKey;
    lamports: number; // Converted amount for the transaction
}

export interface ValidationResult {
    valid: ValidatedRecipient[];
    invalid: RawRecipient[];
}