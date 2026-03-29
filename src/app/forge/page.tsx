import { TokenForgeForm } from "@/features/token-forge/components/TokenForgeForm";
import { AuthorityGuard } from "@/features/token-forge/components/AuthorityGuard";

export default function ForgePage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] p-8 sm:p-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">
            The Token Forge
          </h1>
          <p className="mt-1 text-sm text-black">
            Mint and configure native Token-2022 assets.
          </p>
        </div>

        <div className="flex flex-col items-center gap-8">
          <TokenForgeForm />
          <AuthorityGuard />
        </div>
      </div>
    </main>
  );
}
