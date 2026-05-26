import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CheckCircle, ArrowRight, Shield, Brain, Bell, Calendar, Heart, Home, Wallet, FileText,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="container mx-auto flex items-center justify-between px-4 py-6">
        <Link href="/" className="text-2xl font-bold text-brand-purple">Desocupa</Link>
        <nav className="hidden items-center gap-6 sm:flex">
          <Link href="#como-funciona" className="text-sm text-gray-600 hover:text-gray-900">Como funciona</Link>
          <Link href="#planos" className="text-sm text-gray-600 hover:text-gray-900">Planos</Link>
          <Link href="/privacidade" className="text-sm text-gray-600 hover:text-gray-900">Privacidade</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login"><Button variant="ghost" size="sm" className="text-gray-700 hover:text-brand-purple">Entrar</Button></Link>
          <Link href="/cadastro"><Button size="sm" className="bg-brand-orange text-white hover:bg-brand-orange/90 shadow-md">Começar</Button></Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 pb-20 pt-16 text-center bg-gradient-to-br from-brand-purple-light to-white rounded-2xl my-8">
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          Tire as pendências da cabeça.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl">
          Organize obrigações, acompanhe prazos e saiba exatamente qual é o próximo passo.
          Sem estresse, sem esquecimentos.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/cadastro">
            <Button size="lg" className="bg-brand-orange text-white px-8 text-lg hover:bg-brand-orange/90 shadow-md">
              Começar gratuitamente <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="#como-funciona">
            <Button variant="outline" size="lg" className="px-8 text-lg border-brand-purple/30 text-gray-800 hover:bg-brand-purple-light">
              Ver como funciona
            </Button>
          </Link>
        </div>
        <p className="mt-4 text-sm text-gray-500">Sem cobrança. Até 5 obrigações gratuitas para sempre.</p>
      </section>

      {/* Problema */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold text-gray-900">Sua mente não foi feita para ser agenda.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600">
            Prazos de documentos, contas para pagar, obrigações recorrentes e pequenas tarefas
            administrativas ocupam um espaço mental que deveria ser livre.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: FileText, title: "Documentos", desc: "CNH, RG, passaporte e outros documentos com vencimento." },
              { icon: Wallet, title: "Financeiro", desc: "Contas, faturas, aluguel e recebimentos mensais." },
              { icon: Calendar, title: "Impostos", desc: "IR, IPVA, licenciamento e obrigações anuais." },
              { icon: Home, title: "Casa", desc: "Aluguel, contas de consumo e manutenções." },
              { icon: Heart, title: "Família", desc: "Compromissos e obrigações familiares." },
              { icon: Brain, title: "Sobrecarga", desc: "Aquilo que fica ocupando espaço na cabeça." },
            ].map((item) => (
              <Card key={item.title} className="flex flex-col items-center p-6 text-center bg-white border-gray-100">
                <item.icon className="h-10 w-10 text-brand-purple" />
                <h3 className="mt-4 font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold text-gray-900">Três passos para organizar sua vida administrativa.</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              { step: 1, title: "Conte o que ocupa sua cabeça", desc: "Escreva ou fale o que está te preocupando. Nossa IA organiza em tarefas claras." },
              { step: 2, title: "O app organiza e cria lembretes", desc: "Categorizamos, definimos prazos e criamos próximos passos acionáveis." },
              { step: 3, title: "Receba o próximo passo na hora certa", desc: "Notificações e lembretes no momento exato, sem sobrecarga." },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-purple-light">
                  <span className="text-2xl font-bold text-brand-purple">{item.step}</span>
                </div>
                <h3 className="mt-6 font-semibold text-lg text-gray-900">{item.title}</h3>
                <p className="mt-2 text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Segurança */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <Shield className="mx-auto h-16 w-16 text-brand-purple" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Seus dados são tratados com privacidade desde o início.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Criptografia, Row Level Security, consentimento explícito para IA e controle total sobre seus dados.
            Em conformidade com a LGPD.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/privacidade"><Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-100">Política de Privacidade</Button></Link>
            <Link href="/termos"><Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-100">Termos de Uso</Button></Link>
          </div>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold text-gray-900">Planos</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <Card className="flex flex-col p-8 bg-white border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Gratuito</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">R$ 0</p>
              <ul className="mt-6 space-y-3 text-sm text-gray-700">
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Até 5 obrigações</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Captura manual</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> 3 análises IA/mês</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Revisão semanal</li>
              </ul>
              <Link href="/cadastro" className="mt-8"><Button className="w-full bg-brand-orange text-white hover:bg-brand-orange/90">Começar</Button></Link>
            </Card>
            <Card className="flex flex-col border-2 border-brand-purple p-8 relative bg-white">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-purple px-4 py-1 text-xs font-semibold text-white">Recomendado</span>
              <h3 className="text-xl font-bold text-gray-900">Essencial</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">R$ 24,90<span className="text-sm font-normal text-gray-500">/mês</span></p>
              <ul className="mt-6 space-y-3 text-sm text-gray-700">
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Obrigações ilimitadas</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> IA ilimitada</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Modelos brasileiros</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Notificações</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Revisão semanal completa</li>
              </ul>
              <Button className="mt-8 w-full bg-brand-purple text-white hover:bg-brand-purple/90" disabled>Em breve</Button>
            </Card>
            <Card className="flex flex-col p-8 bg-white border-gray-200 opacity-70">
              <h3 className="text-xl font-bold text-gray-900">Completo</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">R$ 39,90<span className="text-sm font-normal text-gray-500">/mês</span></p>
              <ul className="mt-6 space-y-3 text-sm text-gray-700">
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Tudo do Essencial</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Calendário externo</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Compartilhamento</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Módulos avançados</li>
              </ul>
              <p className="mt-8 text-center text-sm text-gray-500">Em breve</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-12">
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 sm:flex-row">
          <p className="text-sm text-gray-600">© 2026 Desocupa. Todos os direitos reservados.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacidade" className="text-gray-600 hover:text-gray-900">Privacidade</Link>
            <Link href="/termos" className="text-gray-600 hover:text-gray-900">Termos</Link>
            <Link href="mailto:contato@desocupa.app" className="text-gray-600 hover:text-gray-900">Contato</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
