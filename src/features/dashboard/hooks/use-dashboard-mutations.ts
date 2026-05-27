"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Priority, Obligation } from "../types";

export function useDashboardMutations() {
  const router = useRouter();
  const supabase = createClient();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const completePriority = async (priority: Priority) => {
    if (isProcessing) return;
    
    setIsProcessing(priority.id);
    const now = new Date().toISOString();

    try {
      // Optimistic update logic would be handled by the parent state if we had one,
      // but since we rely on router.refresh(), we'll just handle the execution and feedback here.
      const { error } = await supabase
        .from("daily_priorities")
        .update({ completed_at: now })
        .eq("id", priority.id);

      if (error) throw error;

      toast.success("Prioridade concluída!");
      router.refresh();
    } catch (error) {
      console.error("Erro ao concluir prioridade:", error);
      toast.error("Erro ao concluir prioridade. Tente novamente.");
    } finally {
      setIsProcessing(null);
    }
  };

  const completeObligation = async (obligation: Obligation) => {
    if (isProcessing) return;

    setIsProcessing(obligation.id);
    const now = new Date().toISOString();

    try {
      const { error } = await supabase
        .from("obligations")
        .update({ status: "completed", completed_at: now })
        .eq("id", obligation.id);

      if (error) throw error;

      toast.success("Obrigação concluída!");
      router.refresh();
    } catch (error) {
      console.error("Erro ao concluir obrigação:", error);
      toast.error("Erro ao concluir obrigação. Tente novamente.");
    } finally {
      setIsProcessing(null);
    }
  };

  return {
    completePriority,
    completeObligation,
    isProcessing,
  };
}
