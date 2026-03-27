# Solana Nexus

**A Unified Utility Framework for the Token-2022 Era**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15+-black.svg)](https://nextjs.org/)
[![Solana](https://img.shields.io/badge/Solana-Web3.js-green.svg)](https://solana.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Solana Nexus is a high-performance, developer-first web dashboard designed to handle the next generation of Solana assets. Bypassing legacy command-line interfaces and fragmented external protocols, Nexus provides a native, protocol-first approach to Solana token lifecycle management, with first-class support for the Token-2022 standard.

---

## Executive Summary

Current decentralized applications often rely on outdated fetching patterns, persistent WebSockets, and external metadata bridges. Solana Nexus solves this by utilizing a strict feature-sliced architecture, TanStack Query for optimized RPC data caching, and native Token-2022 extensions for on-chain interactions. 

### Current Capabilities (Phase 2 Completed)
* **Asset Command Center:** A read-only module that fetches and categorizes native SOL, standard SPL tokens, and Token-2022 assets.
* **Optimized RPC Fetching:** Utilizes TanStack Query to manage data staleness and prevent RPC rate-limiting.
* **Runtime Validation:** Strict environment variable validation using Zod prevents compilation if critical infrastructure (like RPC URLs) is missing.
* **Production-Grade Tooling:** Husky pre-commit hooks, strict ESLint rules, and Prettier formatting ensure consistent code quality.

### Upcoming Modules
* **The Token Forge:** Minting infrastructure utilizing the Token-2022 Metadata Pointer extension natively (bypassing Metaplex).
* **Bulk Dispatcher:** Smart transaction batching algorithm for mass distribution (Airdrops) adhering to the 1232-byte MTU limit.
* **Rent Reclaimer:** Automated scanning and closure of zero-balance Associated Token Accounts to reclaim rent lamports.

---

## System Architecture

The repository follows a strict **Feature-Sliced Design (FSD)** pattern. Domain logic is isolated from global UI components to ensure maintainability as the application scales.

```text
src/
├── app/                    # Next.js App Router (Layouts, Pages)
├── env/                    # Zod schema for strict environment validation
├── features/               # Domain-specific logic
│   └── asset-manager/      # Balances, ledger, token classification
│       ├── api/            # Pure Solana RPC interaction functions
│       ├── components/     # Domain-specific UI (Dashboard, Skeletons)
│       ├── hooks/          # TanStack Query wrappers
│       └── types.ts        # Strict TypeScript interfaces
├── lib/                    # Third-party initializations (WalletProvider, QueryClient)
└── shared/                 # Universal components (Buttons) and utilities