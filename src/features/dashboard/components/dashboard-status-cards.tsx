import Link from "next/link";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ListTodo, Calendar, Bell, Inbox } from "lucide-react";

interface DashboardStatusCardsProps {
  obligationsCount: number;
  upcomingCount: number;
  notificationsCount: number;
  worryCount: number;
}

export function DashboardStatusCards({
  obligationsCount,
  upcomingCount,
  notificationsCount,
  worryCount,
}: DashboardStatusCardsProps) {
  const cards = [
    {
      label: "Ativas",
      value: obligationsCount,
      icon: ListTodo,
      href: "/app/obrigacoes",
      color: "text-brand-purple",
    },
    {
      label: "Próx. 7 dias",
      value: upcomingCount,
      icon: Calendar,
      href: "/app/obrigacoes",
      color: "text-warning",
    },
    {
      label: "Notificações",
      value: notificationsCount,
      icon: Bell,
      href: "/app/notificacoes",
      color: "text-brand-deep dark:text-brand-purple-light",
    },
    {
      label: "Pensar depois",
      value: worryCount,
      icon: Inbox,
      href: "/app/pensar-depois",
      color: "text-muted-foreground",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((card) => (
        <Link key={card.label} href={card.href} className="group">
          <Card className="flex flex-col items-center justify-center p-4 transition-all duration-200 hover:border-brand-purple/50 hover:shadow-sm active:scale-[0.98]">
            <card.icon className={cn("mb-2 h-5 w-5", card.color)} />
            <p className="text-2xl font-bold tracking-tight">{card.value}</p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {card.label}
            </p>
          </Card>
        </Link>
      ))}
    </div>
  );
}
