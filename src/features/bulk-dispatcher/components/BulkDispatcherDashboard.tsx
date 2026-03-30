"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { useBulkDispatch } from "../hooks/useBulkDispatch";
import { validateRecipients } from "../api/dispatchTransactions";
import { RawRecipient, ValidatedRecipient } from "../types";

export default function BulkDispatcherDashboard() {
  const { connected } = useWallet();
  const { dispatch, isDispatching, error, signatures, resetState } =
    useBulkDispatch();

  const [inputText, setInputText] = useState("");
  const [validRecipients, setValidRecipients] = useState<ValidatedRecipient[]>(
    [],
  );
  const [invalidCount, setInvalidCount] = useState(0);
  const [hasValidated, setHasValidated] = useState(false);

  // Parses the textarea input into RawRecipients
  const handleParseAndValidate = () => {
    resetState();

    // Split by new line, ignore empty lines
    const lines = inputText.split("\n").filter((line) => line.trim() !== "");

    const rawRecipients: RawRecipient[] = lines.map((line) => {
      const [address, amountStr] = line.split(",").map((str) => str.trim());
      return {
        address: address || "",
        amount: parseFloat(amountStr) || 0,
      };
    });

    const { valid, invalid } = validateRecipients(rawRecipients);
    setValidRecipients(valid);
    setInvalidCount(invalid.length);
    setHasValidated(true);
  };

  const handleDispatch = async () => {
    if (validRecipients.length === 0) return;
    await dispatch(validRecipients);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg text-zinc-100">
      <h2 className="text-2xl font-semibold mb-2">Bulk SOL Dispatcher</h2>
      <p className="text-zinc-400 mb-6 text-sm">
        Paste your recipients below. Format:{" "}
        <code className="bg-zinc-800 px-1 rounded">Address, Amount</code> (one
        per line).
      </p>

      <textarea
        className="w-full h-48 p-4 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-y mb-4 transition-all"
        placeholder="Ex:\n7a1x...xyz, 1.5\n9B2y...abc, 0.25"
        value={inputText}
        onChange={(e) => {
          setInputText(e.target.value);
          setHasValidated(false); // Reset validation when user types
        }}
        disabled={isDispatching}
      />

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleParseAndValidate}
          disabled={!inputText.trim() || isDispatching}
          className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 rounded-lg font-medium transition-colors"
        >
          Validate List
        </button>

        {hasValidated && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 text-sm"
          >
            <span className="text-emerald-400 font-medium">
              {validRecipients.length} Valid
            </span>
            {invalidCount > 0 && (
              <span className="text-red-400 font-medium">
                {invalidCount} Invalid
              </span>
            )}
          </motion.div>
        )}
      </div>

      {/* Error & Success States */}
      {error && (
        <div className="p-4 mb-6 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {signatures.length > 0 && (
        <div className="p-4 mb-6 bg-emerald-900/30 border border-emerald-800 rounded-lg text-emerald-400 text-sm flex flex-col gap-2">
          <p className="font-semibold">Success! Transactions Dispatched:</p>
          {signatures.map((sig, idx) => (
            <a
              key={idx}
              href={`https://explorer.solana.com/tx/${sig}?cluster=devnet`}
              target="_blank"
              rel="noreferrer"
              className="hover:underline truncate"
            >
              Batch {idx + 1}: {sig}
            </a>
          ))}
        </div>
      )}

      {/* Main Action Button */}
      <button
        onClick={handleDispatch}
        disabled={
          !connected ||
          !hasValidated ||
          validRecipients.length === 0 ||
          isDispatching
        }
        className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-500 rounded-lg font-bold transition-colors flex justify-center items-center gap-2"
      >
        {isDispatching ? (
          <span className="animate-pulse">Dispatching to Network...</span>
        ) : !connected ? (
          "Connect Wallet to Dispatch"
        ) : (
          `Send to ${validRecipients.length} Addresses`
        )}
      </button>
    </div>
  );
}
