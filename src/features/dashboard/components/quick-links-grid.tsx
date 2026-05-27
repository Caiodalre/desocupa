import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Inbox, Calendar, Bell, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickLinksGridProps {
  worryCount: number;
  notificationCount: number;
}

export function QuickLinksGrid({ worryCount, notificationCount }: QuickLinksGridProps) {
  const links = [
    {
      label: "Pensar depois",
      icon: Inbox,
      href: "/app/pensar-depois",
      badge: worryCount,
      color: "text-brand-purple",
    },
    {
      label: "Revisão semanal",
      icon: Calendar,
      href: "/app/revisao-semanal",
      color: "text-brand-purple",
    },
    {
      label: "Notificações",
      icon: Bell,
      href: "/app/notificacoes",
      badge: notificationCount,
      color: "text-brand-purple",
    },
    {
      label: "Nova obrigação",
      icon: PlusCircle,
      href: "/app/obrigacoes/nova",
      color: "text-brand-purple",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {links.map((link) => (
        <Link key={link.label} href={link.href} className="group">
          <Card className="flex flex-col items-center justify-center p-6 transition-all duration-200 hover:border-brand-purple/50 hover:shadow-sm active:scale-[0.98]">
            <div className="relative mb-3">
              <link.icon className={cn("h-8 w-8", link.color)} />
              {link.badge !== undefined && link.badge > 0 && (
                <Badge className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-purple px-1 text-[10px] font-bold text-white border-2 border-background">
                  {link.badge > 9 ? "9+" : link.badge}
                </Badge>
              )}
            </div>
            <p className="text-sm font-semibold text-brand-deep dark:text-slate-200">
              {link.label}
            </p>
          </Card>
        </Link>
      ))}
    </div>
  );
}
