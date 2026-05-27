"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Circle, CalendarClock, ChevronRight } from "lucide-react";
import { cn, formatRelativeDate, getDeadlineColor } from "@/lib/utils";
import { DashboardEmptyState } from "./dashboard-empty-state";
import type { Obligation } from "../types";

interface UpcomingDeadlinesCardProps {
  deadlines: Obligation[];
  onComplete: (obligation: Obligation) => Promise<void>;
  isProcessing: string | null;
}

export function UpcomingDeadlinesCard({
  deadlines,
  onComplete,
  isProcessing,
}: UpcomingDeadlinesCardProps) {
  return (
    <Card className="border-brand-purple/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Próximos prazos</CardTitle>
        <Link href="/app/obrigacoes">
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs text-brand-purple hover:text-brand-purple hover:bg-brand-purple/5">
            Ver todas
            <ChevronRight className="h-3 w-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {deadlines.length === 0 ? (
          <DashboardEmptyState
            icon={CalendarClock}
            title="Tudo em dia!"
            description="Nenhum prazo importante nos próximos 7 dias."
          />
        ) : (
          <div className="grid gap-2">
            {deadlines.slice(0, 5).map((obligation) => {
              const isLoading = isProcessing === obligation.id;

              return (
                <div
                  key={obligation.id}
                  className="group flex items-center justify-between rounded-xl border bg-card p-3 transition-all duration-200 hover:border-brand-purple/30 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 rounded-full p-0 text-muted-foreground hover:text-brand-purple"
                      disabled={!!isProcessing}
                      onClick={() => onComplete(obligation)}
                      aria-label={`Marcar ${obligation.title} como concluída`}
                    >
                      <Circle className={cn("h-4 w-4", isLoading && "animate-pulse")} />
                    </Button>
                    <Link
                      href={`/app/obrigacoes/${obligation.id}`}
                      className="flex-1 overflow-hidden"
                    >
                      <p className="truncate text-sm font-medium hover:text-brand-purple transition-colors">
                        {obligation.title}
                      </p>
                    </Link>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "ml-2 shrink-0 text-[10px] font-bold uppercase tracking-tight",
                      getDeadlineColor(obligation.due_date || "")
                    )}
                  >
                    {formatRelativeDate(obligation.due_date || "")}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
