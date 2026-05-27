"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Brain, Save, ArrowLeft, AlertTriangle, Calendar, Plus } from "lucide-react";

interface Suggestion {
  title: string;
  category: string;
  type: string;
  priority: "low" | "medium" | "high";
  suggestedDueDate: string | null;
  recurrence: string | null;
  nextStep: string;
  requiresConfirmation: boolean;
  questions: string[];
  sensitiveDataWarning: string | null;
}

export default function CapturaPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [generalWarning, setGeneralWarning] = useState<string | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [manualTitle, setManualTitle] = useState("");
  const manualCategory = "outros";
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const data = sessionStorage.getItem("captureSuggestions");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setSuggestions(parsed.suggestions || []);
        setGeneralWarning(parsed.generalSensitiveWarning || null);
        if (parsed.suggestions?.length > 0) {
          setSelected(parsed.suggestions.map((_: Suggestion, i: number) => i));
        }
      } catch {
        toast.error("Erro ao carregar sugestÃƒÆ’Ã‚Âµes. Tente novamente.");
        router.push("/app");
      }
    } else {
      router.push("/app");
    }
  }, [router]);

  const toggleSelect = (index: number) => {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const toSave = suggestions.filter((_, i) => selected.includes(i));
    let saved = 0;

    for (const s of toSave) {
      const { error } = await supabase.from("obligations").insert({
        user_id: user.id,
        title: s.title,
        category_slug: s.category,
        due_date: s.suggestedDueDate,
        recurrence_type: s.type === "recurring" ? "monthly" : "none",
        priority: s.priority,
        status: "active",
        source_type: "ai",
        next_step: s.nextStep,
        expected_confirmation_required: s.requiresConfirmation,
      });
      if (!error) saved++;
    }

    sessionStorage.removeItem("captureSuggestions");
    toast.success(`${saved} obrigaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes salvas com sucesso!`);
    router.push("/app/obrigacoes");
    setSaving(false);
  };

  const handleManualCreate = async () => {
    if (!manualTitle.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    await supabase.from("obligations").insert({
      user_id: user.id,
      title: manualTitle.trim(),
      category_slug: manualCategory,
      priority: "medium",
      status: "active",
      source_type: "manual",
    });
    toast.success("ObrigaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o criada manualmente!");
    router.push("/app/obrigacoes");
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/app")}><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-2xl font-bold text-brand-deep">Revisar sugestÃƒÆ’Ã‚Âµes</h1>
      </div>

      {generalWarning && (
        <div className="rounded-lg border border-warning/30 bg-warning/5 p-4 text-sm flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
          <p className="text-muted-foreground">{generalWarning}</p>
        </div>
      )}

      <p className="text-muted-foreground">Selecione as tarefas que deseja salvar. VocÃƒÆ’Ã‚Âª pode editÃƒÆ’Ã‚Â¡-las depois.</p>

      {suggestions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Brain className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Nenhuma sugestÃƒÆ’Ã‚Â£o. Crie uma tarefa manualmente.</p>
            <div className="mt-4 flex gap-2 justify-center">
              <Input placeholder="TÃƒÆ’Ã‚Â­tulo da tarefa" value={manualTitle} onChange={(e) => setManualTitle(e.target.value)} className="max-w-xs" />
              <Button onClick={handleManualCreate} disabled={!manualTitle.trim()}><Plus className="mr-2 h-4 w-4" />Criar</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {suggestions.map((s, i) => (
              <Card key={i} className={selected.includes(i) ? "border-brand-purple" : ""}>
                <CardContent className="flex items-start gap-3 p-4">
                  <Checkbox checked={selected.includes(i)} onCheckedChange={() => toggleSelect(i)} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium">{s.title}</p>
                      <Badge variant="outline" className="text-xs">{s.category}</Badge>
                      <Badge className={cn("text-xs", s.priority === "high" ? "bg-danger/10 text-danger" : s.priority === "medium" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground")}>{s.priority === "high" ? "Alta" : s.priority === "medium" ? "MÃƒÆ’Ã‚Â©dia" : "Baixa"}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{s.nextStep}</p>
                    {s.suggestedDueDate && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="h-3 w-3" />SugestÃƒÆ’Ã‚Â£o: {new Date(s.suggestedDueDate).toLocaleDateString("pt-BR")}</div>
                    )}
                    {s.questions.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium">Perguntas para confirmar:</p>
                        <ul className="list-disc list-inside text-xs text-muted-foreground">
                          {s.questions.map((q, j) => <li key={j}>{q}</li>)}
                        </ul>
                      </div>
                    )}
                    {s.sensitiveDataWarning && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-warning"><AlertTriangle className="h-3 w-3" />{s.sensitiveDataWarning}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving || selected.length === 0}><Save className="mr-2 h-4 w-4" />Salvar selecionadas ({selected.length})</Button>
            <Button variant="outline" onClick={() => { sessionStorage.removeItem("captureSuggestions"); router.push("/app"); }}>Cancelar</Button>
          </div>
        </>
      )}
    </div>
  );
}
