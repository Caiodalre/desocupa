"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Download, Trash2, Moon, Sun, Monitor } from "lucide-react";

export default function ConfiguracoesPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [aiConsent, setAiConsent] = useState(false);
  const [theme, setTheme] = useState("system");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    const d = data as any;
    if (d) {
      setProfile(d);
      setFullName(d.full_name || "");
      setAiConsent(d.ai_consent || false);
      setTheme(d.theme || "system");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    const { error } = await (supabase.from("profiles") as any).update({ full_name: fullName, ai_consent: aiConsent, theme }).eq("id", profile.id);
    if (error) toast.error("Erro ao salvar");
    else toast.success("Configurações salvas");
  };

  const handleExport = async () => {
    const response = await fetch("/api/export-data");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "desocupa-dados.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Dados exportados");
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "EXCLUIR MINHA CONTA") {
      toast.error("Digite EXCLUIR MINHA CONTA para confirmar");
      return;
    }
    const response = await fetch("/api/delete-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirmation: deleteConfirm }),
    });
    if (response.ok) {
      toast.success("Conta excluída");
      await supabase.auth.signOut();
      router.push("/");
    } else {
      toast.error("Erro ao excluir conta");
    }
  };

  if (loading) return <div className="py-8 text-center">Carregando...</div>;

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold text-brand-deep">Configurações</h1>

      <Card>
        <CardHeader><CardTitle>Perfil</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Nome</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
          <Button onClick={handleSave}>Salvar</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Aparência</CardTitle></CardHeader>
        <CardContent className="flex gap-4">
          {[
            { value: "light", label: "Claro", icon: Sun },
            { value: "dark", label: "Escuro", icon: Moon },
            { value: "system", label: "Sistema", icon: Monitor },
          ].map((opt) => (
            <Button key={opt.value} variant={theme === opt.value ? "default" : "outline"} onClick={() => setTheme(opt.value)}>
              <opt.icon className="mr-2 h-4 w-4" />{opt.label}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Inteligência Artificial</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Usar IA para organizar tarefas</Label>
              <p className="text-sm text-muted-foreground">Permite que textos enviados sejam analisados por IA.</p>
            </div>
            <Switch checked={aiConsent} onCheckedChange={setAiConsent} />
          </div>
          <div className="rounded-lg bg-warning/10 p-4 text-sm text-warning">
            <strong>Aviso:</strong> Não envie senhas, documentos, dados bancários, CPF, RG ou informações médicas.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Dados</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4" />Exportar meus dados (JSON)</Button>
          <div className="border-t pt-4">
            <Label className="text-danger">Excluir conta permanentemente</Label>
            <p className="text-sm text-muted-foreground mb-2">Esta ação não pode ser desfeita.</p>
            <Input placeholder="Digite EXCLUIR MINHA CONTA" value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} />
            <Button variant="destructive" className="mt-2" onClick={handleDeleteAccount} disabled={deleteConfirm !== "EXCLUIR MINHA CONTA"}>
              <Trash2 className="mr-2 h-4 w-4" />Excluir minha conta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
