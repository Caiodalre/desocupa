import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const publicPaths = ["/", "/login", "/cadastro", "/recuperar-senha", "/privacidade", "/termos"];
  const adminPaths = ["/admin"];
  const path = request.nextUrl.pathname;

  if (!user && !publicPaths.includes(path) && !path.startsWith("/api/cron")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user && publicPaths.includes(path) && path !== "/") {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  if (user && adminPaths.some((p) => path.startsWith(p))) {
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!roles || roles.role !== "admin") {
      return NextResponse.redirect(new URL("/app", request.url));
    }
  }

  return supabaseResponse;
}
