import { z } from "zod";

export const CaptureSuggestionSchema = z.object({
  title: z.string().min(3).max(200),
  category: z.enum([
    "documentos", "impostos", "financeiro", "trabalho",
    "casa", "familia", "saude_administrativa", "assinaturas", "outros",
  ]),
  type: z.enum(["single_task", "recurring", "confirm_date", "official_deadline_candidate"]),
  priority: z.enum(["low", "medium", "high"]),
  suggestedDueDate: z.string().nullable(),
  recurrence: z.string().nullable(),
  nextStep: z.string().max(500),
  requiresConfirmation: z.boolean(),
  questions: z.array(z.string()),
  sensitiveDataWarning: z.string().nullable(),
});

export const CaptureAnalysisResultSchema = z.object({
  suggestions: z.array(CaptureSuggestionSchema),
  generalSensitiveWarning: z.string().nullable(),
});

export type CaptureSuggestion = z.infer<typeof CaptureSuggestionSchema>;
export type CaptureAnalysisResult = z.infer<typeof CaptureAnalysisResultSchema>;

export interface SafeUserContext {
  locale: string;
  existingCategories: string[];
  aiConsented: boolean;
  availableTemplates: string[];
  publishedDeadlines: Array<{
    title: string;
    dueDate: string;
    category: string;
  }>;
}

export interface AIProvider {
  analyzeMentalCapture(
    input: string,
    context: SafeUserContext
  ): Promise<CaptureAnalysisResult>;
}
