import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <Link href="/" className="text-brand-purple hover:underline">&larr; Voltar</Link>
      <h1 className="mt-8 text-3xl font-bold text-brand-deep">Termos de Uso</h1>
      <p className="mt-2 text-sm text-muted-foreground">Última atualização: 01 de janeiro de 2026</p>
      <div className="mt-8 space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground">1. O que é o Desocupa</h2>
          <p className="mt-2">O Desocupa é um organizador de obrigações pessoais e administrativas. Não oferecemos aconselhamento médico, jurídico, contábil, tributário ou financeiro. Nossas sugestões são baseadas em boas práticas de organização, não em obrigações legais.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">2. Uso do aplicativo</h2>
          <p className="mt-2">Você é responsável pelas informações que cadastra. Não envie documentos completos, senhas, dados bancários ou informações clínicas detalhadas. O aplicativo é uma ferramenta de apoio, não substitui profissionais especializados.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">3. Planos e cobrança</h2>
          <p className="mt-2">Atualmente o Desocupa está em fase de testes. Os planos pagos serão implementados futuramente e você será notificado antes de qualquer cobrança.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">4. Limitação de responsabilidade</h2>
          <p className="mt-2">O Desocupa não se responsabiliza por prazos perdidos ou decisões tomadas com base nas informações do aplicativo. Sempre verifique prazos oficiais nas fontes competentes.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">5. Contato</h2>
          <p className="mt-2">Dúvidas sobre os termos: contato@desocupa.app</p>
        </section>
      </div>
    </div>
  );
}
