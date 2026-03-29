"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TokenMintSchema, TokenMintInput } from "../types";
import { useMintToken } from "../hooks/useMintToken";
import { useWallet } from "@solana/wallet-adapter-react";

export function TokenForgeForm() {
  const { connected } = useWallet();
  const mintMutation = useMintToken();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TokenMintInput>({
    resolver: zodResolver(TokenMintSchema),
    defaultValues: {
      decimals: 9, // Standard for Solana
    },
  });

  const onSubmit = (data: TokenMintInput) => {
    mintMutation.mutate(data, {
      onSuccess: () => {
        reset(); // Clear the form on success
      },
    });
  };

  if (!connected) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-center text-slate-400">
        Connect your wallet to access the Token Forge.
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl rounded-xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-sm">
      <div className="mb-6 border-b border-slate-800 pb-4">
        <h2 className="text-lg font-bold tracking-tight text-white">
          Native Token-2022 Mint
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Deploy a token with native metadata. No external protocols required.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          {/* Name Input */}
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase text-slate-400">
              Token Name
            </label>
            <input
              {...register("name")}
              placeholder="e.g. Nexus Coin"
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
            />
            {errors.name && (
              <span className="text-xs text-red-400">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Symbol Input */}
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase text-slate-400">
              Symbol
            </label>
            <input
              {...register("symbol")}
              placeholder="e.g. NEX"
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
            />
            {errors.symbol && (
              <span className="text-xs text-red-400">
                {errors.symbol.message}
              </span>
            )}
          </div>
        </div>

        {/* URI Input */}
        <div className="space-y-1">
          <label className="text-xs font-medium uppercase text-slate-400">
            Metadata URI
          </label>
          <input
            {...register("uri")}
            placeholder="https://arweave.net/..."
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
          />
          {errors.uri && (
            <span className="text-xs text-red-400">{errors.uri.message}</span>
          )}
        </div>

        {/* Decimals Input */}
        <div className="space-y-1">
          <label className="text-xs font-medium uppercase text-slate-400">
            Decimals
          </label>
          <input
            type="number"
            {...register("decimals", { valueAsNumber: true })}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
          />
          {errors.decimals && (
            <span className="text-xs text-red-400">
              {errors.decimals.message}
            </span>
          )}
        </div>

        {/* Status Feedback */}
        {mintMutation.isError && (
          <div className="rounded border border-red-900/50 bg-red-950/20 p-3 text-sm text-red-400">
            {mintMutation.error.message}
          </div>
        )}

        {mintMutation.isSuccess && (
          <div className="rounded border border-green-900/50 bg-green-950/20 p-3 text-sm text-green-400">
            Success! Mint Address:{" "}
            <span className="font-mono">{mintMutation.data.mintAddress}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={mintMutation.isPending}
          className="w-full rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-700 disabled:bg-slate-800 disabled:text-slate-500"
        >
          {mintMutation.isPending ? "Forging Token..." : "Forge Token"}
        </button>
      </form>
    </div>
  );
}
