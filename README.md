# GORS — MozCommunity — Versão Estática (HTML + Supabase)

Esta é a versão 100% estática do **GORS** (monitoria de indicadores do
projecto MozCommunity) — só HTML, CSS e JavaScript, sem servidor Node.js e
sem passo de build. Segue exactamente a mesma arquitectura da plataforma de
queixas MDR MozCommunity: o browser fala directamente com a base de dados
(neste caso o **Supabase**, em vez do Firebase), e a segurança é garantida
por políticas de acesso ao nível da base de dados, não por um servidor.

Pode ser publicada em qualquer alojamento de ficheiros estáticos: GitHub
Pages, Netlify, Vercel, Supabase Hosting de terceiros, etc.

## Como correr localmente

Os browsers bloqueiam pedidos de rede (Supabase) quando uma página é
aberta directamente com duplo-clique (`file://...`). É necessário servir a
pasta por `http://`. A forma mais simples:

```bash
cd GORS-static
python3 -m http.server 8080
```

Depois abra `http://localhost:8080/index.html`. Qualquer outro servidor
estático funciona igualmente (`npx serve`, extensão "Live Server" do
VS Code, etc.) — não há nenhum passo de compilação a correr antes.

## Estrutura do projecto

```
index.html              Página pública inicial
painel.html              Painel público (sem login) — indicadores aprovados
auth.html                 Login / registo / Google
reset-password.html       Redefinição de palavra-passe
dashboard.html             Painel autenticado, com filtros
indicators.html            Lista de indicadores (+ criar, se admin)
indicator.html              Detalhe de um indicador (registar valor, editar, subindicadores, evidência PDF)
component.html               Detalhe de uma componente
approvals.html                 Aprovações pendentes (admin) + reset de valores
users.html                      Gestão de utilizadores e papéis (admin)
reports.html                     Relatórios: CSV, PDF, impressão
css/style.css               Folha de estilo única (cores/tokens idênticos à versão React)
js/lib.js                    Lógica de domínio pura (estado dos indicadores, períodos, geografia)
js/supabase-config.js         Ligação ao Supabase (URL + chave pública)
js/data.js                     Todo o acesso à base de dados
js/ui.js                        Toasts, diálogos, botões
js/nav.js                        Barra lateral, topo e sino de notificações
img/adin-logo.png                 Logótipo ADIN
supabase-migration-static-site.sql  Migração obrigatória (ver abaixo)
```

Cada página é independente — carrega os mesmos ficheiros `.js` por
`<script src="...">` e usa um único objecto global `window.GORS` para
partilhar funções entre eles, tal como `window.MDR` na plataforma de
queixas. Não há bundler, React, TanStack Router nem TanStack Query: a
navegação é feita com hiperligações normais (`<a href="pagina.html">`) e
parâmetros de URL (`?id=...`), e cada página volta a desenhar o seu próprio
conteúdo com `innerHTML` sempre que os dados mudam.

## Segurança: porque é seguro ter a chave do Supabase no código

Tal como o `firebaseConfig` da plataforma de queixas, o `js/supabase-config.js`
contém a URL do projecto e a chave **pública (anon)** em texto simples. Isto
é seguro por definição — a chave pública não dá acesso a nada por si só. A
autorização real é imposta pelas políticas **Row-Level Security (RLS)** do
Postgres no lado do Supabase (o equivalente ao `firestore.rules`): cada
tabela decide, no servidor da base de dados, quem pode ler ou escrever cada
linha, independentemente do que o código do browser tente fazer. Nunca
coloque a chave **service role** (privilegiada) em código que corre no
browser — ela não é usada em nenhum ficheiro deste site.

## Passo obrigatório: migração de base de dados

A versão anterior (React + TanStack Start) tinha um servidor que usava a
chave privilegiada do Supabase para duas operações: listar todos os
utilizadores com o respectivo email, e atribuir papéis. Sem servidor, isso
já não é possível — por isso é preciso:

1. Abrir o **Supabase Dashboard → SQL Editor**.
2. Colar todo o conteúdo de `supabase-migration-static-site.sql`.
3. Clicar em **Run**. Só precisa de ser feito uma vez.

Isto adiciona uma coluna `email` à tabela `profiles` (preenchida
automaticamente a partir daqui sempre que alguém cria conta) e uma política
que permite aos administradores ver o perfil de todos os utilizadores. Sem
este passo, as páginas **Utilizadores** e **Aprovações** não conseguem
mostrar o nome/email de quem submeteu cada valor.

## Passo opcional: activar o login com Google

Na versão anterior o login com Google passava por um proxy próprio da
Lovable. Nesta versão estática o browser fala directamente com o Supabase
Auth, por isso é preciso activar o fornecedor Google directamente:

**Supabase Dashboard → Authentication → Providers → Google** → activar e
preencher o Client ID / Client Secret (criados na Google Cloud Console).
Sem este passo, o botão "Continuar com Google" mostra um erro ao ser
clicado — o login com email/palavra-passe continua a funcionar
normalmente.

## Diferenças conhecidas em relação à versão React

- **Gráfico de tendência** (Meta vs. Real, em `indicator.html`): a versão
  React usava a biblioteca Recharts, que exige React/bundler. Aqui foi
  substituído por um pequeno gráfico SVG desenhado directamente em
  JavaScript — visualmente mais simples, mas com a mesma informação.
- **Gráficos de barras** (estado dos indicadores, progresso por
  componente, em `reports.html` e `painel.html`): também substituídos por
  barras de progresso em CSS puro, pelo mesmo motivo.
- **Sino de notificações**: mostra a lista e permite marcar como lida,
  mas — ao contrário da versão anterior — não abre os diálogos de
  aprovar/editar/rejeitar directamente a partir do sino; para isso, use a
  página **Aprovações**.
- **Correcção**: a verificação "é o próprio utilizador?" na página
  **Utilizadores** (que impede alguém de alterar o seu próprio papel) tinha
  um pequeno erro na versão React (comparava com um campo que nunca
  existia, pelo que nunca desactivava a opção). Nesta versão está corrigida.

## Exportação de relatórios (`reports.html`)

- **CSV**: gerado inteiramente no browser, sem dependências externas.
- **PDF**: usa as bibliotecas `html2canvas-pro` e `jsPDF`, carregadas por
  CDN (tal como o SDK do Supabase). É necessário estar ligado à Internet
  para gerar o PDF — se preferir imprimir sem depender de CDNs, use o botão
  "Imprimir", que usa a função nativa do browser.

## Publicar o site

Qualquer alojamento de ficheiros estáticos serve. Por exemplo, no GitHub
Pages: faça *push* desta pasta para um repositório, active o GitHub Pages
nas definições do repositório a apontar para a pasta raiz (ou `/docs`), e
pronto — não há build a correr, é servido tal como está.
