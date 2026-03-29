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
    defaultValues: { decimals: 9 },
  });

  const onSubmit = (data: TokenMintInput) => {
    mintMutation.mutate(data, {
      onSuccess: () => reset(),
    });
  };

  if (!connected) {
    return (
      <div className="flex min-h-[200px] w-full items-center justify-center border border-zinc-800 bg-black p-6 font-mono">
        <div className="text-center">
          <div className="mb-4 inline-block border border-zinc-800 bg-zinc-950 px-4 py-2 text-xs uppercase tracking-widest text-zinc-500">
            Forge Locked
          </div>
          <p className="text-sm text-zinc-400">
            Connection required to initialize.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border border-zinc-800 bg-black p-6 font-mono transition-colors hover:border-zinc-700">
      <div className="mb-8 flex items-center justify-between border-b border-zinc-900 pb-4">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          T-2022 Native Initialization
        </h2>
        <span className="h-2 w-2 animate-pulse rounded-full bg-[#14F195] shadow-[0_0_10px_rgba(20,241,149,0.5)]" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Token Name
            </label>
            <input
              {...register("name")}
              placeholder="e.g. Nexus Core"
              className="w-full border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white placeholder-zinc-700 transition-colors focus:border-[#14F195] focus:outline-none"
            />
            {errors.name && (
              <span className="text-xs text-red-500">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Symbol
            </label>
            <input
              {...register("symbol")}
              placeholder="e.g. NEX"
              className="w-full border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white placeholder-zinc-700 transition-colors focus:border-[#14F195] focus:outline-none"
            />
            {errors.symbol && (
              <span className="text-xs text-red-500">
                {errors.symbol.message}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Metadata URI
          </label>
          <input
            {...register("uri")}
            placeholder="https://arweave.net/..."
            className="w-full border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white placeholder-zinc-700 transition-colors focus:border-[#14F195] focus:outline-none"
          />
          {errors.uri && (
            <span className="text-xs text-red-500">{errors.uri.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Decimals
          </label>
          <input
            type="number"
            {...register("decimals", { valueAsNumber: true })}
            className="w-full border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white transition-colors focus:border-[#14F195] focus:outline-none"
          />
          {errors.decimals && (
            <span className="text-xs text-red-500">
              {errors.decimals.message}
            </span>
          )}
        </div>

        {mintMutation.isError && (
          <div className="border border-red-900/50 bg-[#0a0000] p-4 text-xs uppercase text-red-500">
            [ERROR] {mintMutation.error.message}
          </div>
        )}

        {mintMutation.isSuccess && (
          <div className="border border-[#14F195]/30 bg-[#14F195]/5 p-4 text-xs uppercase text-[#14F195]">
            [SUCCESS] MINT CREATED: {mintMutation.data.mintAddress}
          </div>
        )}

        <button
          type="submit"
          disabled={mintMutation.isPending}
          className="w-full border border-transparent bg-[#14F195] px-4 py-4 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-[#00E1F0] disabled:border-zinc-800 disabled:bg-zinc-950 disabled:text-zinc-600"
        >
          {mintMutation.isPending ? "Executing Sequence..." : "Execute Mint"}
        </button>
      </form>
    </div>
  );
}
