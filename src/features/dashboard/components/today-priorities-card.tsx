"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardEmptyState } from "./dashboard-empty-state";
import type { Priority } from "../types";

interface TodayPrioritiesCardProps {
  priorities: Priority[];
  onComplete: (priority: Priority) => Promise<void>;
  isProcessing: string | null;
}

export function TodayPrioritiesCard({
  priorities,
  onComplete,
  isProcessing,
}: TodayPrioritiesCardProps) {
  return (
    <Card className="overflow-hidden border-brand-purple/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-semibold">Prioridades de hoje</CardTitle>
          <Badge variant="secondary" className="bg-brand-purple/10 text-brand-purple border-none font-bold text-[10px]">
            MIT
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {priorities.length === 0 ? (
          <DashboardEmptyState
            icon={Target}
            title="Nenhuma prioridade definida"
            description="Escolha até 3 tarefas importantes para deixar o dia mais leve."
          />
        ) : (
          <div className="grid gap-3">
            {priorities.slice(0, 3).map((priority) => {
              const isCompleted = !!priority.completed_at;
              const isLoading = isProcessing === priority.id;

              return (
                <div
                  key={priority.id}
                  className={cn(
                    "group flex items-center justify-between rounded-xl border p-4 transition-all duration-200",
                    isCompleted ? "bg-muted/30 border-transparent" : "bg-card hover:border-brand-purple/30 hover:shadow-sm"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-6 w-6 rounded-full p-0 transition-colors",
                        isCompleted ? "text-success" : "text-muted-foreground hover:text-brand-purple"
                      )}
                      disabled={isCompleted || !!isProcessing}
                      onClick={() => onComplete(priority)}
                      aria-label={`Marcar ${priority.obligations?.title || "tarefa"} como concluída`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : (
                        <Circle className={cn("h-6 w-6", isLoading && "animate-pulse")} />
                      )}
                    </Button>
                    <div className="space-y-0.5">
                      <p
                        className={cn(
                          "text-sm font-medium leading-none transition-all",
                          isCompleted && "line-through text-muted-foreground"
                        )}
                      >
                        {priority.obligations?.title || "Tarefa"}
                      </p>
                      {priority.obligations?.next_step && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {priority.obligations.next_step}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
