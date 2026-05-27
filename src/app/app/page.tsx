import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardClient } from "./dashboard-client";
import { getGreeting } from "@/lib/greeting";
import type { DashboardInitialData, Priority, Subscription, Profile } from "@/features/dashboard/types";

export default async function DashboardPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const todayStr: string = new Date().toISOString().split("T")[0] || "";
  const in7Days: string = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] || "";

  // Fetch all required data in parallel
  const [
    { data: profile },
    { data: obligations },
    { data: priorities },
    { data: upcomingDeadlines },
    { data: notifications },
    { count: worryCount },
    { data: subscription },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("obligations").select("*").eq("user_id", user.id).eq("status", "active").order("due_date", { ascending: true }),
    supabase.from("daily_priorities").select("*, obligations(*)").eq("user_id", user.id).eq("priority_date", todayStr).order("position", { ascending: true }),
    supabase.from("obligations").select("*").eq("user_id", user.id).eq("status", "active").not("due_date", "is", null).gte("due_date", todayStr).lte("due_date", in7Days).order("due_date", { ascending: true }),
    supabase.from("notifications").select("*").eq("user_id", user.id).is("read_at", null).order("created_at", { ascending: false }).limit(10),
    supabase.from("worry_entries").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "inbox"),
    supabase.from("subscriptions").select("*, plans(*)").eq("user_id", user.id).single(),
  ]);

  const profileData = profile as Profile | null;
  const greeting = getGreeting(profileData?.full_name || user.email?.split("@")[0] || "usuário");

  const initialData: DashboardInitialData = {
    profile: profile || null,
    obligations: obligations || [],
    priorities: (priorities as unknown as Priority[]) || [],
    upcomingDeadlines: upcomingDeadlines || [],
    notifications: notifications || [],
    worryCount: worryCount || 0,
    subscription: (subscription as unknown as Subscription) || null,
    greeting,
  };

  return (
    <DashboardClient
      user={{ id: user.id, email: user.email }}
      {...initialData}
    />
  );
}
