"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Bell, CheckCircle2 } from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    setNotifications((data as any[]) || []);
    setLoading(false);
  };

  const handleMarkRead = async (id: string) => {
    await (supabase.from("notifications") as any).update({ read_at: new Date().toISOString() }).eq("id", id);
    loadNotifications();
  };

  const handleMarkAllRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await (supabase.from("notifications") as any).update({ read_at: new Date().toISOString() }).eq("user_id", user.id).is("read_at", null);
    toast.success("Todas marcadas como lidas");
    loadNotifications();
  };

  if (loading) return <div className="py-8 text-center">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-deep">Notificações</h1>
        <Button variant="outline" size="sm" onClick={handleMarkAllRead}>Marcar todas como lidas</Button>
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Nenhuma notificação</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <Card key={n.id} className={n.read_at ? "opacity-60" : ""}>
              <CardContent className="flex items-start justify-between p-4">
                <div>
                  <p className="font-medium">{n.title}</p>
                  {n.body && <p className="text-sm text-muted-foreground">{n.body}</p>}
                  <p className="mt-1 text-xs text-muted-foreground">{formatRelativeDate(n.created_at)}</p>
                </div>
                {!n.read_at && (
                  <Button variant="ghost" size="sm" onClick={() => handleMarkRead(n.id)}><CheckCircle2 className="h-4 w-4" /></Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
