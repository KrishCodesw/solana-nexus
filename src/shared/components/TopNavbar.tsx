"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletConnect } from "./WalletConnect";

export function TopNav() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Command Center", href: "/" },
    { name: "Token Forge", href: "/forge" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-black font-mono">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-12">
          {/* Terminal-style Logo */}
          <span className="text-xl font-bold tracking-tighter text-white">
            NEXUS<span className="animate-pulse text-[#14F195]">_</span>
          </span>

          <nav className="hidden space-x-8 sm:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${
                    isActive
                      ? "text-[#14F195]"
                      : "text-zinc-500 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <WalletConnect />
      </div>
    </header>
  );
}
