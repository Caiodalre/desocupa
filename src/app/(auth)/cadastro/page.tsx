"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Eye, EyeOff, UserPlus } from "lucide-react";

const cadastroSchema = z.object({
  fullName: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
  acceptedTerms: z.boolean().refine((val) => val === true, "Você precisa aceitar os termos"),
});

type CadastroForm = z.infer<typeof cadastroSchema>;

export default function CadastroPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CadastroForm>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: { acceptedTerms: false },
  });

  const acceptedTerms = watch("acceptedTerms");

  const onSubmit = async (data: CadastroForm) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { full_name: data.fullName },
        },
      });

      if (error) throw error;

      toast.success("Conta criada com sucesso!");
      router.push("/app");
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-purple-soft/20 to-white px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="text-2xl font-bold text-brand-deep">Desocupa</Link>
          <CardTitle className="mt-4">Criar conta gratuita</CardTitle>
          <CardDescription>Comece a organizar sua vida administrativa hoje.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Nome completo</Label>
              <Input id="fullName" placeholder="Seu nome" {...register("fullName")} />
              {errors.fullName && <p className="mt-1 text-sm text-danger">{errors.fullName.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="seu@email.com" {...register("email")} />
              {errors.email && <p className="mt-1 text-sm text-danger">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Mínimo 8 caracteres" {...register("password")} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-danger">{errors.password.message}</p>}
            </div>
            <div className="flex items-start gap-2">
              <Checkbox id="acceptedTerms" checked={acceptedTerms} onCheckedChange={(checked) => setValue("acceptedTerms", checked === true, { shouldValidate: true })} />
              <Label htmlFor="acceptedTerms" className="text-sm leading-relaxed">
                Eu li e aceito os <Link href="/termos" className="text-brand-purple hover:underline">Termos de Uso</Link> e a <Link href="/privacidade" className="text-brand-purple hover:underline">Política de Privacidade</Link>
              </Label>
            </div>
            {errors.acceptedTerms && <p className="text-sm text-danger">{errors.acceptedTerms.message}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Criando conta..." : "Criar conta"}
              <UserPlus className="ml-2 h-4 w-4" />
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Já tem conta? <Link href="/login" className="text-brand-purple hover:underline font-semibold">Entrar</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
