Você está trabalhando em um projeto Next.js existente chamado Desocupa, localizado na pasta atual. O MVP já existe e possui funcionalidades funcionando. Sua tarefa é refatorar somente o dashboard e os componentes diretamente relacionados, preservando os fluxos existentes.



IMPORTANTE:

\- Não recrie o projeto do zero.

\- Não remova funcionalidades.

\- Não altere .env.local.

\- Não exiba nem copie chaves privadas.

\- Não altere banco de dados, migrations ou RLS nesta tarefa.

\- Não altere autenticação, cron, admin, landing page ou regras de IA, exceto ajustes mínimos de tipos estritamente necessários para o dashboard.

\- Trabalhe sobre os arquivos reais do repositório, não apenas sobre esta descrição.



==================================================

CONTEXTO DO PRODUTO

==================================================



O Desocupa é um assistente pessoal brasileiro de vida administrativa. Ele reduz carga mental transformando preocupações e obrigações em tarefas organizadas, prazos, lembretes e próximos passos claros.



O dashboard atual contém:

\- saudação personalizada;

\- status rápido com contadores;

\- prioridades do dia, método MIT;

\- próximos prazos;

\- captura rápida manual;

\- captura com IA;

\- links para Pensar Depois, Revisão Semanal, Notificações e Nova Obrigação.



A captura com IA:

\- depende de ai\_consent no perfil;

\- chama /api/ai/analyze-capture;

\- armazena sugestões em sessionStorage;

\- redireciona para /app/captura;

\- nunca salva tarefas automaticamente.



==================================================

SITUAÇÃO ATUAL JÁ IDENTIFICADA

==================================================



Antes desta refatoração, foram executados:



\- pnpm lint: falhou com diversos erros preexistentes;

\- pnpm exec tsc --noEmit: executou sem erros;

\- pnpm build: compila inicialmente, mas falha na etapa de ESLint por erros preexistentes.



Há erros preexistentes fora do dashboard, incluindo autenticação, APIs, notificações, configurações, obrigações, pensar depois, revisão semanal, layout, componentes UI e utilitários Supabase.



Nesta tarefa:

\- corrija os erros dos arquivos do dashboard que você modificar;

\- corrija mobile-nav e app-sidebar somente se necessário para melhorar o dashboard;

\- não amplie automaticamente o escopo para corrigir todos os erros do projeto;

\- ao final, documente quais erros restantes já estavam fora do escopo.



==================================================

ARQUIVOS QUE VOCÊ DEVE INSPECIONAR PRIMEIRO

==================================================



Leia antes de modificar:



\- package.json

\- src/types/database.ts

\- src/app/app/page.tsx

\- src/app/app/dashboard-client.tsx

\- src/app/app/layout.tsx

\- src/components/app-sidebar.tsx

\- src/components/mobile-nav.tsx

\- src/lib/supabase/client.ts

\- src/lib/supabase/server.ts

\- src/lib/utils.ts

\- src/lib/greeting.ts

\- src/app/api/ai/analyze-capture/route.ts

\- src/styles/globals.css

\- tailwind.config.ts



Antes de editar, apresente no terminal um plano curto dos arquivos que pretende criar e modificar.



==================================================

OBJETIVO DA REFATORAÇÃO

==================================================



Refatore o dashboard para entregar:



1\. Componentes separados e organizados.

2\. Tipagem correta, removendo any dos arquivos do dashboard modificados.

3\. Skeleton loaders.

4\. Estados vazios mais acolhedores.

5\. Melhor experiência visual e responsiva.

6\. Mutações otimistas com rollback.

7\. Captura rápida com feedback melhorado.

8\. Badge de notificações no Mobile Nav.

9\. Melhorias de acessibilidade.

10\. Preservação de todas as funcionalidades atuais.



==================================================

ARQUITETURA A PRESERVAR

==================================================



O arquivo src/app/app/page.tsx é Server Component e busca os dados iniciais no Supabase.



Mantenha esse modelo:

\- page.tsx continua buscando os dados iniciais no servidor;

\- DashboardClient continua recebendo dados iniciais tipados;

\- não duplique todas as consultas no cliente;

\- use hooks client-side apenas para interação e mutações otimistas.



==================================================

COMPONENTES A CRIAR

==================================================



Crie preferencialmente esta estrutura:



src/features/dashboard/

&#x20; components/

&#x20;   dashboard-header.tsx

&#x20;   dashboard-status-cards.tsx

&#x20;   today-priorities-card.tsx

&#x20;   upcoming-deadlines-card.tsx

&#x20;   quick-capture-card.tsx

&#x20;   quick-links-grid.tsx

&#x20;   dashboard-empty-state.tsx

&#x20;   dashboard-skeleton.tsx

&#x20; hooks/

&#x20;   use-dashboard-mutations.ts

&#x20;   use-quick-capture.ts

&#x20; types.ts



Também crie:



src/app/app/loading.tsx



O arquivo src/app/app/dashboard-client.tsx deve ficar enxuto, servindo apenas como orquestrador dos componentes.



==================================================

TIPAGEM

==================================================



Utilize os tipos reais existentes em src/types/database.ts.



Crie tipos específicos em:



src/features/dashboard/types.ts



Tipos necessários:

\- DashboardProfile

\- DashboardObligation

\- DashboardPriority

\- DashboardNotification

\- DashboardInitialData

\- DashboardClientProps



Remova dos arquivos modificados:

\- any

\- any\[]

\- casts `as any`

\- `catch (error: any)`



Para erros, use `unknown` e extração segura da mensagem.



Se os clients Supabase ainda não utilizarem o tipo Database e isso impedir a tipagem do dashboard, faça apenas o ajuste mínimo necessário, sem mudar o funcionamento da aplicação.



Não invente tabelas ou colunas.



==================================================

DASHBOARD HEADER

==================================================



Criar um cabeçalho visual mais acolhedor contendo:

\- saudação existente;

\- texto: "Aqui está o que merece sua atenção hoje.";

\- data atual em português brasileiro;

\- botão de captura em desktop, caso seja compatível com o fluxo existente.



Preserve as cores atuais do projeto:

\- roxo como identidade principal;

\- laranja somente para ações relevantes;

\- suporte completo ao dark mode.



==================================================

STATUS CARDS

==================================================



Separar os quatro cards:

\- Obrigações ativas;

\- Próximos 7 dias;

\- Notificações;

\- Pensar depois.



Adicionar:

\- ícones;

\- melhor hierarquia visual;

\- hover discreto;

\- foco visível;

\- cards clicáveis quando houver rota correspondente.



Rotas:

\- Obrigações -> /app/obrigacoes

\- Notificações -> /app/notificacoes

\- Pensar depois -> /app/pensar-depois



==================================================

PRIORIDADES DO DIA

==================================================



Criar TodayPrioritiesCard.



Preservar:

\- máximo de 3 prioridades;

\- exibição de title e next\_step;

\- conclusão de prioridade.



Implementar mutação otimista:

\- ao clicar, atualizar imediatamente a linha;

\- desabilitar múltiplos cliques durante processamento;

\- executar update no Supabase;

\- em erro, restaurar estado anterior;

\- mostrar toast de erro;

\- em sucesso, mostrar toast discreto;

\- chamar router.refresh apenas depois, para sincronização.



Estado vazio:

\- ícone apropriado;

\- mensagem: "Nenhuma prioridade definida para hoje.";

\- apoio: "Escolha até 3 tarefas importantes para deixar o dia mais leve."



==================================================

PRÓXIMOS PRAZOS

==================================================



Criar UpcomingDeadlinesCard.



Preservar:

\- até 5 obrigações;

\- acesso ao detalhe;

\- conclusão direta da obrigação;

\- formatRelativeDate e getDeadlineColor, com tipagem correta.



Corrigir acessibilidade e semântica:

\- atualmente há risco de botão dentro de Link;

\- se isso existir no arquivo real, separar corretamente o botão de conclusão da área navegável;

\- adicionar aria-label no botão: `Marcar \[título] como concluída`.



Mutação otimista:

\- ao concluir obrigação, removê-la da lista imediatamente;

\- atualizar localmente os contadores de obrigações ativas e próximos prazos;

\- restaurar em caso de erro;

\- não permitir contador negativo.



Estado vazio:

\- mensagem: "Nenhum prazo importante nos próximos 7 dias."

\- complemento: "Você está em dia com as obrigações mais próximas."



==================================================

CAPTURA RÁPIDA

==================================================



Criar QuickCaptureCard e hook useQuickCapture.



Preservar:

\- textarea;

\- botão de criar tarefa manual;

\- botão Organizar com IA;

\- verificação de ai\_consent;

\- chamada para /api/ai/analyze-capture;

\- armazenamento em sessionStorage;

\- redirecionamento para /app/captura.



Melhorar:

\- label acessível;

\- contador de caracteres conforme limite real do endpoint;

\- spinner e feedback ao processar;

\- texto durante análise: "Organizando sua pendência...";

\- aviso: "Nenhuma tarefa será salva sem sua confirmação.";

\- impedir envio vazio;

\- impedir duplo clique;

\- limpar textarea após resposta bem-sucedida da IA, antes do redirecionamento;

\- tratamento de erro sem any;

\- link claro para ativar IA em /app/configuracoes quando desabilitada.



Não envie texto para IA automaticamente durante digitação. O envio deve continuar ocorrendo somente quando o usuário clicar.



==================================================

LINKS RÁPIDOS

==================================================



Criar QuickLinksGrid com:

\- Pensar depois;

\- Revisão semanal;

\- Notificações;

\- Nova obrigação.



Melhorar:

\- ícones maiores;

\- cards inteiramente navegáveis;

\- badges para Pensar depois e Notificações;

\- foco visível;

\- duas colunas no mobile e quatro no desktop.



==================================================

MOBILE NAV

==================================================



Inspecione src/components/mobile-nav.tsx.



O componente já recebe notificationCount, mas atualmente esse valor não é utilizado.



Adicionar badge de notificações:

\- não mostrar quando count for 0;

\- mostrar `9+` quando count for maior que 9;

\- não quebrar o layout;

\- adicionar aria-label com quantidade quando aplicável.



==================================================

LAYOUT E CONTAGEM DE NOTIFICAÇÕES

==================================================



Inspecione src/app/app/layout.tsx.



Caso a consulta atual use `select("id", { count: "exact" })` e depois `notifications?.length`, corrija para usar contagem correta:

\- preferencialmente select com `{ count: "exact", head: true }`;

\- usar `count ?? 0`;

\- passar esse valor para AppSidebar e MobileNav.



Preserve a proteção de rota e autenticação.



==================================================

SKELETON LOADERS

==================================================



Criar DashboardSkeleton em:



src/features/dashboard/components/dashboard-skeleton.tsx



Criar loading da rota em:



src/app/app/loading.tsx



O skeleton deve refletir:

\- header;

\- quatro cards de status;

\- prioridades;

\- próximos prazos;

\- captura rápida;

\- links rápidos.



Use o componente Skeleton do shadcn/ui caso já exista. Se não existir, crie componente compatível com o padrão atual do projeto.



Garantir:

\- responsividade;

\- dark mode;

\- aria-busy;

\- sem layout shift exagerado.



==================================================

UX E ACESSIBILIDADE

==================================================



Melhorar:

\- bordas e espaçamento;

\- hierarquia de textos;

\- contraste;

\- estados hover;

\- focus-visible;

\- transições discretas com Tailwind;

\- experiência mobile.



Não instalar biblioteca de animação apenas para isso.



Obrigatório:

\- label para textarea;

\- aria-label em botões somente com ícone;

\- aria-live para carregamento da IA;

\- navegação por teclado nos cards;

\- remover qualquer elemento interativo aninhado incorretamente.



==================================================

VARIÁVEIS DO SUPABASE

==================================================



Meu projeto Supabase utiliza atualmente o padrão moderno de chaves:



NEXT\_PUBLIC\_SUPABASE\_URL=

NEXT\_PUBLIC\_SUPABASE\_PUBLISHABLE\_KEY=sb\_publishable\_...

SUPABASE\_SECRET\_KEY=sb\_secret\_...



Porém, o projeto pode ainda conter nomes antigos em .env.example ou no código:

\- NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY

\- SUPABASE\_SERVICE\_ROLE\_KEY



Nesta tarefa:

\- não leia nem modifique .env.local;

\- não exiba valores reais;

\- não coloque chave secreta no frontend;

\- se a migração de nomes for indispensável para o dashboard funcionar ou compilar, faça-a de forma controlada apenas nos arquivos de exemplo e no código necessário;

\- caso não seja indispensável, apenas documente como recomendação futura.



==================================================

O QUE NÃO FAZER

==================================================



Não modificar:

\- migrations;

\- RLS;

\- esquema do banco;

\- landing page;

\- login e cadastro;

\- cron;

\- área administrativa;

\- cobrança;

\- PWA;

\- lógica de segurança da IA;

\- regras de negócio fora do dashboard.



Não tente corrigir automaticamente todos os erros preexistentes do projeto fora do escopo do dashboard.



==================================================

VALIDAÇÃO FINAL

==================================================



Ao terminar:



1\. Execute `pnpm exec tsc --noEmit`.

2\. Execute `pnpm lint`.

3\. Execute `pnpm build`.



Como já existem erros preexistentes fora do dashboard:

\- informe claramente quais erros foram corrigidos nos arquivos modificados;

\- informe quais erros restantes pertencem a arquivos fora do escopo;

\- não afirme que lint/build passaram caso ainda falhem.



Também faça verificação manual ou explique como testar:

\- dashboard renderiza;

\- prioridade conclui com atualização otimista;

\- rollback funciona em falha;

\- obrigação próxima conclui sem navegar indevidamente;

\- captura manual mantém fluxo;

\- IA bloqueia sem consentimento;

\- IA redireciona corretamente após sucesso;

\- badge mobile aparece;

\- skeleton existe;

\- dark mode continua funcionando;

\- mobile não apresenta overflow.



==================================================

ENTREGA FINAL

==================================================



Ao concluir, informe:

\- arquivos criados;

\- arquivos modificados;

\- mudanças de tipagem;

\- mudanças visuais;

\- como funcionam as mutações otimistas;

\- resultado do typecheck;

\- resultado do lint;

\- resultado do build;

\- erros preexistentes restantes fora do escopo;

\- comandos exatos para testar localmente.



Agora inspecione o projeto, apresente o plano curto e execute a refatoração de forma segura.

