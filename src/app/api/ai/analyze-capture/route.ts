import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { getAIProvider, isAIConfigured } from "@/lib/ai";
import { SafeUserContext } from "@/lib/ai/provider";
import { sanitizeUserInput } from "@/lib/utils";
import { z } from "zod";

const requestSchema = z.object({
  input: z.string().min(10).max(1500),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("ai_consent")
      .eq("id", user.id)
      .single();

    const p = profile as { ai_consent: boolean } | null;

    if (!p?.ai_consent) {
      return NextResponse.json(
        { message: "Consentimento de IA não foi dado. Ative nas configurações." },
        { status: 403 }
      );
    }

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*, plans(*)")
      .eq("user_id", user.id)
      .single();

    const sub = subscription as { plans: { max_ai_analyses_per_month: number } } | null;
    const maxAnalyses = sub?.plans?.max_ai_analyses_per_month ?? 0;

    if (maxAnalyses > 0) {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count } = await supabase
        .from("ai_analysis_requests")
        .select("id", { count: "exact" })
        .eq("user_id", user.id)
        .gte("created_at", startOfMonth.toISOString());

      if (count && count >= maxAnalyses) {
        return NextResponse.json(
          { message: `Limite de ${maxAnalyses} análises por mês atingido.` },
          { status: 429 }
        );
      }
    }

    const body = await request.json();
    const { input } = requestSchema.parse(body);
    const sanitizedInput = sanitizeUserInput(input);

    const { data: categories } = await supabase.from("categories").select("slug, name");
    const { data: templates } = await supabase.from("obligation_templates").select("title, category_slug").eq("active", true);
    const { data: deadlines } = await supabase.from("official_deadlines").select("title, due_date, category_slug").eq("status", "published");

    const safeContext: SafeUserContext = {
      locale: "pt-BR",
      existingCategories: (categories as any[])?.map((c: any) => c.slug) || [],
      aiConsented: true,
      availableTemplates: (templates as any[])?.map((t: any) => t.title) || [],
      publishedDeadlines: (deadlines as any[])?.map((d: any) => ({ title: d.title, dueDate: d.due_date, category: d.category_slug || "outros" })) || [],
    };

    if (!isAIConfigured()) {
      return NextResponse.json(
        { message: "IA não configurada. Crie a tarefa manualmente.", suggestions: [] },
        { status: 200 }
      );
    }

    const aiProvider = getAIProvider();
    const result = await aiProvider.analyzeMentalCapture(sanitizedInput, safeContext);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Erro na análise:", error);
    return NextResponse.json(
      { message: error.message || "Erro ao processar. Tente criar a tarefa manualmente." },
      { status: 500 }
    );
  }
}
