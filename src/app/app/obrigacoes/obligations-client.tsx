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

interface ObligationsClientProps {
  obligations: any[];
  categories: any[];
}

export function ObligationsClient({ obligations, categories }: ObligationsClientProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todas");
  const [statusFilter, setStatusFilter] = useState("todas");
  const router = useRouter();
  const supabase = createClient();

  const filteredObligations = obligations.filter((o) => {
    const matchesSearch = o.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "todas" || o.category_slug === categoryFilter;
    const matchesStatus = statusFilter === "todas" || o.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleComplete = async (id: string) => {
    await (supabase.from("obligations") as any).update({ status: "completed", completed_at: new Date().toISOString() }).eq("id", id);
    toast.success("Obrigação concluída!");
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta obrigação?")) return;
    await (supabase.from("obligations") as any).delete().eq("id", id);
    toast.success("Obrigação excluída");
    router.refresh();
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-deep">Obrigações</h1>
        <Link href="/app/obrigacoes/nova">
          <Button size="sm"><Plus className="mr-2 h-4 w-4" />Nova</Button>
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar obrigações..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas categorias</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
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
            <Link href="/app/obrigacoes/nova"><Button variant="outline" className="mt-4">Criar primeira obrigação</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredObligations.map((o) => (
            <Link key={o.id} href={`/app/obrigacoes/${o.id}`}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <button onClick={(e) => { e.preventDefault(); handleComplete(o.id); }}>
                      {o.status === "completed" ? <CheckCircle2 className="h-5 w-5 text-success" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                    </button>
                    <div>
                      <p className={cn("font-medium", o.status === "completed" && "line-through text-muted-foreground")}>{o.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {o.category_slug && <Badge variant="outline" className="text-xs">{categories.find((c: any) => c.slug === o.category_slug)?.name || o.category_slug}</Badge>}
                        {o.due_date && <span className={cn("text-xs", getDeadlineColor(o.due_date))}>{formatRelativeDate(o.due_date)}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1" onClick={(e) => e.preventDefault()}>
                    <Button variant="ghost" size="icon" onClick={() => router.push(`/app/obrigacoes/${o.id}`)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(o.id)}><Trash2 className="h-4 w-4 text-danger" /></Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
