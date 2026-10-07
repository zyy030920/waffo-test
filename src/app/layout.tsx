import type { Metadata } from "next";

import { AppShell } from "@/components/app-shell";
import { LocaleProvider } from "@/lib/locale";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

export const metadata: Metadata = {
  title: "合译 — 中英互译",
  description: "合译：五智能体中英互译工坊。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://d8j0ntlcm91z4.cloudfront.net" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@200;300;400&family=JetBrains+Mono:wght@300;400;500&family=Noto+Sans+SC:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col bg-black text-white" suppressHydrationWarning>
        <TooltipProvider>
          <LocaleProvider>
            <AppShell>{children}</AppShell>
            <Toaster theme="dark" />
          </LocaleProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
