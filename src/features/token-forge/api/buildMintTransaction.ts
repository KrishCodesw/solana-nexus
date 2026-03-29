import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createInitializeMintInstruction,
  createInitializeMetadataPointerInstruction,
  getMintLen,
} from "@solana/spl-token";
import { createInitializeInstruction, pack } from "@solana/spl-token-metadata";
import { TokenMintInput } from "../types";

/**
 * Builds an atomic transaction to create a natively structured Token-2022 Mint.
 * @param connection - The active Solana RPC connection
 * @param payer - The public key of the wallet funding the transaction
 * @param input - The validated token metadata (Name, Symbol, URI, Decimals)
 * @returns A tuple containing the raw Transaction and the generated Mint Keypair
 */
export async function buildNativeMintTransaction(
  connection: Connection,
  payer: PublicKey,
  input: TokenMintInput
): Promise<{ transaction: Transaction; mintKeypair: Keypair }> {
  // 1. Generate a fresh Keypair for the new Mint
  const mintKeypair = Keypair.generate();
  const mintAddress = mintKeypair.publicKey;

  // 2. Define the Metadata state
  const metadata = {
    mint: mintAddress,
    name: input.name,
    symbol: input.symbol,
    uri: input.uri,
    additionalMetadata: [],
  };

  // 3. Calculate exact space required on-chain
  const mintLen = getMintLen([ExtensionType.MetadataPointer]);
  const metadataLen = ExtensionType.MetadataPointer + pack(metadata).length;
  const totalRequiredSpace = mintLen + metadataLen;

  // 4. Calculate Rent Exemption
  const lamports = await connection.getMinimumBalanceForRentExemption(totalRequiredSpace);

  // 5. Construct the Instruction Sequence
  const transaction = new Transaction().add(
    // Instruction A: Create the account
    SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: mintAddress,
      space: totalRequiredSpace,
      lamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    
    // Instruction B: Initialize the Metadata Pointer
    createInitializeMetadataPointerInstruction(
      mintAddress,
      payer, 
      mintAddress, 
      TOKEN_2022_PROGRAM_ID
    ),

    // Instruction C: Initialize the Base Mint
    createInitializeMintInstruction(
      mintAddress,
      input.decimals,
      payer, 
      payer, 
      TOKEN_2022_PROGRAM_ID
    ),

    // Instruction D: Initialize the actual Metadata strings
    createInitializeInstruction({
      programId: TOKEN_2022_PROGRAM_ID,
      metadata: mintAddress,
      updateAuthority: payer,
      mint: mintAddress,
      mintAuthority: payer,
      name: metadata.name,
      symbol: metadata.symbol,
      uri: metadata.uri,
    })
  );

  return { transaction, mintKeypair };
}