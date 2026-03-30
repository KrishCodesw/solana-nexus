"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { WalletConnect } from "./WalletConnect";

export function TopNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Added Bulk Dispatcher and Rent Reclaimer here
  const navLinks = [
    { name: "Command Center", href: "/" },
    { name: "Token Forge", href: "/forge" },
    { name: "Bulk Dispatcher", href: "/dispatch" },
    { name: "Rent Reclaimer", href: "/reclaim" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-black/100 font-mono backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8 lg:gap-12">
          {/* Terminal-style Logo */}
          <Link
            href="/"
            className="flex items-center text-xl font-bold tracking-tighter text-white"
          >
            <span className="animate-pulse text-[#14F195]">_</span> SOLANA NEXUS
            <span className="animate-pulse text-[#14F195]">_</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden space-x-6 sm:flex lg:space-x-8 relative">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative py-1 text-[11px] font-bold uppercase tracking-widest transition-colors lg:text-xs ${
                    isActive
                      ? "text-[#14F195]"
                      : "text-zinc-500 hover:text-white"
                  }`}
                >
                  {link.name}
                  {/* Smooth active state indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-[22px] left-0 right-0 h-[2px] bg-[#14F195]"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden sm:block">
          <WalletConnect />
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="text-zinc-400 transition-colors hover:text-[#14F195] sm:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-zinc-900 bg-black sm:hidden"
          >
            <nav className="flex flex-col space-y-4 px-6 py-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-[13px] font-bold uppercase tracking-widest transition-colors ${
                      isActive
                        ? "text-[#14F195]"
                        : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="mt-2 border-t border-zinc-900 pt-4">
                <WalletConnect />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
