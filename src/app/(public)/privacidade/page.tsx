import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <Link href="/" className="text-brand-purple hover:underline">&larr; Voltar</Link>
      <h1 className="mt-8 text-3xl font-bold text-brand-deep">Política de Privacidade</h1>
      <p className="mt-2 text-sm text-muted-foreground">Última atualização: 01 de janeiro de 2026</p>
      <div className="mt-8 space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground">1. Introdução</h2>
          <p className="mt-2">O Desocupa é um organizador de obrigações pessoais. Esta política explica como tratamos seus dados. Não somos um serviço médico, jurídico, contábil ou financeiro.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">2. Dados que coletamos</h2>
          <p className="mt-2">Coletamos apenas: nome, e-mail, obrigações e tarefas que você cadastra, preferências de notificação e metadados de uso da IA. Não solicitamos documentos, CPF, RG, dados bancários ou informações clínicas.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">3. Uso de IA</h2>
          <p className="mt-2">A IA é usada apenas para organizar textos em tarefas. Antes do envio, removemos padrões de dados sensíveis. Você precisa ativar explicitamente o uso de IA. Nenhuma decisão automatizada é tomada sem sua revisão.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">4. Seus direitos (LGPD)</h2>
          <p className="mt-2">Você pode exportar seus dados, solicitar exclusão da conta e revogar consentimentos a qualquer momento nas configurações do aplicativo.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">5. Contato</h2>
          <p className="mt-2">Para questões de privacidade: privacidade@desocupa.app</p>
        </section>
      </div>
    </div>
  );
}
