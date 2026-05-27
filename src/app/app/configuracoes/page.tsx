"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Download, Trash2, Moon, Sun, Monitor } from "lucide-react";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Theme = "light" | "dark" | "system";

const themes: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Escuro", icon: Moon },
  { value: "system", label: "Sistema", icon: Monitor },
];

function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

export default function ConfiguracoesPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [aiConsent, setAiConsent] = useState(false);
  const [theme, setTheme] = useState<Theme>("system");
  const router = useRouter();

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (active) setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!active) return;

      if (error) {
        toast.error("Erro ao carregar configurações.");
        setLoading(false);
        return;
      }

      if (data) {
        setProfile(data);
        setFullName(data.full_name ?? "");
        setAiConsent(data.ai_consent ?? false);
        setTheme(isTheme(data.theme) ? data.theme : "system");
      }

      setLoading(false);
    };

    void loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const handleSave = async () => {
    if (!profile) {
      toast.error("Perfil não encontrado.");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        ai_consent: aiConsent,
        theme,
      })
      .eq("id", profile.id);

    if (error) {
      toast.error("Erro ao salvar");
      return;
    }

    setProfile((current) =>
      current ? { ...current, full_name: fullName, ai_consent: aiConsent, theme } : current
    );
    toast.success("Configurações salvas");
  };

  const handleExport = async () => {
    const response = await fetch("/api/export-data");

    if (!response.ok) {
      toast.error("Erro ao exportar dados");
      return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "desocupa-dados.json";
    anchor.click();
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
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
      return;
    }

    toast.error("Erro ao excluir conta");
  };

  if (loading) return <div className="py-8 text-center">Carregando...</div>;

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold text-brand-deep">Configurações</h1>

      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="full-name">Nome</Label>
            <Input
              id="full-name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
          </div>
          <Button onClick={handleSave}>Salvar</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Aparência</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          {themes.map((option) => (
            <Button
              key={option.value}
              variant={theme === option.value ? "default" : "outline"}
              onClick={() => setTheme(option.value)}
            >
              <option.icon className="mr-2 h-4 w-4" />
              {option.label}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inteligência Artificial</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="ai-consent">Usar IA para organizar tarefas</Label>
              <p className="text-sm text-muted-foreground">
                Permite que textos enviados sejam analisados por IA.
              </p>
            </div>
            <Switch
              id="ai-consent"
              checked={aiConsent}
              onCheckedChange={setAiConsent}
            />
          </div>
          <div className="rounded-lg bg-warning/10 p-4 text-sm text-warning">
            <strong>Aviso:</strong> Não envie senhas, documentos, dados bancários, CPF, RG
            ou informações médicas.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar meus dados (JSON)
          </Button>
          <div className="border-t pt-4">
            <Label htmlFor="delete-confirm" className="text-danger">
              Excluir conta permanentemente
            </Label>
            <p className="mb-2 text-sm text-muted-foreground">
              Esta ação não pode ser desfeita.
            </p>
            <Input
              id="delete-confirm"
              placeholder="Digite EXCLUIR MINHA CONTA"
              value={deleteConfirm}
              onChange={(event) => setDeleteConfirm(event.target.value)}
            />
            <Button
              variant="destructive"
              className="mt-2"
              onClick={handleDeleteAccount}
              disabled={deleteConfirm !== "EXCLUIR MINHA CONTA"}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir minha conta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
