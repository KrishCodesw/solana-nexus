import { TokenForgeForm } from "@/features/token-forge/components/TokenForgeForm";
import { AuthorityGuard } from "@/features/token-forge/components/AuthorityGuard";

export default function ForgePage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-black px-6 py-8 sm:px-12 sm:py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl">
            The Token Forge
          </h1>
          <p className="mt-2 text-sm text-zinc-400 sm:text-base">
            Mint and configure native Token-2022 assets.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          <TokenForgeForm />
          <AuthorityGuard />
        </div>
      </div>
    </main>
  );
}
