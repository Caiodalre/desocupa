"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { formatRelativeDate, getDeadlineColor, cn } from "@/lib/utils";
import { Plus, Search, Filter, CheckCircle2, Circle, Trash2, Edit } from "lucide-react";
import type { Database } from "@/types/database";

type Obligation = Database["public"]["Tables"]["obligations"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];
type StatusFilter = "todas" | "active" | "completed" | "archived";

interface ObligationsClientProps {
  obligations: Obligation[];
  categories: Category[];
}

export function ObligationsClient({ obligations, categories }: ObligationsClientProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todas");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todas");
  const router = useRouter();

  const filteredObligations = obligations.filter((obligation) => {
    const matchesSearch = obligation.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "todas" || obligation.category_slug === categoryFilter;
    const matchesStatus =
      statusFilter === "todas" || obligation.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleComplete = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("obligations")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      toast.error("Erro ao concluir obrigação.");
      return;
    }

    toast.success("Obrigação concluída!");
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta obrigação?")) return;

    const supabase = createClient();
    const { error } = await supabase.from("obligations").delete().eq("id", id);

    if (error) {
      toast.error("Erro ao excluir obrigação.");
      return;
    }

    toast.success("Obrigação excluída");
    router.refresh();
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-deep">Obrigações</h1>
        <Button size="sm" asChild>
          <Link href="/app/obrigacoes/nova">
            <Plus className="mr-2 h-4 w-4" />
            Nova
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar obrigações..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas categorias</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.slug} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(value) => {
            if (
              value === "todas" ||
              value === "active" ||
              value === "completed" ||
              value === "archived"
            ) {
              setStatusFilter(value);
            }
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todos</SelectItem>
            <SelectItem value="active">Ativas</SelectItem>
            <SelectItem value="completed">Concluídas</SelectItem>
            <SelectItem value="archived">Arquivadas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredObligations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Nenhuma obrigação encontrada.</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/app/obrigacoes/nova">Criar primeira obrigação</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredObligations.map((obligation) => {
            const categoryName =
              categories.find((category) => category.slug === obligation.category_slug)?.name ??
              obligation.category_slug;

            return (
              <Card key={obligation.id} className="transition-colors hover:bg-muted/50">
                <CardContent className="flex items-center justify-between gap-3 p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => void handleComplete(obligation.id)}
                      disabled={obligation.status === "completed"}
                      aria-label={`Marcar ${obligation.title} como concluída`}
                    >
                      {obligation.status === "completed" ? (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>

                    <Link
                      href={`/app/obrigacoes/${obligation.id}`}
                      className="min-w-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <p
                        className={cn(
                          "truncate font-medium",
                          obligation.status === "completed" &&
                            "text-muted-foreground line-through"
                        )}
                      >
                        {obligation.title}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        {categoryName && (
                          <Badge variant="outline" className="text-xs">
                            {categoryName}
                          </Badge>
                        )}
                        {obligation.due_date && (
                          <span
                            className={cn(
                              "text-xs",
                              getDeadlineColor(obligation.due_date)
                            )}
                          >
                            {formatRelativeDate(obligation.due_date)}
                          </span>
                        )}
                      </div>
                    </Link>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link
                        href={`/app/obrigacoes/${obligation.id}`}
                        aria-label={`Editar ${obligation.title}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => void handleDelete(obligation.id)}
                      aria-label={`Excluir ${obligation.title}`}
                    >
                      <Trash2 className="h-4 w-4 text-danger" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
