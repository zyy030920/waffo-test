"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText, Languages, Settings2, TableProperties, Workflow, Zap } from "lucide-react";

import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "工坊", icon: Languages },
  { href: "/fast", label: "快译", icon: Zap },
  { href: "/glossary", label: "术语表", icon: TableProperties },
  { href: "/guide", label: "教材", icon: BookOpenText },
  { href: "/guide/dify", label: "Dify教程", icon: Workflow },
  { href: "/settings", label: "设置", icon: Settings2 },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-30 border-b border-[color:var(--seal)]/15 bg-[color:var(--paper)]/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="seal">译</span>
            <span className="leading-tight">
              <span className="font-heading block text-lg tracking-wide">对词</span>
              <span className="text-muted-foreground text-xs">
                五 Agent 时政翻译工坊
              </span>
            </span>
          </Link>
          <nav className="flex flex-wrap items-center justify-end gap-1">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-6 md:py-8">
        {children}
      </main>
    </div>
  );
}
