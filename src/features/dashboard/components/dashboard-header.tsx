import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DashboardHeaderProps {
  greeting: string;
}

export function DashboardHeader({ greeting }: DashboardHeaderProps) {
  const today = new Date();
  const formattedDate = format(today, "EEEE, d 'de' MMMM", { locale: ptBR });
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <div className="space-y-1">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-brand-deep dark:text-slate-100">
          {greeting}
        </h1>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="capitalize-first">{capitalizedDate}</span>
        <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
        <p>Aqui está o que merece sua atenção hoje.</p>
      </div>
    </div>
  );
}
