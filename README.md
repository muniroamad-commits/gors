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
