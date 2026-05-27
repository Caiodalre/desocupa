import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const supabase = await createServerSupabaseAdmin();
    const today = new Date();
    const in7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const { data: obligations, error: obligationsError } = await supabase
      .from("obligations")
      .select("id, user_id, title, due_date")
      .eq("status", "active")
      .not("due_date", "is", null)
      .lte("due_date", in7Days);

    if (obligationsError) throw obligationsError;

    const obligationsToNotify = obligations ?? [];

    if (obligationsToNotify.length === 0) {
      return NextResponse.json({ message: "Nenhum lembrete necessário", generated: 0 });
    }

    let generated = 0;
    const todayStr = today.toISOString().split("T")[0];

    for (const obligation of obligationsToNotify) {
      if (!obligation.due_date) continue;

      const { data: existing, error: existingError } = await supabase
        .from("notifications")
        .select("id")
        .eq("user_id", obligation.user_id)
        .eq("related_obligation_id", obligation.id)
        .gte("created_at", todayStr)
        .limit(1);

      if (existingError) throw existingError;
      if ((existing ?? []).length > 0) continue;

      const dueDate = new Date(obligation.due_date);
      const diffDays = Math.ceil(
        (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      let urgency: string;

      if (diffDays <= 0) {
        urgency = "Vence hoje!";
      } else if (diffDays === 1) {
        urgency = "Vence amanhã";
      } else {
        urgency = `Vence em ${diffDays} dias`;
      }

      const { error: notificationError } = await supabase.from("notifications").insert({
        user_id: obligation.user_id,
        title: obligation.title,
        body: `${urgency}. Toque para ver os detalhes.`,
        type: "deadline_alert",
        related_obligation_id: obligation.id,
      });

      if (notificationError) throw notificationError;

      generated++;
    }

    return NextResponse.json({ message: "Lembretes gerados", generated });
  } catch (error: unknown) {
    console.error("Erro no cron:", error);

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Erro ao gerar lembretes." },
      { status: 500 }
    );
  }
}
