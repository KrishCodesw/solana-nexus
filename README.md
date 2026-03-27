
````markdown
# Solana Nexus

**A Unified Utility Framework for the Token-2022 Era**


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
````

-----

## Tech Stack

  * **Framework:** Next.js 15 (App Router)
  * **Language:** TypeScript (Strict Mode)
  * **Blockchain:** `@solana/web3.js`, `@solana/spl-token`, `@solana/wallet-adapter`
  * **State Management:** TanStack Query (React Query)
  * **Styling:** Tailwind CSS
  * **Animation:** Framer Motion, GSAP, Lenis (Prepared for UI micro-interactions)
  * **Validation:** Zod

-----

## Getting Started

### Prerequisites

  * Node.js 18.17.0 or later
  * npm, yarn, or pnpm
  * A Solana wallet extension (Phantom, Solflare, etc.)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/your-org/solana-nexus.git](https://github.com/your-org/solana-nexus.git)
    cd solana-nexus
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Copy the example environment file and populate it with your preferred RPC endpoint.

    ```bash
    cp .env.example .env.local
    ```

    *Note: The application will fail to compile if `NEXT_PUBLIC_SOLANA_RPC_URL` is not provided, enforced by the internal Zod schema.*

4.  **Initialize Git Hooks:**

    ```bash
    npm run prepare
    ```

5.  **Start the Development Server:**

    ```bash
    npm run dev
    ```

Navigate to `http://localhost:3000` to interact with the Asset Command Center.

-----

## Development Workflow

This project enforces strict code quality gates.

  * **Pre-commit Hooks:** Husky and `lint-staged` will automatically run ESLint and Prettier on staged files. Commits will be rejected if linting fails.
  * **Pure Functions:** All Solana RPC interactions must be written as pure functions in the `api/` directory before being consumed by React hooks.
  * **Type Safety:** The use of implicit `any` is strictly prohibited. All on-chain data structures must be mapped to TypeScript interfaces.

-----

## License

This project is licensed under the MIT License - see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.

```

***

This document serves as a professional anchor for the project. It clearly communicates the architectural decisions and sets the standard for anyone viewing the repository. 

Would you like to move into Phase 3 and begin architecting the `Token Forge` module, specifically focusing on calculating the required account space for Token-2022 metadata?
```