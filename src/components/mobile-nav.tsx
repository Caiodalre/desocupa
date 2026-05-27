"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, ListTodo, Brain, Settings, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MobileNavProps {
  notificationCount: number;
}

export function MobileNav({ notificationCount }: MobileNavProps) {
  const pathname = usePathname();

  const links = [
    { href: "/app", label: "Hoje", icon: Home },
    { href: "/app/obrigacoes", label: "Obrigações", icon: ListTodo },
    { href: "/app/captura", label: "Capturar", icon: Brain },
    { href: "/app/notificacoes", label: "Notificações", icon: Bell, badge: notificationCount },
    { href: "/app/configuracoes", label: "Ajustes", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card lg:hidden">
      <div className="flex items-center justify-around py-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const showBadge = link.badge !== undefined && link.badge > 0;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1 text-xs transition-colors",
                isActive ? "text-brand-purple" : "text-muted-foreground hover:text-brand-purple/70"
              )}
              aria-label={link.badge ? `${link.label}, ${link.badge} notificações` : link.label}
            >
              <div className="relative">
                <link.icon className="h-5 w-5" />
                {showBadge && (
                  <Badge 
                    className="absolute -right-2 -top-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-danger px-1 text-[8px] font-bold text-white border-2 border-background"
                  >
                    {link.badge! > 9 ? "9+" : link.badge}
                  </Badge>
                )}
              </div>
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
