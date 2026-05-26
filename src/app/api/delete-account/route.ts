import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseAdmin();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { confirmation } = body;

  if (confirmation !== "EXCLUIR MINHA CONTA") {
    return NextResponse.json(
      { message: "Confirmação textual necessária. Digite EXCLUIR MINHA CONTA." },
      { status: 400 }
    );
  }

  const { error } = await supabase.auth.admin.deleteUser(user.id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Conta excluída com sucesso" });
}
