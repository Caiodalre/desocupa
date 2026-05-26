import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardClient } from "./dashboard-client";
import { getGreeting } from "@/lib/greeting";

export default async function DashboardPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: obligations } = await supabase
    .from("obligations")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("due_date", { ascending: true });

  const todayStr = new Date().toISOString().split("T")[0] ?? "";

  const { data: priorities } = await supabase
    .from("daily_priorities")
    .select("*, obligations(*)")
    .eq("user_id", user.id)
    .eq("priority_date", todayStr)
    .order("position", { ascending: true });

  const in7Days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] ?? "";

  const { data: upcomingDeadlines } = await supabase
    .from("obligations")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .not("due_date", "is", null)
    .gte("due_date", todayStr)
    .lte("due_date", in7Days)
    .order("due_date", { ascending: true });

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .is("read_at", null)
    .order("created_at", { ascending: false })
    .limit(10);

  const { count: worryCount } = await supabase
    .from("worry_entries")
    .select("id", { count: "exact" })
    .eq("user_id", user.id)
    .eq("status", "inbox");

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*, plans(*)")
    .eq("user_id", user.id)
    .single();

  const greeting = getGreeting((profile as any)?.full_name || user.email?.split("@")[0] || "usuário");

  const safeObligations: any[] = obligations ? (obligations as any[]) : [];
  const safePriorities: any[] = priorities ? (priorities as any[]) : [];
  const safeUpcoming: any[] = upcomingDeadlines ? (upcomingDeadlines as any[]) : [];
  const safeNotifications: any[] = notifications ? (notifications as any[]) : [];

  return (
    <DashboardClient
      user={user}
      profile={profile as any}
      obligations={safeObligations}
      priorities={safePriorities}
      upcomingDeadlines={safeUpcoming}
      notifications={safeNotifications}
      worryCount={worryCount || 0}
      subscription={subscription as any}
      greeting={greeting}
    />
  );
}
