# M&E MozCommunity — Plataforma de Monitoria de Indicadores

Plataforma para reportar e acompanhar os indicadores do Quadro de
Resultados do projecto **"Jobs, Social Cohesion and Community Resilience
in Northern Mozambique — Phase I"** (Banco Mundial, P514199).

Site 100% estático (HTML/CSS/JS), sem servidor Node — os dados ficam no
Firestore (Firebase), tal como a plataforma MDR MozCommunity, mas este é
um **projecto Firebase completamente separado** (`me-mozcommunity`, ou o
nome que escolheres).

## Como funciona

- **19 indicadores** já carregados no código (`js/store.js`), com as metas
  de cada período, tal como no Quadro de Resultados do PAD — não precisas
  de os introduzir manualmente.
- **Equipa de reporte** ("submitter") regista o valor de um indicador para
  um período específico, com uma nota e evidência opcional.
- **Administrador geral** aprova ou rejeita cada submissão. Só valores
  **aprovados** contam para o progresso mostrado no painel.
- **Só leitura**: vê o progresso, mas não pode submeter nem aprovar nada.

## Configurar (novo projecto Firebase)

Segue exactamente os mesmos passos que já fizeste para a plataforma MDR,
mas para um projecto Firebase **novo e separado**:

1. [console.firebase.google.com](https://console.firebase.google.com) →
   "Adicionar projecto" (ex: `me-mozcommunity`)
2. Adiciona uma aplicação Web (`</>`) → copia o `firebaseConfig` para
   `js/firebase-config.js`
3. **Firestore Database** → Criar base de dados → modo produção
4. **Authentication** → Sign-in method → activa Email/Password
5. **Authentication → Users** → cria a tua própria conta (email + password)
6. Copia o teu **User UID**
7. **Firestore Database → Dados** → Iniciar colecção `admins` → documento
   com ID = o teu UID → campos `role: "admin"` e `name: "O teu nome"`
8. **Firestore Database → Regras** → cola o conteúdo de `firestore.rules`
   → Publicar
9. Testa em `index.html` com as tuas credenciais

## Publicar

Mesmo processo que já conheces: GitHub Desktop → cria um repositório novo
(ex: `me-mozcommunity`) → copia estes ficheiros para lá → Commit → Push →
activa GitHub Pages em Settings → Pages.

**Importante**: depois de publicado, volta a **Firebase Console →
Authentication → Configurações → Domínios autorizados** e adiciona o
domínio do teu link do GitHub Pages — sem isso o login não funciona
(exactamente como aconteceu com a plataforma MDR).

## Adicionar/gerir utilizadores

Mesmo fluxo em dois passos que já usas na plataforma MDR:
1. Firebase Console → Authentication → Users → Add user (cria o login)
2. Copia o User UID → plataforma → "Utilizadores" → cola o UID → escolhe o
   nível de acesso → Guardar

## Actualizar os indicadores no futuro

Os indicadores e as respectivas metas vivem no ficheiro `js/store.js`, na
constante `INDICATORS`, no início do ficheiro. Para adicionar, remover, ou
corrigir um indicador (por exemplo, ao avançar para a Fase II do
projecto), edita essa lista directamente — não é preciso mexer no
Firestore nem nas regras para isso.

## Limitações (iguais às da plataforma MDR)

- Evidências anexadas às submissões ficam guardadas directamente no
  documento Firestore (limite de 1MiB) — por isso o limite é baixo
  (200KB, 2 ficheiros por submissão).
- Não há recuperação automática de UID por email — continua a ser preciso
  copiar o UID manualmente do Firebase Console.

## Periodicidade correcta ao submeter valores

Ao submeteres um valor, o menu de "Período" já não mostra só os pontos de
meta — mostra a lista completa de períodos possíveis, de acordo com a
periodicidade real de cada indicador:

- **Trimestral** → T1, T2, T3, T4 de cada ano (2026–2034)
- **Semestral** → 1º e 2º Semestre de cada ano
- **Anual** → cada ano
- **Bienal** → intervalos de dois anos

Indicadores com periodicidade baseada em marcos (ex: "Ano 1 do projecto,
meio-termo e encerramento") continuam a usar os períodos definidos nas
próprias metas, porque não seguem uma cadência regular.

## Página de Relatórios

Nova página **"Relatórios"**, com:
- Filtros por **Nível** (PrDO/PDO/Intermédio) e **Componente**
- Cartões-resumo: total de indicadores, quantos já têm valor aprovado,
  quantos ainda não têm nenhum, e o progresso médio
- Gráficos: indicadores por nível, e progresso médio por componente
- Botão **"Descarregar relatório em PDF"** — inclui os gráficos e uma
  tabela detalhada por indicador, de acordo com os filtros aplicados

## Ano e Período como campos separados

Ao submeteres um valor, para indicadores com periodicidade regular
(Trimestral, Semestral, Anual, Bienal), o formulário agora tem **dois
campos separados**: primeiro escolhes o **Ano**, depois o **Período**
dentro desse ano (ex: Trimestre ou Semestre). Os dois juntam-se
automaticamente no período final gravado (ex: "T1 2026"). Indicadores com
periodicidade por marcos (ex: "meio-termo e encerramento") continuam a
usar um único campo, com as opções definidas nas próprias metas.

## Relatório Público (sem login)

Nova página **`relatorio-publico.html`**, com acesso livre — não pede
nenhuma conta nem password. Mostra os mesmos filtros, gráficos, tabela e
exportação em PDF da página "Relatórios" interna, mas alimentada só por
uma colecção espelho (`indicator_values_public`) que:

- Só recebe dados quando um valor é **aprovado** pelo Administrador geral
  (nunca mostra submissões pendentes ou rejeitadas).
- Não inclui nomes de quem submeteu, notas internas, nem evidências.

Há um link para este relatório na própria página de login (`index.html`),
para ser fácil de partilhar com qualquer pessoa — parceiros, o Banco
Mundial, ou o público em geral — sem lhes teres de criar conta nenhuma.

## Página completa do indicador (com descrição, metodologia e gráfico)

Ao clicares num indicador na lista, já não abre um painel a meio do ecrã —
abre uma **página inteira e dedicada** (`indicador.html?id=...`), com:

- **Descrição/definição** do indicador
- **Periodicidade**, **fonte de dados** e **metodologia de recolha**
  — todos extraídos verbatim do documento PAD do Banco Mundial (secção
  "Monitoring & Evaluation Plan"), traduzidos para português
- **Responsável pela recolha**
- **Gráfico de resultados**: meta vs. valores aprovados, ao longo dos
  períodos (para indicadores numéricos — indicadores de texto ou Sim/Não
  mostram só a tabela de metas, por não se prestarem a gráfico)
- Tabela de metas por período
- Histórico completo de submissões, com aprovação/rejeição inline
- Formulário de submissão de novo valor

Estes dados (descrição, fonte, metodologia) vivem também em `js/store.js`,
na mesma constante `INDICATORS` — podes editá-los se precisares de
ajustar algum texto.
