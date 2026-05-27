import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { MobileNav } from "@/components/mobile-nav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [
    { data: profile },
    { count: notificationCount },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .is("read_at", null),
  ]);

  const safeCount = notificationCount || 0;

  return (
    <div className="flex min-h-screen">
      <AppSidebar user={user} profile={profile} notificationCount={safeCount} />
      <main className="flex-1 overflow-auto bg-background p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          {children}
        </div>
      </main>
      <MobileNav notificationCount={safeCount} />
    </div>
  );
}
