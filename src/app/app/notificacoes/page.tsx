"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Bell, CheckCircle2 } from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";
import type { Database } from "@/types/database";

type Notification = Database["public"]["Tables"]["notifications"]["Row"];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      toast.error("Erro ao carregar notificações.");
      setLoading(false);
      return;
    }

    setNotifications(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  const handleMarkRead = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast.error("Erro ao marcar notificação como lida.");
      return;
    }

    await loadNotifications();
  };

  const handleMarkAllRead = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .is("read_at", null);

    if (error) {
      toast.error("Erro ao marcar notificações como lidas.");
      return;
    }

    toast.success("Todas marcadas como lidas");
    await loadNotifications();
  };

  if (loading) return <div className="py-8 text-center">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-deep">Notificações</h1>
        <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
          Marcar todas como lidas
        </Button>
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
          {notifications.map((notification) => (
            <Card key={notification.id} className={notification.read_at ? "opacity-60" : ""}>
              <CardContent className="flex items-start justify-between p-4">
                <div>
                  <p className="font-medium">{notification.title}</p>
                  {notification.body && (
                    <p className="text-sm text-muted-foreground">{notification.body}</p>
                  )}
                  {notification.created_at && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatRelativeDate(notification.created_at)}
                    </p>
                  )}
                </div>
                {!notification.read_at && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkRead(notification.id)}
                    aria-label={`Marcar ${notification.title} como lida`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}