"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Database } from "@/types/database";

type Obligation = Database["public"]["Tables"]["obligations"]["Row"];

const questions = [
  "O que você concluiu nesta semana?",
  "Alguma obrigação venceu ou ficou parada?",
  "Há algo novo ocupando sua cabeça?",
  "Quais as 3 tarefas mais importantes para a próxima semana?",
  "Há algo que pode ser arquivado ou removido?",
];

export default function RevisaoSemanalPage() {
  const [step, setStep] = useState(0);
  const [obligations, setObligations] = useState<Obligation[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [newTasks, setNewTasks] = useState("");
  const router = useRouter();

  const loadObligations = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setObligations([]);
      return;
    }

    const { data, error } = await supabase
      .from("obligations")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("due_date", { ascending: true });

    if (error) {
      toast.error("Erro ao carregar obrigações.");
      return;
    }

    setObligations(data ?? []);
  }, []);

  useEffect(() => {
    void loadObligations();
  }, [loadObligations]);

  const overdueObligations = obligations.filter(
    (obligation) =>
      obligation.due_date !== null && new Date(obligation.due_date) < new Date()
  );

  const handleComplete = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const { error } = await supabase.from("weekly_reviews").insert({
      user_id: user.id,
      week_start: weekStart.toISOString().split("T")[0] ?? "",
      notes,
    });

    if (error) {
      toast.error("Erro ao concluir revisão semanal.");
      return;
    }

    toast.success("Revisão semanal concluída!");
    router.push("/app");
  };

  const toggleCompleted = (id: string, checked: boolean) => {
    setCompletedIds((current) =>
      checked ? [...current, id] : current.filter((currentId) => currentId !== id)
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-deep">Revisão semanal</h1>
      <p className="text-muted-foreground">
        Reserve alguns minutos para organizar sua semana.
      </p>

      <div className="flex gap-2">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`h-2 flex-1 rounded-full ${
              index <= step ? "bg-brand-purple" : "bg-muted"
            }`}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{questions[step]}</CardTitle>
        </CardHeader>
        <CardContent>
          {step === 0 && (
            <div className="space-y-2">
              {obligations.slice(0, 10).map((obligation) => (
                <div key={obligation.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={completedIds.includes(obligation.id)}
                    onCheckedChange={(checked) =>
                      toggleCompleted(obligation.id, checked === true)
                    }
                  />
                  <span className="text-sm">{obligation.title}</span>
                </div>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-2">
              {overdueObligations.map((obligation) => (
                <div key={obligation.id} className="rounded border p-2 text-sm">
                  {obligation.title} — Vencia em{" "}
                  {obligation.due_date ? formatDate(obligation.due_date) : ""}
                </div>
              ))}
              {overdueObligations.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nenhuma obrigação vencida!
                </p>
              )}
            </div>
          )}

          {step === 2 && (
            <Textarea
              placeholder="Trabalho, casa, financeiro, documentos, família..."
              value={newTasks}
              onChange={(event) => setNewTasks(event.target.value)}
              className="min-h-[100px]"
            />
          )}

          {step === 3 && (
            <Textarea
              placeholder="Liste as 3 tarefas mais importantes..."
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="min-h-[100px]"
            />
          )}

          {step === 4 && (
            <div className="space-y-2">
              {obligations.map((obligation) => (
                <div key={obligation.id} className="flex items-center gap-2">
                  <Checkbox />
                  <span className="text-sm">{obligation.title}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex gap-2">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Voltar
              </Button>
            )}
            {step < 4 ? (
              <Button onClick={() => setStep(step + 1)}>Próximo</Button>
            ) : (
              <Button onClick={() => void handleComplete()}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Concluir revisão
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
