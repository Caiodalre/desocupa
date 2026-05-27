import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DashboardEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function DashboardEmptyState({
  icon: Icon,
  title,
  description,
  className,
}: DashboardEmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-8 text-center", className)}>
      <div className="mb-3 rounded-full bg-muted p-3">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground max-w-[200px]">
        {description}
      </p>
    </div>
  );
}
