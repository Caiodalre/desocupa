import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, locale = "pt-BR"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale, { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatRelativeDate(date: Date | string, locale = "pt-BR"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffTime = d.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `Vencido há ${Math.abs(diffDays)} dias`;
  if (diffDays === 0) return "Vence hoje";
  if (diffDays === 1) return "Vence amanhã";
  if (diffDays <= 3) return `Vence em ${diffDays} dias`;
  if (diffDays <= 7) return `Vence em ${diffDays} dias`;
  return formatDate(d, locale);
}

export function getDeadlineColor(dueDate: Date | string): string {
  const d = typeof dueDate === "string" ? new Date(dueDate) : dueDate;
  const now = new Date();
  const diffTime = d.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0 || diffDays === 0) return "text-danger bg-danger/10";
  if (diffDays <= 3) return "text-warning bg-warning/10";
  if (diffDays <= 7) return "text-brand-purple bg-brand-purple-soft";
  return "text-muted-foreground";
}

export function sanitizeUserInput(input: string): string {
  return input
    .slice(0, 1500)
    .replace(/\d{3}\.?\d{3}\.?\d{3}-?\d{2}/g, "[CPF_REMOVIDO]")
    .replace(/\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}/g, "[CARTAO_REMOVIDO]");
}
