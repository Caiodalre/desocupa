"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Brain, Plus, Sparkles, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuickCapture } from "../hooks/use-quick-capture";
import type { Profile } from "../types";

interface QuickCaptureCardProps {
  profile: Profile | null;
}

export function QuickCaptureCard({ profile }: QuickCaptureCardProps) {
  const {
    input,
    setInput,
    isLoading,
    handleManualCreate,
    handleAICapture,
    charCount,
    maxChars,
  } = useQuickCapture(profile);

  const hasAiConsent = !!profile?.ai_consent;

  return (
    <Card className="border-brand-purple/20 shadow-sm overflow-hidden bg-gradient-to-br from-card to-brand-purple/[0.02]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand-purple" />
          O que está ocupando sua cabeça agora?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="quick-capture-input" className="sr-only">
            Captura rápida de pendência
          </Label>
          <div className="relative">
            <Textarea
              id="quick-capture-input"
              placeholder="Ex: Preciso ver minha CNH, fazer imposto de renda..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[120px] resize-none border-brand-purple/10 focus-visible:ring-brand-purple"
              maxLength={maxChars}
              aria-describedby="char-count"
            />
            <div
              id="char-count"
              className={cn(
                "absolute bottom-2 right-3 text-[10px] font-medium",
                charCount > maxChars * 0.9 ? "text-danger" : "text-muted-foreground"
              )}
            >
              {charCount}/{maxChars}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleManualCreate}
            disabled={!input.trim() || isLoading}
            className="h-10 px-4 gap-2 bg-brand-deep hover:bg-brand-deep/90 text-white"
          >
            <Plus className="h-4 w-4" />
            Criar tarefa manual
          </Button>

          <Button
            variant="outline"
            onClick={handleAICapture}
            disabled={!input.trim() || isLoading || !hasAiConsent}
            className={cn(
              "h-10 px-4 gap-2 border-brand-purple/20 text-brand-purple hover:bg-brand-purple/5 hover:text-brand-purple",
              isLoading && "animate-pulse"
            )}
            aria-live="polite"
          >
            <Brain className={cn("h-4 w-4", isLoading && "animate-spin")} />
            {isLoading ? "Organizando sua pendência..." : "Organizar com IA"}
          </Button>
        </div>

        {!hasAiConsent ? (
          <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3 text-xs text-warning-foreground border border-warning/20">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>
              A IA está desativada.{" "}
              <Link href="/app/configuracoes" className="font-bold underline hover:opacity-80">
                Ativar nas configurações
              </Link>
            </p>
          </div>
        ) : (
          <p className="text-[10px] text-muted-foreground flex items-center gap-1 italic">
            <AlertCircle className="h-3 w-3" />
            Nenhuma tarefa será salva sem sua confirmação.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
