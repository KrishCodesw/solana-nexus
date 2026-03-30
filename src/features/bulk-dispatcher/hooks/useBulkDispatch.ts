
import { useState, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { ValidatedRecipient } from '../types';
import { dispatchBulkSol } from '../api/dispatchTransactions';

export function useBulkDispatch() {
    const { connection } = useConnection();
    const wallet = useWallet();
    
    const [isDispatching, setIsDispatching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [signatures, setSignatures] = useState<string[]>([]);

    const dispatch = useCallback(async (recipients: ValidatedRecipient[], batchSize: number = 15) => {
        // Basic guardrails
        if (!wallet.publicKey) {
            setError("Wallet not connected.");
            return;
        }
        if (!wallet.signAllTransactions) {
            setError("Your wallet does not support bulk signing.");
            return;
        }

        setIsDispatching(true);
        setError(null);
        setSignatures([]);

        try {
            // Execute the core engine logic
            const txSignatures = await dispatchBulkSol(connection, wallet, recipients, batchSize);
            setSignatures(txSignatures);
            return txSignatures;
        } catch (err: any) {
            console.error("Error in useBulkDispatch:", err);
            setError(err.message || "An unknown error occurred during dispatch. Please try again.");
            throw err;
        } finally {
            setIsDispatching(false);
        }
    }, [connection, wallet]);

    // A helper to clear errors/success messages when the user inputs new data
    const resetState = useCallback(() => {
        setError(null);
        setSignatures([]);
    }, []);

    return {
        dispatch,
        isDispatching,
        error,
        signatures,
        resetState
    };
}