import { useState, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { ReclaimableAccount } from '../types';
import { findReclaimableAccounts } from '../api/findReclaimableAccounts';
import { executeRentReclaim } from '../api/closeAccounts';

export function useRentReclaimer() {
    const { connection } = useConnection();
    const wallet = useWallet();
    
    // State Management
    const [accounts, setAccounts] = useState<ReclaimableAccount[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [isReclaiming, setIsReclaiming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [signatures, setSignatures] = useState<string[]>([]);

    // Action 1: Scan the blockchain
    const scan = useCallback(async () => {
        if (!wallet.publicKey) {
            setError("Please connect your wallet first.");
            return;
        }

        setIsScanning(true);
        setError(null);
        setAccounts([]);
        setSignatures([]);

        try {
            const foundAccounts = await findReclaimableAccounts(connection, wallet.publicKey);
            setAccounts(foundAccounts);
        } catch (err: any) {
            console.error("Scanning error:", err);
            setError(err.message || "Failed to scan for empty accounts. Please try again.");
        } finally {
            setIsScanning(false);
        }
    }, [connection, wallet.publicKey]);

    // Action 2: Execute the reclaim transactions
    const reclaim = useCallback(async () => {
        if (!wallet.publicKey || !wallet.signAllTransactions) {
            setError("Wallet not connected or does not support bulk signing.");
            return;
        }
        if (accounts.length === 0) return;

        setIsReclaiming(true);
        setError(null);

        try {
            const txSignatures = await executeRentReclaim(connection, wallet, accounts);
            setSignatures(txSignatures);
            
            // Clear the accounts list on success so the user can't double-click
            setAccounts([]); 
            return txSignatures;
        } catch (err: any) {
            console.error("Reclaim execution error:", err);
            setError(err.message || "An error occurred while reclaiming rent.");
            throw err;
        } finally {
            setIsReclaiming(false);
        }
    }, [connection, wallet, accounts]);

    // Helper to calculate total reclaimable SOL for the UI
    const totalReclaimableSol = accounts.reduce(
        (sum, acc) => sum + acc.rentLamports, 0
    ) / 1_000_000_000;

    return {
        accounts,
        totalReclaimableSol,
        isScanning,
        isReclaiming,
        error,
        signatures,
        scan,
        reclaim
    };
}