"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, ListTodo, Brain, Calendar, Settings } from "lucide-react";

interface MobileNavProps {
  notificationCount: number;
}

export function MobileNav({ notificationCount }: MobileNavProps) {
  const pathname = usePathname();

  const links = [
    { href: "/app", label: "Hoje", icon: Home },
    { href: "/app/obrigacoes", label: "Obrigações", icon: ListTodo },
    { href: "/app/captura", label: "Capturar", icon: Brain },
    { href: "/app/revisao-semanal", label: "Revisão", icon: Calendar },
    { href: "/app/configuracoes", label: "Ajustes", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card lg:hidden">
      <div className="flex items-center justify-around py-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1 text-xs",
              pathname === link.href ? "text-brand-purple" : "text-muted-foreground"
            )}
          >
            <link.icon className="h-5 w-5" />
            <span>{link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
