import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  const exportData = {
    exportedAt: new Date().toISOString(),
    profile: {
      fullName: profile?.full_name ?? null,
      locale: profile?.locale ?? null,
      timezone: profile?.timezone ?? null,
      onboardingCompleted: profile?.onboarding_completed ?? null,
    },
    obligations: obligations ?? [],
    worryEntries: worryEntries ?? [],
    weeklyReviews: reviews ?? [],
  };

  return NextResponse.json(exportData, {
    headers: {
      "Content-Disposition": 'attachment; filename="desocupa-dados.json"',
    },
  });
}
