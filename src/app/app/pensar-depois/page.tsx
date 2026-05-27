"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Inbox, Archive, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Database } from "@/types/database";

type WorryEntry = Database["public"]["Tables"]["worry_entries"]["Row"];

export default function PensarDepoisPage() {
  const [entries, setEntries] = useState<WorryEntry[]>([]);
  const [newText, setNewText] = useState("");
  const [loading, setLoading] = useState(true);

  const loadEntries = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setEntries([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("worry_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar registros.");
      setLoading(false);
      return;
    }

    setEntries(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadEntries();
  }, [loadEntries]);

  const handleAdd = async () => {
    if (!newText.trim()) return;

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("worry_entries").insert({
      user_id: user.id,
      text: newText.trim(),
      status: "inbox",
    });

    if (error) {
      toast.error("Erro ao salvar");
      return;
    }

    toast.success("Registrado. Você pode processar isso depois.");
    setNewText("");
    await loadEntries();
  };

  const handleArchive = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("worry_entries")
      .update({
        status: "archived",
        archived_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      toast.error("Erro ao arquivar.");
      return;
    }

    toast.success("Arquivado");
    await loadEntries();
  };

  if (loading) return <div className="py-8 text-center">Carregando...</div>;

  const inboxEntries = entries.filter((entry) => entry.status === "inbox");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-deep">Pensar depois</h1>
      <p className="text-muted-foreground">
        Registre o que está ocupando sua cabeça. Você não precisa resolver tudo agora.
      </p>

      <div className="rounded-lg border border-warning/30 bg-warning/5 p-4 text-sm">
        <p className="font-medium text-warning">Importante</p>
        <p className="mt-1 text-muted-foreground">
          Este espaço é para organizar preocupações cotidianas. Se você estiver passando
          por sofrimento intenso ou tiver pensamentos de risco imediato, procure apoio
          profissional ou uma pessoa de confiança. O Desocupa não oferece aconselhamento
          terapêutico.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>O que está ocupando sua cabeça?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Escreva aqui o que está te preocupando..."
            value={newText}
            onChange={(event) => setNewText(event.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={() => void handleAdd()} disabled={!newText.trim()}>
            <Inbox className="mr-2 h-4 w-4" />
            Registrar para pensar depois
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Inbox className="h-5 w-5" />
            Pendentes ({inboxEntries.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {inboxEntries.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Nada pendente. Sua cabeça está leve!
            </p>
          ) : (
            <div className="space-y-3">
              {inboxEntries.map((entry) => (
                <div key={entry.id} className="rounded-lg border p-4">
                  <p className="text-sm">{entry.text}</p>
                  <div className="mt-3 flex items-center justify-between">
                    {entry.created_at && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDate(entry.created_at)}
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => void handleArchive(entry.id)}
                    >
                      <Archive className="mr-1 h-3 w-3" />
                      Arquivar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
