"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function RevisaoSemanalPage() {
  const [step, setStep] = useState(0);
  const [obligations, setObligations] = useState<any[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [newTasks, setNewTasks] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadObligations();
  }, []);

  const loadObligations = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("obligations")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("due_date", { ascending: true });

    setObligations((data as any[]) || []);
  };

  const questions = [
    "O que você concluiu nesta semana?",
    "Alguma obrigação venceu ou ficou parada?",
    "Há algo novo ocupando sua cabeça?",
    "Quais as 3 tarefas mais importantes para a próxima semana?",
    "Há algo que pode ser arquivado ou removido?",
  ];

  const handleComplete = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    await (supabase.from("weekly_reviews") as any).insert({
      user_id: user.id,
      week_start: weekStart.toISOString().split("T")[0],
      notes,
    });

    toast.success("Revisão semanal concluída!");
    router.push("/app");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-deep">Revisão semanal</h1>
      <p className="text-muted-foreground">Reserve alguns minutos para organizar sua semana.</p>

      <div className="flex gap-2">
        {questions.map((_, i) => (
          <div key={i} className={`h-2 flex-1 rounded-full ${i <= step ? "bg-brand-purple" : "bg-muted"}`} />
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>{questions[step]}</CardTitle></CardHeader>
        <CardContent>
          {step === 0 && (
            <div className="space-y-2">
              {obligations.slice(0, 10).map((o) => (
                <div key={o.id} className="flex items-center gap-2">
                  <Checkbox checked={completedIds.includes(o.id)} onCheckedChange={(checked) => {
                    if (checked) setCompletedIds([...completedIds, o.id]);
                    else setCompletedIds(completedIds.filter((id) => id !== o.id));
                  }} />
                  <span className="text-sm">{o.title}</span>
                </div>
              ))}
            </div>
          )}
          {step === 1 && (
            <div className="space-y-2">
              {obligations.filter((o) => o.due_date && new Date(o.due_date) < new Date()).map((o) => (
                <div key={o.id} className="rounded border p-2 text-sm">{o.title} — Vencia em {formatDate(o.due_date!)}</div>
              ))}
              {obligations.filter((o) => o.due_date && new Date(o.due_date) < new Date()).length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhuma obrigação vencida!</p>
              )}
            </div>
          )}
          {step === 2 && (
            <Textarea placeholder="Trabalho, casa, financeiro, documentos, família..." value={newTasks} onChange={(e) => setNewTasks(e.target.value)} className="min-h-[100px]" />
          )}
          {step === 3 && (
            <Textarea placeholder="Liste as 3 tarefas mais importantes..." value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-[100px]" />
          )}
          {step === 4 && (
            <div className="space-y-2">
              {obligations.map((o) => (
                <div key={o.id} className="flex items-center gap-2"><Checkbox /><span className="text-sm">{o.title}</span></div>
              ))}
            </div>
          )}

          <div className="mt-6 flex gap-2">
            {step > 0 && <Button variant="outline" onClick={() => setStep(step - 1)}>Voltar</Button>}
            {step < 4 ? <Button onClick={() => setStep(step + 1)}>Próximo</Button> : <Button onClick={handleComplete}><CheckCircle2 className="mr-2 h-4 w-4" />Concluir revisão</Button>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
