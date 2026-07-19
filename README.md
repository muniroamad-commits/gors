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
