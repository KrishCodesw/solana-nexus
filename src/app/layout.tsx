import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppWalletProvider from "@/lib/AppWalletProvider";
import { TopNav } from "@/shared/components/TopNavbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solana Nexus",
  description: "A unified utility framework for Token-2022",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-slate-950 text-slate-50 antialiased`}
      >
        <AppWalletProvider>
          {/* TopNav is now globally available */}
          <TopNav />
          {children}
        </AppWalletProvider>
      </body>
    </html>
  );
}
