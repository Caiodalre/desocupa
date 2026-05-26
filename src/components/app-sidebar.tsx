"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Home, ListTodo, Brain, Calendar, Bell, Settings, LogOut, Inbox } from "lucide-react";

interface AppSidebarProps {
  user: any;
  profile: any;
  notificationCount: number;
}

export function AppSidebar({ user, profile, notificationCount }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Sessão encerrada");
    router.push("/login");
  };

  const links = [
    { href: "/app", label: "Hoje", icon: Home },
    { href: "/app/obrigacoes", label: "Obrigações", icon: ListTodo },
    { href: "/app/captura", label: "Capturar", icon: Brain },
    { href: "/app/pensar-depois", label: "Pensar depois", icon: Inbox },
    { href: "/app/revisao-semanal", label: "Revisão", icon: Calendar },
    { href: "/app/notificacoes", label: "Notificações", icon: Bell, badge: notificationCount },
    { href: "/app/configuracoes", label: "Ajustes", icon: Settings },
  ];

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email?.[0]?.toUpperCase() || "U";

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/app" className="text-xl font-bold text-brand-deep">Desocupa</Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <Button variant={pathname === link.href ? "secondary" : "ghost"} className="w-full justify-start">
              <link.icon className="mr-3 h-5 w-5" />
              {link.label}
              {link.badge && link.badge > 0 && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-danger text-xs text-white">
                  {link.badge}
                </span>
              )}
            </Button>
          </Link>
        ))}
      </nav>
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-brand-purple-soft text-brand-purple">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 truncate">
            <p className="text-sm font-medium">{profile?.full_name || "Usuário"}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        <Button variant="ghost" className="mt-3 w-full justify-start text-muted-foreground" onClick={handleLogout}>
          <LogOut className="mr-3 h-4 w-4" /> Sair
        </Button>
      </div>
    </aside>
  );
}
