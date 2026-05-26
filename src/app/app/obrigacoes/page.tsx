import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ObligationsClient } from "./obligations-client";

export default async function ObligationsPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: obligations } = await supabase
    .from("obligations")
    .select("*")
    .eq("user_id", user.id)
    .order("due_date", { ascending: true });

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return (
    <ObligationsClient
      obligations={obligations || []}
      categories={categories || []}
    />
  );
}
