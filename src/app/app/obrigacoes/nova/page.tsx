"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import type { Database } from "@/types/database";

type Priority = Database["public"]["Enums"]["priority_level"];
type Recurrence = Database["public"]["Enums"]["recurrence_type"];

const CATEGORIES = [
  "documentos",
  "impostos",
  "financeiro",
  "trabalho",
  "casa",
  "familia",
  "saude_administrativa",
  "assinaturas",
  "outros",
];

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Média" },
  { value: "high", label: "Alta" },
];

const RECURRENCE_TYPES: { value: Recurrence; label: string }[] = [
  { value: "none", label: "Sem recorrência" },
  { value: "daily", label: "Diária" },
  { value: "weekly", label: "Semanal" },
  { value: "biweekly", label: "Quinzenal" },
  { value: "monthly", label: "Mensal" },
  { value: "annual", label: "Anual" },
];

function isPriority(value: string): value is Priority {
  return PRIORITIES.some((priority) => priority.value === value);
}

function isRecurrence(value: string): value is Recurrence {
  return RECURRENCE_TYPES.some((recurrence) => recurrence.value === value);
}

export default function NovaObrigacaoPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("outros");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [recurrence, setRecurrence] = useState<Recurrence>("none");
  const [nextStep, setNextStep] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      toast.error("Título é obrigatório");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Usuário não autenticado");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("obligations").insert({
      user_id: user.id,
      title: title.trim(),
      description: description.trim() || null,
      category_slug: category,
      due_date: dueDate || null,
      priority,
      recurrence_type: recurrence,
      next_step: nextStep.trim() || null,
      status: "active",
      source_type: "manual",
    });

    if (error) {
      toast.error("Erro ao criar obrigação: " + error.message);
      setLoading(false);
      return;
    }

    toast.success("Obrigação criada com sucesso!");
    router.push("/app/obrigacoes");
    setLoading(false);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-brand-deep">Nova obrigação</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preencha os dados</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Ex: Pagar fatura do cartão"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Detalhes adicionais..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Categoria</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Prioridade</Label>
                <Select
                  value={priority}
                  onValueChange={(value) => {
                    if (isPriority(value)) setPriority(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dueDate">Data de vencimento</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                />
              </div>
              <div>
                <Label>Recorrência</Label>
                <Select
                  value={recurrence}
                  onValueChange={(value) => {
                    if (isRecurrence(value)) setRecurrence(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RECURRENCE_TYPES.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="nextStep">Próximo passo</Label>
              <Input
                id="nextStep"
                value={nextStep}
                onChange={(event) => setNextStep(event.target.value)}
                placeholder="O que fazer agora?"
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Salvando..." : "Salvar obrigação"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
