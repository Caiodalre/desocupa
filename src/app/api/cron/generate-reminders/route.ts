import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseAdmin } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${"${process.env.CRON_SECRET}"}`) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const supabase = await createServerSupabaseAdmin();
    const today = new Date();
    const in7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const { data: obligations } = await supabase
      .from("obligations")
      .select("id, user_id, title, due_date")
      .eq("status", "active")
      .not("due_date", "is", null)
      .lte("due_date", in7Days);

    const obls = obligations as any[] | null;

    if (!obls || obls.length === 0) {
      return NextResponse.json({ message: "Nenhum lembrete necessário", generated: 0 });
    }

    let generated = 0;
    const todayStr = today.toISOString().split("T")[0];

    for (const obligation of obls) {
      const { data: existing } = await supabase
        .from("notifications")
        .select("id")
        .eq("user_id", obligation.user_id)
        .eq("related_obligation_id", obligation.id)
        .gte("created_at", todayStr)
        .limit(1);

      const exist = existing as any[] | null;

      if (exist && exist.length > 0) continue;

      const dueDate = new Date(obligation.due_date);
      const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      let urgency = "";
      if (diffDays <= 0) urgency = "Vence hoje!";
      else if (diffDays === 1) urgency = "Vence amanhã";
      else if (diffDays <= 3) urgency = `Vence em ${diffDays} dias`;
      else urgency = `Vence em ${diffDays} dias`;

      await supabase.from("notifications").insert({
        user_id: obligation.user_id,
        title: obligation.title,
        body: `${urgency}. Toque para ver os detalhes.`,
        type: "deadline_alert",
        related_obligation_id: obligation.id,
      } as any);

      generated++;
    }

    return NextResponse.json({ message: "Lembretes gerados", generated });
  } catch (error: any) {
    console.error("Erro no cron:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
