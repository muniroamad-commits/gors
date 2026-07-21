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

## Nomes dos indicadores corrigidos (Quadro de Resultados oficial)

Os nomes dos 18 indicadores foram revistos e corrigidos de acordo com o
documento oficial "Quadro de Resultados" fornecido pelo cliente — que
também serviu para corrigir dois pequenos erros de dados encontrados no
documento PAD original do Banco Mundial:

- **Periodicidade dos "Empregos melhores e mais bem remunerados" (Áreas-alvo)**:
  corrigida de Trimestral para **Semestral**.
- **Meta de "Jovens formados nos SICs" em Mai/2028**: corrigida de 5.000
  para **500** (era um erro de digitação evidente no documento original —
  a meta final de 2.000 só faz sentido com este valor corrigido).

## Tabela Ano × Período, com totais e observações

Depois do gráfico de resultados, cada indicador tem agora uma tabela com:

- **Linhas**: um ano por linha
- **Colunas**: os sub-períodos de acordo com a periodicidade do indicador
  (T1–T4 para trimestral, 1º/2º Semestre para semestral, "Valor" para
  anual/bienal), mostrando o valor mais recente submetido em cada célula,
  com indicação se está aprovado, submetido (pendente) ou rejeitado
- **Total**: soma dos valores aprovados desse ano (só para indicadores
  numéricos)
- **Observações**: notas associadas às submissões desse ano

Indicadores com periodicidade por marcos (ex: "meio-termo e encerramento")
mostram uma versão simplificada da tabela, com uma linha por período
definido nas metas.

## Campo "Descreva o resumo do processo" (obrigatório)

O campo antes chamado "Nota / fonte de verificação" no formulário de
submissão passou a **"Descreva o resumo do processo"**, e é agora
**obrigatório** — não é possível submeter um valor sem preencher este
campo. Isto é aplicado tanto na interface como no motor de dados
(`js/store.js`), para garantir que não é possível contornar esta regra.

## Filtros de género, província, distrito e estatuto de beneficiário

Ao submeteres um valor (em `indicador.html`), podes agora indicar
opcionalmente:

- **Província** e **Distrito** (cascata, tal como na plataforma MDR)
- **Desagregação por estatuto de beneficiário**: Deslocados, Retornados,
  Anfitriões — tal como descrito no PAD ("IDPs, host communities,
  returnees")

Os relatórios (interno e público) têm agora seis filtros: Nível,
Componente, **Género** (Mulheres/Jovens), **Província**, **Distrito**, e
**Estatuto** (Deslocados/Retornados/Anfitriões). Quando filtras por
Género ou Estatuto, o relatório mostra o valor **desagregado**
correspondente (não o valor total) — e só inclui indicadores/submissões
que tenham essa desagregação preenchida.

**Nota importante**: os filtros de Género e Estatuto só funcionam para
submissões que tenham essa desagregação indicada no momento em que foram
submetidas. Submissões antigas, feitas antes desta actualização, não têm
essa informação e não aparecem quando esses filtros estão activos —
continuam a aparecer normalmente sem filtro nenhum.

## Indicador do NRCF corrigido

O indicador "Fórum Consultivo Regional do Norte (NRCF) operacional"
deixou de ser um indicador de texto livre (com o texto dos Termos de
Referência como base) e passou a **Sim/Não**: base = "Não", meta = "Sim"
em cada período — mais simples de acompanhar na prática.

## Indicadores agora editáveis (só Administrador geral)

O catálogo de indicadores deixou de estar fixo no código — passou a viver
no Firestore, para poderes **editar ou adicionar indicadores directamente
na plataforma**, sem precisares de mexer em ficheiros.

- Botão **"+ Adicionar indicador"** no topo da lista de Indicadores.
- Botão **"Editar indicador"** dentro da página de cada indicador.
- Ambos só aparecem para o Administrador geral.
- É possível apagar um indicador (os valores já submetidos para ele não
  são apagados, mas deixam de estar associados a um indicador visível no
  catálogo).

### ⚠️ Arranque inicial — importante

O catálogo de 19 indicadores só é copiado automaticamente para o
Firestore **na primeira vez que o Administrador geral abrir a página
"Indicadores"**, depois de publicares esta actualização. Por isso:

1. Depois de publicares e colares as novas regras, **entra tu primeiro**
   (com a tua conta de Administrador geral) e abre "Indicadores".
2. Isso semeia automaticamente o catálogo completo no Firestore.
3. A partir daí, qualquer pessoa (incluindo o relatório público, sem
   login) já vê os indicadores normalmente.

Se mais ninguém tiver acesso antes de fazeres este primeiro login, não há
nada a fazer — a plataforma resolve isto sozinha.

## Tabela única de Metas e Valores (coerência garantida)

As duas tabelas separadas ("Metas por período" e "Valores submetidos e
aprovados") foram unidas numa só: **"Metas e valores realizados, por ano
e período"**. Cada célula mostra a Meta definida no Quadro de Resultados
e o valor Realizado (submetido/aprovado) lado a lado, para o mesmo
período exacto — sem risco de as duas tabelas mostrarem períodos
diferentes ou darem uma ideia inconsistente do progresso. As linhas
mostradas são só os anos que têm meta definida ou algum valor submetido
(não o intervalo todo do projecto, para não haver linhas vazias).

## Formulário de submissão — tudo obrigatório

Todos os campos do formulário de submissão de um novo valor passaram a
ser obrigatórios: Valor, Província, Distrito, todas as desagregações do
indicador (quando aplicável), a desagregação por estatuto de beneficiário
(Deslocados/Retornados/Anfitriões), a descrição do resumo do processo, e
o anexo de evidência. Isto é validado tanto na interface (mostra
exactamente o que falta preencher) como no motor de dados, para garantir
que não é possível contornar a regra.

## Ajustes na tabela "Detalhe por indicador" dos relatórios

- **"Meta final"** já não mostra o mês/ano entre parêntesis — só o valor.
- Nova coluna **"Meta no período"**: mostra a meta definida especificamente
  para o mesmo período do "Último valor aprovado" (não a meta final do
  projecto), para comparares directamente o que foi alcançado com o que
  era esperado nesse período em concreto. Aplicado ao relatório interno,
  ao relatório público, e ao PDF descarregável de ambos.

## Duas correcções de coerência

**1. Desagregação só em indicadores sobre pessoas**

Os campos de desagregação por género (Mulheres/Jovens) e por estatuto de
beneficiário (Deslocados/Retornados/Anfitriões) deixaram de aparecer em
TODOS os indicadores — agora só aparecem nos que já têm desagregação
definida no catálogo (ex: "Pessoas beneficiadas por infra-estruturas
resilientes", "Beneficiários de transferências monetárias"). Um
indicador sobre número de localidades, infra-estruturas, comités ou
reuniões já não pede estes campos, porque não faz sentido.

**2. A meta não aparecia na tabela — corrigido**

Havia um problema real: para indicadores trimestrais/semestrais, as metas
do Quadro de Resultados usam rótulos de mês/ano (ex: "Mai/2027",
"Jun/2031") que nunca coincidem exactamente com os períodos de submissão
(ex: "T1 2027", "2º Semestre 2027") — por isso a coluna de meta ficava
sempre vazia nesses casos. Corrigido: a tabela "Metas e valores
realizados, por ano e período" agora tem uma coluna própria **"Meta do
ano"**, que casa a meta pelo ANO (não pelo período exacto), garantindo
que a meta aparece sempre que estiver definida para esse ano no Quadro de
Resultados.

## Meta sem parênteses em toda a plataforma

A coluna/campo "Meta final" já não mostra o mês/ano entre parêntesis em
lado nenhum — nem na lista de indicadores, nem na página de detalhe do
indicador, nem nos relatórios. Só o número da meta.

## Botão "Zerar todos os valores" (só Administrador geral)

No topo da lista de Indicadores, há agora um botão **"Zerar todos os
valores"** — apaga permanentemente todos os valores submetidos, aprovados
e rejeitados de TODOS os indicadores (o catálogo de indicadores em si não
é apagado, só os dados reportados). Pede confirmação explícita
("ZERAR TUDO") antes de agir, e é irreversível.

## Notificações de aprovação: sino em tempo real + email

### Sino (funciona já, sem configuração extra)

No canto superior do menu, o Administrador geral vê agora um sino 🔔 com
um número — quantos valores estão à espera de aprovação, actualizado **em
tempo real** (sem precisar de recarregar a página). Clicar no sino leva
directamente a "Aprovações". Aparece em todas as páginas internas.

### Email (precisa de um passo de configuração único)

Sempre que alguém submete um valor, a plataforma prepara automaticamente
um email para todos os Administradores geral, com: o indicador, o
período, o valor, quem submeteu, o resumo do processo, e um link directo
para a página do indicador (onde está a evidência anexada).

**Para os emails serem mesmo enviados**, precisas de instalar, uma única
vez, a extensão oficial e gratuita do Firebase chamada **"Trigger
Email"**:

1. Firebase Console → menu lateral → **Extensions** (ou "Extensões")
2. Procura por **"Trigger Email"** (da Firebase, oficial) → Instalar
3. Durante a instalação, escolhe a colecção `mail` (é o nome que a
   plataforma já está a usar) quando perguntar "Mail collection"
4. Configura um fornecedor de email SMTP — as opções mais simples são:
   - Uma conta Gmail com uma ["palavra-passe de aplicação"](https://support.google.com/accounts/answer/185833)
   - Um serviço gratuito como o [SendGrid](https://sendgrid.com) ou
     [Mailgun](https://www.mailgun.com), que têm planos gratuitos
     suficientes para este volume de emails
5. Termina a instalação (demora 1-2 minutos a ficar activa)

Depois disso, os emails começam a ser enviados automaticamente — não
precisas de tocar em mais nada. Se preferires, posso guiar-te por este
passo como fizemos com o resto da configuração do Firebase.

**Importante**: cada Administrador geral só recebe emails se tiver um
**email válido e real** no seu perfil (o mesmo que usaste para criar a
conta em Authentication → Users, e que já está guardado ao adicionares o
utilizador em "Utilizadores").

## Correcção: valores pendentes já não apareciam antes de aprovados

Havia um bug real: a tabela "Metas e valores realizados, por ano e
período" (dentro da página de cada indicador) estava a mostrar valores
**submetidos mas ainda não aprovados**. Corrigido — agora, tanto a
tabela como o gráfico só reflectem valores **aprovados**, tal como já
acontecia no painel de Indicadores e nos relatórios. Um valor pendente
só passa a contar depois de o Administrador geral o aprovar.

## Aprovações com detalhe completo, incluindo evidência

A página "Aprovações" agora tem um botão **"Ver detalhes"** em cada
submissão pendente (ou basta clicar na linha), que abre uma janela com
tudo: componente, localização, desagregações, o resumo do processo
completo, e a **evidência anexada** (com link para ver/descarregar) —
tudo antes de decidires aprovar ou rejeitar. Os botões "Aprovar" e
"Rejeitar" aparecem tanto na lista (para decisão rápida) como dentro
dessa janela de detalhe.

## Valor do indicador = soma dos aprovados (não só o mais recente)

Em toda a plataforma (painel de Indicadores, ficha de cada indicador,
relatório interno e relatório público), o "valor actual" de um indicador
passou a ser a **soma de todos os valores aprovados**, não só o mais
recente — cada submissão representa um incremento (ex: 20 localidades
aprovadas num trimestre + 15 no seguinte = 35 no total). Isto aplica-se a
indicadores numéricos; indicadores de texto ou Sim/Não continuam a
mostrar o valor aprovado mais recente, porque não fazem sentido somados.

A coluna "Meta no período" foi removida dos relatórios — ficam só:
Nível, Indicador, Base, Valor do indicador, Meta (final), Progresso.

## Email de notificação — falta um campo no teu perfil

Se não estiveres a receber o email de notificação (mas o sino 🔔 já
funciona), a causa mais provável é que o teu perfil de administrador,
criado manualmente no "arranque inicial", não tinha um campo `email`
— só tinha `role` e `name`. Adiciona esse campo directamente no
Firestore (colecção `admins` → o teu documento → "+ Adicionar campo" →
`email`, tipo `string`, o teu endereço real). A partir daí, os emails
devem começar a chegar.

## Email de notificação corrigido (auto-correcção)

Encontrei a causa: quando criámos a tua conta de Administrador geral
manualmente no Firestore (arranque inicial), só guardámos os campos
`role` e `name` — nunca o `email`. A notificação por email procura o
email de todos os administradores nessa mesma colecção; sem esse campo,
não tinha para onde enviar (por isso o sino funcionava, mas o email não —
são mecanismos independentes).

**Corrigido automaticamente**: da próxima vez que entrares na plataforma,
o teu perfil de administrador é actualizado sozinho com o email da tua
conta de login — não precisas de editar nada no Firestore à mão. A
partir desse login, as notificações por email devem começar a chegar.

## Relatórios: valor actual (soma) em vez de último valor

Esta alteração já tinha sido feita numa resposta anterior — os
relatórios (interno e público), o painel de indicadores, e a página de
cada indicador já mostram:

- **"Valor actual"** = soma de todos os valores **aprovados** desse
  indicador (cada submissão representa um incremento reportado), em vez
  do último valor aprovado isoladamente. Aplica-se a indicadores
  numéricos; indicadores de texto ou Sim/Não continuam a mostrar o valor
  aprovado mais recente, porque não faz sentido somar texto.
- A coluna **"Meta no período"** foi removida — os relatórios mostram
  apenas: Nível, Indicador, Base, Valor do indicador, Meta, Progresso.

Se ainda vires a versão antiga (com "Último valor aprovado" e "Meta no
período"), é sinal de que o teu site publicado ainda não tem os ficheiros
mais recentes — basta repetir o Passo 2 (enviar para o GitHub) com este
pacote.

## PDF mais legível e mais estético

Corrigi três coisas nos dois relatórios em PDF (interno e público):

1. **Gráfico "Progresso médio por componente" ilegível** — o gráfico usado
   no PDF já não é uma cópia do gráfico pequeno do ecrã; é desenhado de
   propósito, maior e com letra maior, especificamente para o PDF. As
   componentes usam códigos curtos no eixo (C.1, C.2...) com uma
   **legenda por baixo do gráfico** a explicar o que cada código
   significa, para nunca mais faltar espaço para o texto.
2. **Coluna "Nível" a cortar "Intermédio"** — a coluna ficou mais larga, e
   "Intermédio" passa a aparecer abreviado como "Interm." só na tabela do
   PDF (no ecrã continua por extenso).
3. **Tabelas mais estéticas** — cabeçalho com fundo próprio, linhas
   alternadas (zebra) para facilitar a leitura, e um traço bordô a marcar
   claramente o início e o fim de cada tabela — mesmo quando a tabela
   continua numa página seguinte.

## Relatórios redesenhados: gráficos de coluna e 4 vistas separadas

Reformulação grande dos relatórios (interno e público):

**Gráficos** — todos passaram a gráficos de **coluna** (barras verticais):
- **Indicadores por nível**: só PrDO e PDO (os indicadores intermédios já
  aparecem separados por componente no gráfico ao lado)
- **Progresso médio por componente**: eixo com códigos curtos **C1, C2,
  C3, C4** (sem ponto), com legenda por baixo a dizer o que cada um é
- **Estágio dos indicadores** (novo): quantos estão **em atraso**, quantos
  já **alcançaram a meta**, e quantos estão **dentro do prazo** — a
  classificação compara o valor actual com a meta-marco mais recente já
  passada no calendário (ex: se já passou Maio/2027 e o valor ainda não
  chegou à meta desse ano, conta como "em atraso")

**Tabelas** — a tabela única "Detalhe por indicador" foi substituída por
três tabelas separadas:
1. **Indicadores de Programa (PrDO e PDO)**
2. **Indicadores Intermédios** (com a componente em vez do nível, já que
   todos são "Intermédio")
3. **Progresso médio por nível** — uma tabela-resumo com PrDO, PDO e
   Intermédio lado a lado, cada um com o número de indicadores e o
   progresso médio

Todas as tabelas mantêm o desenho com cabeçalho, zebra, e traços de
início/fim introduzido anteriormente.

## Relatório Descritivo (compilação das notas de processo)

Nova secção, no **relatório interno** (`relatorios.html`), tanto no ecrã
como no PDF: **"Relatório Descritivo"**. Compila, indicador a indicador,
todos os resumos de processo ("Descreva o resumo do processo") escritos
ao longo das submissões aprovadas — com o período, quem submeteu, e a
data — dando uma narrativa legível de como cada indicador foi apurado,
sem teres de ir ver o histórico de cada indicador manualmente.

**Nota importante**: esta secção só existe no relatório **interno**, não
no relatório público. As notas de processo nunca foram guardadas no
espelho público (por serem informação de processo interno, potencialmente
com detalhes sensíveis) — se quiseres que o relatório público também
tenha esta secção, é preciso decidir conscientemente tornar essas notas
públicas, o que implica alterar o que é guardado no espelho público. Diz-
me se queres isso e eu faço a alteração.

## Atraso baseado em datas reais (com 15 dias de tolerância) + alertas

**Regra de atraso mais precisa**: em vez de comparar só o mês/ano, o
sistema calcula agora a **data-limite real** de cada meta-marco — o
último dia do mês a que se refere, mais 15 dias de tolerância. Por
exemplo, a meta de "Mai/2027" só é considerada vencida a partir de
**15 de Junho de 2027**. Se, a partir dessa data, o indicador ainda não
tiver valor aprovado suficiente para essa meta, é classificado como
**"Em atraso"**.

**Alerta no painel de Indicadores**: se algum indicador estiver em
atraso, aparece automaticamente um aviso vermelho no topo da página
"Indicadores", com o número de indicadores afectados e os seus nomes.
Este alerta verifica **todos** os indicadores, não só os que estão
visíveis com os filtros activos no momento.

**Bandeirinhas coloridas**: em todo o lado onde o progresso de um
indicador aparece (painel de Indicadores, página de cada indicador,
tabelas dos relatórios), há agora uma bandeirinha de estágio:
- 🔴 **Em atraso** (vermelho)
- 🟢 **Meta alcançada** (verde)
- 🔵 **Dentro do prazo** (azul)

## PDF: gráficos numa página, tabelas a começar sempre na seguinte

Nos dois relatórios em PDF, os três gráficos (nível, componente, estágio)
ficam sempre na(s) primeira(s) página(s), e as tabelas passam a começar
sempre numa **página nova**, nunca a meio da página dos gráficos — mais
fácil de imprimir e de navegar.

## Filtros na horizontal + Relatório Descritivo em narrativa contínua

**Filtros do PDF na horizontal**: a lista de filtros (Nível, Componente,
Género, Província, Distrito, Estatuto) passou de uma coluna vertical para
uma grelha horizontal (2 linhas × 3 colunas), ocupando muito menos espaço.

**Relatório Descritivo reescrito como narrativa**: em vez de uma lista de
entradas separadas (com nome de quem submeteu e data), o relatório
compõe agora um **texto corrido** por indicador, encadeando os resumos de
processo por ordem cronológica, usando a periodicidade do próprio
indicador ("No primeiro trimestre reportado...", "Em seguida, no
2º Semestre 2026...", "Mais recentemente, em..."), e terminando com um
resumo dos **números reais** introduzidos (desagregação por género/
estatuto e distribuição por província), tal como pediste no exemplo.

**Limitação honesta a ter em conta**: esta é uma página estática, sem
ligação a um modelo de IA em tempo real — por isso a narrativa é
construída por um sistema de modelos/regras que encadeia o texto que TU
escreveste em cada submissão com ligações naturais ("Em seguida...",
"Mais recentemente..."), e acrescenta os números reais calculados a
partir dos dados estruturados. Não reescreve nem interpreta o
significado do texto livre — por isso, escrever resumos de processo
claros e completos no momento da submissão continua a ser importante,
para a narrativa final ficar bem composta.

## Ajustes ao Relatório Descritivo, gráficos com números, e semáforos

**Relatório Descritivo**:
- Já não termina com "de acordo com os dados introduzidos" — em vez
  disso, a narrativa termina com a **percentagem de execução face à
  meta** do indicador (ex: "Actualmente, o indicador atingiu 42% da meta
  definida.").
- Conectores mais variados entre os períodos ("Em seguida", "Posteriormente",
  "Na fase seguinte", "Mais recentemente", "Actualmente"...), para não
  soar repetitivo quando há muitas submissões.
- Removida a frase de introdução da secção (tanto no ecrã como no PDF).

**Números exactos nos gráficos**: os três gráficos (nível, componente,
estágio) mostram agora o valor exacto em cima de cada barra/coluna — não
é preciso adivinhar pela escala.

**Sistema de semáforos no Estágio**: em vez de cores neutras, as
bandeirinhas de estágio usam agora cores de semáforo a sério — 🔴
vermelho para "Em atraso", 🟡 amarelo para "Dentro do prazo", 🟢 verde
para "Meta alcançada" — tanto no ecrã (painel de Indicadores, página do
indicador, tabelas dos relatórios) como no PDF, onde é desenhado um
círculo colorido antes do texto (porque o PDF não consegue desenhar
emoji coloridos como texto normal).

## Narrativa gerada por IA (Claude) — configuração (opcional, um pouco mais técnica)

Adicionei a opção de melhorar o Relatório Descritivo usando mesmo um
modelo de IA (Claude, da Anthropic) — de forma **segura**: a chave da API
nunca fica no código do site, fica guardada em segredo no Firebase, e só
uma Cloud Function (que corre no servidor da Google) é que a usa.

Isto é um passo mais técnico do que tudo o que fizemos até agora só pela
consola do Firebase — precisa do **Firebase CLI**, instalado no teu
computador. Passo a passo:

### 1. Instalar o Node.js (se ainda não tiveres)
Vai a [nodejs.org](https://nodejs.org) → descarrega a versão **LTS** →
instala normalmente (Seguinte, Seguinte...).

### 2. Instalar o Firebase CLI
Abre o Prompt de Comando e escreve:
```
npm install -g firebase-tools
```

### 3. Iniciar sessão
```
firebase login
```
Isto abre o browser para autorizares com a tua conta Google (a mesma do
Firebase).

### 4. Obter uma chave da API da Anthropic
1. Vai a [console.anthropic.com](https://console.anthropic.com)
2. Cria uma conta (se ainda não tiveres) → activa a facturação
3. **API Keys** → **Create Key** → copia a chave (começa por `sk-ant-...`)

### 5. Guardar a chave em segredo no Firebase
Dentro da pasta do projecto (onde está o ficheiro `firebase.json` que te
enviei), no Prompt de Comando:
```
firebase functions:secrets:set ANTHROPIC_API_KEY
```
Cola a chave quando pedir, e prime Enter.

### 6. Publicar a função
```
firebase deploy --only functions
```
Pode pedir para activares mais algumas APIs do Google Cloud (Cloud
Build, Artifact Registry, Cloud Run) — aceita, fazem parte do processo
normal, sem custo extra para o teu volume de uso. Demora 1-3 minutos.

### 7. Testar
1. Envia os ficheiros actualizados para o GitHub (como habitual)
2. Abre "Relatórios" na plataforma
3. Se houver indicadores com resumos de processo, clica em **"🤖
   Melhorar com IA (Claude)"** por baixo do título "Relatório
   Descritivo"
4. As narrativas devem ficar reescritas pelo Claude — mais fluidas e
   menos "mecânicas" que a versão automática por defeito

**Se não fizeres este passo**: a plataforma continua a funcionar
perfeitamente com o compilador local (gratuito, instantâneo, sem
configuração) — o botão de IA só aparece como uma melhoria opcional.

Como sempre, posso ajudar-te a passar por estes passos em tempo real se
preferires.

## Botão de tradução PT / EN — toda a plataforma

Adicionei um botão **"EN" / "PT"** no canto do menu, em todas as páginas
(incluindo os dois relatórios e o PDF). Ao clicar, a plataforma recarrega
no idioma escolhido, e a preferência fica guardada no browser — não
precisas de mudar de novo da próxima vez que abrires a plataforma nesse
computador.

**O que é traduzido:**
- Toda a interface: menus, botões, cabeçalhos de tabelas, rótulos de
  formulários, mensagens de erro/confirmação, gráficos
- **O catálogo completo dos 19 indicadores do Quadro de Resultados**:
  nome, descrição, metodologia, meios de verificação, unidade,
  periodicidade — traduzidos por mim, com cuidado, directamente do
  documento original do Banco Mundial (que foi originalmente escrito em
  inglês)
- Os dois relatórios em PDF, incluindo os gráficos, tabelas e o cabeçalho
  institucional

**O que continua em português, mesmo no modo inglês:**
- As **notas de processo** que a equipa escreve ao submeter valores
  ("resumo do processo"), e a narrativa do Relatório Descritivo compilada
  a partir delas — porque este texto é escrito por vocês no momento, e
  muda todos os dias. Traduzir isto automaticamente exigiria uma ligação
  paga a um serviço de tradução (a mesma ligação que já preparámos para o
  Claude, ver secção "Narrativa gerada por IA"). Se um dia activares essa
  ligação, dá para estender a mesma função para também traduzir estas
  notas — diz-me se quiseres isso.
- Indicadores criados ou editados manualmente por ti (fora dos 19
  originais) — ficam sempre no idioma em que os escreveste, porque não há
  como eu adivinhar a tradução de conteúdo que ainda não existe.

**Nota técnica**: como esta tradução ocorre no teu computador (não é
guardada no Firestore), qualquer pessoa que abrir a plataforma pode
escolher o idioma que preferir, independentemente do que outra pessoa
tiver escolhido — a preferência é só local a cada dispositivo/browser.

## Actualização: tradução só no Relatório Público

Retirei o botão de tradução PT/EN de todas as páginas internas (painel de
Indicadores, página de cada indicador, Aprovações, Utilizadores, Editar
Indicador, e a página de Relatório interna) — ficam sempre e só em
português, tal como antes desta funcionalidade existir. O botão EN/PT
**fica apenas no relatório público** (`relatorio-publico.html`), que é o
único sítio pensado para ser visto por gente de fora (ex: Banco Mundial,
parceiros internacionais), fazendo sentido ser o único bilingue.

O ficheiro `js/i18n.js` mantém-se no projecto (é usado pelo relatório
público), mas já não é carregado em mais nenhuma página.

## Correcções ao relatório público (tradução completa) e novos ajustes

**Tradução mais completa no relatório público**: encontrei e corrigi
vários sítios que ainda ficavam em português mesmo no modo inglês —
títulos dos gráficos e tabelas no PDF, a legenda dos componentes (C1 =
...), o nome do ficheiro descarregado (agora `public-report-me-
mozcommunity-...pdf` em inglês, `relatorio-publico-me-mozcommunity-
...pdf` em português), as datas (usa `en-GB` em vez de `pt-MZ` quando em
inglês), o título da página do browser, e alguns textos que tinham
ficado esquecidos no formulário de filtros. Também encontrei e corrigi
um pequeno bug: o texto "Dados abertos" estava a ser trocado por engano
por "Progresso do projecto" assim que a página carregava — já está
corrigido.

**Números nas barras/colunas removidos**: como pediste, retirei essa
funcionalidade dos dois relatórios (interno e público) — os gráficos
voltam a mostrar só as barras, sem o número escrito por cima.

## Reordenar indicadores (novo)

Adicionei botões **↑ / ↓** na lista de indicadores do painel principal
(só visíveis para o Administrador geral), para reordenares os
indicadores dentro do catálogo — por exemplo, para colocares um
indicador novo logo a seguir a outro relacionado.

**Para resolveres o indicador de VBG que ficou deslocado**: entra no
painel de Indicadores com a tua conta de administrador, encontra o novo
indicador (deve estar no fundo da lista, onde os indicadores novos
aparecem por defeito), e clica na seta **↑** repetidamente até ele ficar
logo a seguir a "Beneficiários de acções de prevenção e resposta à
VBG". Cada clique troca de posição com o indicador imediatamente acima.

## Tradução na página de login + nova frase

Adicionei o botão EN/PT também à página de login (`index.html`) — faz
sentido, já que é a primeira página que qualquer pessoa de fora vê,
incluindo quem procura o link para o relatório público.

Também troquei a frase técnica "Os utilizadores são criados em Firebase
Console → Authentication → Users..." (que só fazia sentido para ti, não
para quem visita a página) por uma frase mais apropriada:

> "Para aceder ao painel interno, contacta o administrador da plataforma
> para obteres as tuas credenciais de acesso."

(em inglês: "To access the internal dashboard, contact the platform
administrator to obtain your access credentials.")

## Novo nome do sistema: GORS - MOZCOMMUNITY

Substituí "M&E MozCommunity" por **"GORS - MOZCOMMUNITY"** em toda a
plataforma — títulos das páginas (separador do browser), cabeçalho
(logótipo + nome), e rodapé. Aplicado a todas as 8 páginas.

No relatório público, o rodapé "GORS - MOZCOMMUNITY — Monitoria de
Indicadores, ADIN." também traduz correctamente para inglês ("GORS -
MOZCOMMUNITY — Indicator Monitoring, ADIN.") ao mudar o idioma.

## Login: logótipo e nome centralizados

Reestruturei a página de login: o logótipo da ADIN, "GORS -
MOZCOMMUNITY", e "Global Output and Outcome Reporting System" já não
estão no canto superior esquerdo do cabeçalho — ficam agora
**centralizados**, por cima da secção "Área reservada", tanto em
português como na versão inglesa (o nome "Global Output and Outcome
Reporting System" é o mesmo nos dois idiomas, por ser já em inglês). O
cabeçalho ficou mais simples, só com o botão EN/PT no canto direito.

## Login mais compacto + nome traduzido

Tornei a página de login mais compacta, para caber tudo num só ecrã sem
precisar de scroll: cabeçalho mais fino, logótipo mais pequeno, menos
espaço entre secções, e removi a frase descritiva do projecto (redundante
com o nome completo do GORS já mostrado acima). Fica só: logótipo + nome
GORS, e os campos de login — como pediste.

"Global Output and Outcome Reporting System" passa a traduzir-se em
português para **"Sistema Global de Relatório de Produtos e
Resultados"** (usando "Produto"/"Resultado" como é costume nos termos de
M&A do Banco Mundial). Em inglês mantém-se o nome original.

## Correcção: logótipo cortado

O logótipo estava a ser mostrado como um quadrado pequeno com
`object-fit: cover`, o que **cortava** o nome "AGÊNCIA DE
DESENVOLVIMENTO INTEGRADO DO NORTE" por baixo do "ADIN" (a imagem não é
quadrada). Corrigi para mostrar a imagem completa, sem cortar nada, e
bem maior (190px de largura) — agora o nome fica totalmente legível.

## Correcção: logótipo desalinhado no painel de Indicadores

No painel de Indicadores (`dashboard.html`), a barra lateral ocupa a
largura toda do ecrã, mas o cabeçalho estava limitado a uma largura
máxima e centrado — por isso o logótipo parecia deslocado para o centro
em vez de estar mesmo no canto, alinhado com a barra lateral por baixo.
Corrigi para o cabeçalho desta página também ocupar a largura toda,
alinhando o logótipo ao canto esquerdo verdadeiro, e dando mais espaço
para todos os botões do menu à direita.

## Dois novos sub-indicadores: Transferências Monetárias por Mulheres e Jovens

Adicionei ao catálogo de referência (para novas instalações) dois
sub-indicadores da Componente 2, tal como aparecem no documento oficial
do Banco Mundial:
- **Beneficiários das intervenções de transferências monetárias —
  Mulheres (CRI)**
- **Beneficiários das intervenções de transferências monetárias —
  Jovens (CRI)**

**Importante**: como a tua plataforma já tem dados, isto só entra
automaticamente numa instalação nova — na tua, que já está semeada,
precisas de os criar tu mesmo pelo botão "+ Adicionar indicador" (só
demora 2 minutos com os valores já calculados abaixo, prontos a colar).

## Correcção: campos de desagregação duplicados ao editar

Corrigi o formulário de editar indicador para nunca mais gravar
desagregações repetidas (ex: "Mulheres, Jovens, Mulheres, Jovens") — a
causa mais provável é o campo já vir preenchido com o que lá estava
quando abriste para editar, e o texto novo ter ficado a seguir ao
antigo, em vez de o substituir.

**Importante**: esta correcção só impede duplicados a partir de agora —
o indicador que já ficou com a desagregação duplicada precisa de ser
corrigido manualmente uma vez: abre-o em "Editar indicador", no campo
"Desagregações" apaga tudo e escreve só `Mulheres, Jovens` (sem repetir),
e grava. A partir daí, mesmo que voltes a editar sem reparar, já não
duplica mais.
