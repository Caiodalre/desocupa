"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Profile } from "../types";

export function useQuickCapture(profile: Profile | null) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleManualCreate = () => {
    if (!input.trim()) return;
    const encodedTitle = encodeURIComponent(input.trim());
    router.push(`/app/obrigacoes/nova?title=${encodedTitle}`);
  };

  const handleAICapture = async () => {
    if (!input.trim()) return;
    
    if (!profile?.ai_consent) {
      toast.error("Você precisa ativar o uso de IA nas configurações.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/analyze-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Erro na análise da IA");
      }

      const result = await response.json();
      sessionStorage.setItem("captureSuggestions", JSON.stringify(result));
      
      setInput(""); // Clear after success
      router.push("/app/captura");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      toast.error(message);
      console.error("AI Capture Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    input,
    setInput,
    isLoading,
    handleManualCreate,
    handleAICapture,
    charCount: input.length,
    maxChars: 1500,
  };
}
