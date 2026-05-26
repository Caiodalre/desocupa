"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Inbox, Archive, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function PensarDepoisPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [newText, setNewText] = useState("");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("worry_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setEntries((data as any[]) || []);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!newText.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await (supabase.from("worry_entries") as any).insert({ user_id: user.id, text: newText.trim() });

    if (error) {
      toast.error("Erro ao salvar");
    } else {
      toast.success("Registrado. Você pode processar isso depois.");
      setNewText("");
      loadEntries();
    }
  };

  const handleArchive = async (id: string) => {
    const { error } = await (supabase.from("worry_entries") as any).update({ status: "archived", archived_at: new Date().toISOString() }).eq("id", id);

    if (!error) {
      toast.success("Arquivado");
      loadEntries();
    }
  };

  if (loading) return <div className="py-8 text-center">Carregando...</div>;

  const inboxEntries = entries.filter((e) => e.status === "inbox");
  const archivedEntries = entries.filter((e) => e.status === "archived");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-deep">Pensar depois</h1>
      <p className="text-muted-foreground">Registre o que está ocupando sua cabeça. Você não precisa resolver tudo agora.</p>

      <div className="rounded-lg border border-warning/30 bg-warning/5 p-4 text-sm">
        <p className="font-medium text-warning">Importante</p>
        <p className="mt-1 text-muted-foreground">Este espaço é para organizar preocupações cotidianas. Se você estiver passando por sofrimento intenso ou tiver pensamentos de risco imediato, procure apoio profissional ou uma pessoa de confiança. O Desocupa não oferece aconselhamento terapêutico.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>O que está ocupando sua cabeça?</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Textarea placeholder="Escreva aqui o que está te preocupando..." value={newText} onChange={(e) => setNewText(e.target.value)} className="min-h-[100px]" />
          <Button onClick={handleAdd} disabled={!newText.trim()}>
            <Inbox className="mr-2 h-4 w-4" /> Registrar para pensar depois
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Inbox className="h-5 w-5" /> Pendentes ({inboxEntries.length})</CardTitle></CardHeader>
        <CardContent>
          {inboxEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Nada pendente. Sua cabeça está leve!</p>
          ) : (
            <div className="space-y-3">
              {inboxEntries.map((entry) => (
                <div key={entry.id} className="rounded-lg border p-4">
                  <p className="text-sm">{entry.text}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{formatDate(entry.created_at)}</span>
                    <Button variant="ghost" size="sm" onClick={() => handleArchive(entry.id)}><Archive className="mr-1 h-3 w-3" />Arquivar</Button>
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
