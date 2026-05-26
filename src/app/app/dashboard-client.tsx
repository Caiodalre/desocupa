"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { formatRelativeDate, getDeadlineColor, cn } from "@/lib/utils";
import { CheckCircle2, Circle, Brain, Plus, Inbox, Bell, Calendar } from "lucide-react";

interface DashboardClientProps {
  user: any;
  profile: any;
  obligations: any[];
  priorities: any[];
  upcomingDeadlines: any[];
  notifications: any[];
  worryCount: number;
  subscription: any;
  greeting: string;
}

export function DashboardClient({
  user,
  profile,
  obligations,
  priorities,
  upcomingDeadlines,
  notifications,
  worryCount,
  subscription,
  greeting,
}: DashboardClientProps) {
  const [captureInput, setCaptureInput] = useState("");
  const [captureLoading, setCaptureLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleManualCreate = () => {
    if (!captureInput.trim()) return;
    router.push(`/app/obrigacoes/nova?title=${encodeURIComponent(captureInput.trim())}`);
  };

  const handleAICapture = async () => {
    if (!captureInput.trim()) return;
    if (!profile?.ai_consent) {
      toast.error("Você precisa ativar o uso de IA nas configurações.");
      return;
    }
    setCaptureLoading(true);
    try {
      const response = await fetch("/api/ai/analyze-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: captureInput }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro na análise");
      }
      const result = await response.json();
      sessionStorage.setItem("captureSuggestions", JSON.stringify(result));
      router.push("/app/captura");
    } catch (error: any) {
      toast.error(error.message || "Erro ao processar com IA. Tente criar manualmente.");
    } finally {
      setCaptureLoading(false);
    }
  };

  const handleCompletePriority = async (id: string) => {
    await (supabase.from("daily_priorities") as any).update({ completed_at: new Date().toISOString() }).eq("id", id);
    toast.success("Tarefa concluída!");
    router.refresh();
  };

  const handleCompleteObligation = async (id: string) => {
    await (supabase.from("obligations") as any).update({ status: "completed", completed_at: new Date().toISOString() }).eq("id", id);
    toast.success("Obrigação concluída!");
    router.refresh();
  };

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-brand-deep">{greeting}</h1>
        <p className="text-muted-foreground">Aqui está o que merece sua atenção hoje.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-brand-purple">{obligations.length}</p>
          <p className="text-xs text-muted-foreground">Ativas</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-warning">{upcomingDeadlines.length}</p>
          <p className="text-xs text-muted-foreground">Próx. 7 dias</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-brand-deep">{notifications.length}</p>
          <p className="text-xs text-muted-foreground">Notificações</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-muted-foreground">{worryCount}</p>
          <p className="text-xs text-muted-foreground">Pensar depois</p>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Prioridades de hoje</CardTitle>
          <Badge variant="outline" className="text-xs">MIT</Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          {priorities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhuma prioridade definida para hoje.</p>
          ) : (
            priorities.slice(0, 3).map((p: any) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <button onClick={() => handleCompletePriority(p.id)}>
                    {p.completed_at ? <CheckCircle2 className="h-5 w-5 text-success" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                  </button>
                  <div>
                    <p className={cn("font-medium", p.completed_at && "line-through text-muted-foreground")}>{p.obligations?.title || "Tarefa"}</p>
                    {p.obligations?.next_step && <p className="text-xs text-muted-foreground">{p.obligations.next_step}</p>}
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Próximos prazos</CardTitle>
          <Link href="/app/obrigacoes"><Button variant="ghost" size="sm">Ver todas</Button></Link>
        </CardHeader>
        <CardContent className="space-y-2">
          {upcomingDeadlines.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum prazo nos próximos 7 dias.</p>
          ) : (
            upcomingDeadlines.slice(0, 5).map((obligation: any) => (
              <Link key={obligation.id} href={`/app/obrigacoes/${obligation.id}`} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <button onClick={(e) => { e.preventDefault(); handleCompleteObligation(obligation.id); }}><Circle className="h-4 w-4 text-muted-foreground" /></button>
                  <div><p className="font-medium text-sm">{obligation.title}</p></div>
                </div>
                <Badge className={cn("text-xs", getDeadlineColor(obligation.due_date))}>{formatRelativeDate(obligation.due_date)}</Badge>
              </Link>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">O que está ocupando sua cabeça agora?</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Textarea placeholder="Ex: Preciso ver minha CNH, fazer imposto de renda..." value={captureInput} onChange={(e) => setCaptureInput(e.target.value)} className="min-h-[100px] resize-none" />
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleManualCreate} disabled={!captureInput.trim()}><Plus className="mr-2 h-4 w-4" />Criar tarefa manual</Button>
            <Button variant="outline" onClick={handleAICapture} disabled={!captureInput.trim() || captureLoading || !profile?.ai_consent}><Brain className="mr-2 h-4 w-4" />{captureLoading ? "Analisando..." : "Organizar com IA"}</Button>
          </div>
          {!profile?.ai_consent && <p className="text-xs text-muted-foreground">A IA está desativada. <Link href="/app/configuracoes" className="text-brand-purple hover:underline">Ativar nas configurações</Link></p>}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Link href="/app/pensar-depois"><Card className="p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer"><Inbox className="mx-auto h-6 w-6 text-brand-purple" /><p className="mt-2 text-sm font-medium">Pensar depois</p>{worryCount > 0 && <Badge className="mt-1">{worryCount}</Badge>}</Card></Link>
        <Link href="/app/revisao-semanal"><Card className="p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer"><Calendar className="mx-auto h-6 w-6 text-brand-purple" /><p className="mt-2 text-sm font-medium">Revisão semanal</p></Card></Link>
        <Link href="/app/notificacoes"><Card className="p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer"><Bell className="mx-auto h-6 w-6 text-brand-purple" /><p className="mt-2 text-sm font-medium">Notificações</p>{notifications.length > 0 && <Badge className="mt-1">{notifications.length}</Badge>}</Card></Link>
        <Link href="/app/obrigacoes/nova"><Card className="p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer"><Plus className="mx-auto h-6 w-6 text-brand-purple" /><p className="mt-2 text-sm font-medium">Nova obrigação</p></Card></Link>
      </div>
    </div>
  );
}
