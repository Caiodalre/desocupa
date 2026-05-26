import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const { data: obligations } = await supabase
    .from("obligations")
    .select("*")
    .eq("user_id", user.id);

  const { data: worryEntries } = await supabase
    .from("worry_entries")
    .select("*")
    .eq("user_id", user.id);

  const { data: reviews } = await supabase
    .from("weekly_reviews")
    .select("*")
    .eq("user_id", user.id);

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const p = profile as any;

  const exportData = {
    exportedAt: new Date().toISOString(),
    profile: {
      fullName: p?.full_name,
      locale: p?.locale,
      timezone: p?.timezone,
      onboardingCompleted: p?.onboarding_completed,
    },
    obligations: obligations as any[],
    worryEntries: worryEntries as any[],
    weeklyReviews: reviews as any[],
  };

  return NextResponse.json(exportData, {
    headers: {
      "Content-Disposition": "attachment; filename=\"desocupa-dados.json\"",
    },
  });
}
