/* ============================================================
   GORS - MOZCOMMUNITY — camada de dados (Firestore + Auth)
   Plataforma de monitoria de indicadores do projecto "Jobs, Social
   Cohesion and Community Resilience in Northern Mozambique - Phase I"
   (Banco Mundial, P514199).
   ============================================================ */

const ME = (() => {
  const VALUES = 'indicator_values';
  // Espelho público, sem notas nem quem submeteu — alimenta o relatório
  // público (acessível sem login). Só recebe dados quando um valor é
  // aprovado; nunca contém submissões pendentes ou rejeitadas.
  const VALUES_PUBLIC = 'indicator_values_public';
  const ADMINS = 'admins';
  // Catálogo de indicadores — vive no Firestore, não no código, para que
  // o Administrador geral consiga editar/adicionar indicadores a partir
  // do próprio painel, sem precisar de mexer em ficheiros. A lista abaixo
  // ("DEFAULT_INDICATORS") só é usada UMA VEZ, para semear a colecção
  // "indicators" quando ela ainda estiver vazia (primeira utilização).
  const INDICATORS_COL = 'indicators';

  // ---------- Catálogo por defeito (semente inicial do Quadro de Resultados) ----------
  // Fonte: PAD do projecto (Banco Mundial, P514199), secção "Results
  // Framework and Monitoring", com nomes revistos de acordo com o Quadro
  // de Resultados oficial fornecido pelo cliente. "targets" usa os mesmos
  // períodos do documento original; "baseline" é o valor de partida
  // (Maio/2026).
  const DEFAULT_INDICATORS = [
    // ---- Nível de Programa (PrDO) — todo o Norte, Fases I e II ----
    {
      id: 'prdo-localities',
      level: 'PrDO', component: null,
      name: 'Localidades que implementam processos participativos de planificação local',
      unit: 'Número', frequency: 'Semestral',
      responsible: 'ADIN, DITs',
      description: 'A meta reflecte o número de localidades, nas Fases I e II, onde os conselhos consultivos de localidade (representantes eleitos de deslocados internos, comunidades de acolhimento, retornados, homens, mulheres, jovens e pessoas com deficiência) identificam projectos comunitários, em colaboração com o governo distrital, usando a ferramenta de planeamento e orçamentação participativa.',
      dataSource: 'Relatórios de progresso',
      methodology: 'Revisão de relatórios de progresso de obras, actas de reuniões, e Planos de Desenvolvimento Local Distrital (DLDPs).',
      disaggregation: [],
      baseline: 0,
      targets: [
        { period: 'Mai/2027', value: 20 }, { period: 'Mai/2028', value: 30 },
        { period: 'Mai/2029', value: 80 }, { period: 'Mai/2030', value: 120 },
        { period: 'Mai/2031', value: 160 }, { period: 'Mai/2032', value: 180 },
        { period: 'Mai/2033', value: 200 }, { period: 'Mai/2034', value: 200 },
      ],
    },
    {
      id: 'prdo-jobs',
      level: 'PrDO', component: null,
      name: 'Empregos melhores e mais bem remunerados criados/beneficiados (CRI)',
      unit: 'Número', frequency: 'Semestral',
      responsible: 'DITs, PPTs, ADIN',
      description: 'A meta reflecte o número de pessoas, nas Fases I e II, beneficiadas por empregos de curto e médio/longo prazo resultantes do programa. Os empregos de curto prazo resultam da construção/reabilitação de infraestrutura (10.450 empregos), enquanto os de médio e longo prazo resultam de transferências monetárias a agregados vulneráveis (25.000), subvenções a empresas socioeconómicas (10.000), acções de qualificação de jovens nos SICs (2.500), e da operação de longo prazo dos subprojectos comunitários (600 empregos).',
      dataSource: 'Relatórios de progresso, visitas de campo',
      methodology: 'Revisão dos relatórios de progresso de obras, relatórios do programa de transferências monetárias, dos SICs e prestadores de serviços, e relatórios do prestador de serviços do programa de subvenções.',
      disaggregation: [],
      baseline: 0,
      targets: [
        { period: 'Mai/2027', value: 2500 }, { period: 'Mai/2028', value: 12000 },
        { period: 'Mai/2029', value: 17000 }, { period: 'Mai/2030', value: 25000 },
        { period: 'Mai/2031', value: 30000 }, { period: 'Mai/2032', value: 35000 },
        { period: 'Mai/2033', value: 40000 }, { period: 'Mai/2034', value: 48550 },
      ],
    },

    // ---- Nível de Projecto (PDO) — Áreas-alvo, Fase I ----
    {
      id: 'pdo-localities',
      level: 'PDO', component: null,
      name: 'Localidades que implementam processos participativos de planificação local (Áreas-alvo)',
      unit: 'Número', frequency: 'Trimestral',
      responsible: 'ADIN, DITs',
      description: 'Esta meta reflecte o número de localidades onde os comités consultivos de localidade (representantes eleitos de deslocados internos, comunidades de acolhimento, retornados, homens, mulheres, jovens e pessoas com deficiência) identificam projectos comunitários, em colaboração com o governo distrital, usando a ferramenta de planeamento e orçamentação participativa. As localidades são 80 localidades seleccionadas nas províncias de Niassa, Cabo Delgado e Nampula, nos 56 distritos destas províncias, excluindo as respectivas capitais.',
      dataSource: 'Relatórios de progresso',
      methodology: 'Revisão de relatórios de progresso de obras, actas de reuniões, e Planos de Desenvolvimento Local Distrital (DLDPs).',
      disaggregation: [],
      baseline: 0,
      targets: [
        { period: 'Mai/2027', value: 20 }, { period: 'Mai/2028', value: 30 },
        { period: 'Mai/2029', value: 45 }, { period: 'Mai/2030', value: 65 },
        { period: 'Jun/2031', value: 80 },
      ],
    },
    {
      id: 'pdo-jobs',
      level: 'PDO', component: null,
      name: 'Empregos melhores e mais bem remunerados criados/beneficiados — Áreas-alvo (CRI)',
      unit: 'Número', frequency: 'Semestral',
      responsible: 'DITs, PPTs, ADIN',
      description: 'A meta proposta reflecte o número de pessoas beneficiadas por empregos de curto e médio/longo prazo resultantes do projecto. Os empregos de curto prazo resultam da construção/reabilitação de infraestrutura (4.180 empregos), enquanto os de médio e longo prazo resultam de transferências monetárias (10.000), subvenções a empresas socioeconómicas (4.000), acções de qualificação de jovens nos SICs (1.000), e da operação de longo prazo dos subprojectos comunitários (240 empregos). Os empregos serão criados nas três províncias do norte de Moçambique, excluindo as respectivas capitais.',
      dataSource: 'Relatórios de progresso, visitas de campo',
      methodology: 'Revisão dos relatórios de progresso de obras, relatórios do programa de transferências monetárias, dos SICs e prestadores de serviços, e relatórios do prestador de serviços do programa de subvenções.',
      disaggregation: [],
      baseline: 0,
      targets: [
        { period: 'Mai/2027', value: 2500 }, { period: 'Mai/2028', value: 12000 },
        { period: 'Mai/2029', value: 17000 }, { period: 'Mai/2030', value: 18500 },
        { period: 'Jun/2031', value: 19420 },
      ],
    },
    {
      id: 'pdo-cri-infra',
      level: 'PDO', component: null,
      name: 'Pessoas beneficiadas por infra-estruturas resilientes ao clima (CRI)',
      unit: 'Número de pessoas', frequency: 'Trimestral',
      responsible: 'ANOP, ADIN, PPTs, DITs',
      description: 'A meta proposta reflecte pessoas beneficiadas por infraestrutura pública reabilitada ou nova (222.000) em dez distritos da província de Cabo Delgado, e por infraestrutura comunitária (560.000) em 80 localidades seleccionadas das províncias de Niassa, Cabo Delgado e Nampula. A meta para jovens (15-24 anos) reflecte 17% e a meta para mulheres reflecte 51% da população da Região Norte, segundo cálculos do Banco Mundial com dados de 2022 do Inquérito sobre Orçamento Familiar. O número de beneficiários de infraestrutura pública reflecte cerca de 15% da população dos dez distritos, e o número de beneficiários de infraestrutura comunitária reflecte 80 projectos beneficiando cerca de 7.000 pessoas por projecto, com base na população média das localidades na Região Norte.',
      dataSource: 'Relatórios de progresso',
      methodology: 'Revisão de relatórios de progresso de obras, visitas de campo.',
      disaggregation: ['Mulheres', 'Jovens'],
      baseline: 0,
      baselineDisagg: { 'Mulheres': 0, 'Jovens': 0 },
      targets: [
        { period: 'Mai/2027', value: 200000, disagg: { 'Mulheres': 100000, 'Jovens': 50000 } },
        { period: 'Mai/2028', value: 400000, disagg: { 'Mulheres': 200000, 'Jovens': 75000 } },
        { period: 'Mai/2029', value: 500000, disagg: { 'Mulheres': 250000, 'Jovens': 100000 } },
        { period: 'Mai/2030', value: 600000, disagg: { 'Mulheres': 300000, 'Jovens': 125000 } },
        { period: 'Jun/2031', value: 782000, disagg: { 'Mulheres': 399000, 'Jovens': 133750 } },
      ],
    },

    // ---- Componente 1: Fortalecimento da Colaboração Comunidades-Governo ----
    {
      id: 'c1-nrcf',
      level: 'Intermédio', component: 'Componente 1 — Colaboração Comunidades-Governo',
      name: 'Fórum Consultivo Regional do Norte (NRCF) operacional',
      unit: 'Sim/Não', frequency: 'Semestral',
      responsible: 'ADIN, MPD',
      description: 'Os membros do NRCF realizam pelo menos reuniões semestrais; publicam as actas e a lista de participantes; e monitoram a implementação das estratégias de desenvolvimento provincial.',
      dataSource: 'Relatórios de progresso',
      methodology: 'Revisão das actas das reuniões.',
      disaggregation: [],
      baseline: 'Não',
      targets: [
        { period: 'Mai/2027', value: 'Sim' },
        { period: 'Mai/2028', value: 'Sim' },
        { period: 'Mai/2029', value: 'Sim' },
        { period: 'Mai/2030', value: 'Sim' },
        { period: 'Jun/2031', value: 'Sim' },
      ],
      isYesNoIndicator: true,
    },
    {
      id: 'c1-observatorios',
      level: 'Intermédio', component: 'Componente 1 — Colaboração Comunidades-Governo',
      name: 'Observatórios Provinciais operacionais',
      unit: 'Número', frequency: 'Trimestral (1ª metade) / Semestral (2ª metade)',
      responsible: 'ADIN, PPTs',
      description: 'Reúnem pelo menos trimestralmente na primeira metade do projecto e pelo menos semestralmente na segunda metade; publicam actas e lista de participantes; e monitoram a implementação das estratégias de desenvolvimento distrital.',
      dataSource: 'Relatórios de progresso',
      methodology: 'Revisão das actas das reuniões.',
      disaggregation: [],
      baseline: 0,
      targets: [
        { period: 'Mai/2027', value: 3 }, { period: 'Mai/2028', value: 3 },
        { period: 'Mai/2029', value: 3 }, { period: 'Mai/2030', value: 3 },
        { period: 'Jun/2031', value: 3 },
      ],
    },
    {
      id: 'c1-conselhos',
      level: 'Intermédio', component: 'Componente 1 — Colaboração Comunidades-Governo',
      name: 'Conselhos Consultivos Distritais operacionais',
      unit: 'Número', frequency: 'Trimestral',
      responsible: 'ADIN, PPTs, DITs',
      description: 'Os novos são legalizados pela administração distrital; os novos e existentes reúnem-se pelo menos trimestralmente, publicando actas e listas de participantes; e monitorizam a implementação das actividades de localidade, incluindo os projectos comunitários emblemáticos.',
      dataSource: 'Relatórios de progresso',
      methodology: 'Revisão das actas das reuniões.',
      disaggregation: [],
      baseline: 0,
      targets: [
        { period: 'Mai/2027', value: 30 }, { period: 'Mai/2028', value: 40 },
        { period: 'Mai/2029', value: 45 }, { period: 'Mai/2030', value: 50 },
        { period: 'Jun/2031', value: 56 },
      ],
    },
    {
      id: 'c1-comites-localidade',
      level: 'Intermédio', component: 'Componente 1 — Colaboração Comunidades-Governo',
      name: 'Comités/Conselhos Consultivos das Localidades operacionais',
      unit: 'Número', frequency: 'Trimestral',
      responsible: 'ADIN, PPTs, DITs',
      description: 'Os conselhos consultivos (um por cada uma das 80 localidades-alvo) são compostos por representantes eleitos de deslocados internos, comunidades de acolhimento, retornados, homens, mulheres, jovens e pessoas com deficiência, que identificam os projectos emblemáticos.',
      dataSource: 'Relatórios de progresso',
      methodology: 'Revisão contínua da composição dos conselhos e das actas de reuniões, visitas de campo.',
      disaggregation: [],
      baseline: 0,
      targets: [
        { period: 'Mai/2027', value: 20 }, { period: 'Mai/2028', value: 40 },
        { period: 'Mai/2029', value: 60 }, { period: 'Mai/2030', value: 75 },
        { period: 'Jun/2031', value: 80 },
      ],
    },
    {
      id: 'c1-confianca',
      level: 'Intermédio', component: 'Componente 1 — Colaboração Comunidades-Governo',
      name: 'Beneficiários que reportam aumento de confiança entre membros da comunidade e entre comunidade e Estado',
      unit: 'Percentagem', frequency: 'Ano 1 do projecto, meio-termo e encerramento',
      responsible: 'ADIN',
      description: 'Este indicador mede o resultado de coesão social vertical (comunidades-Estado) e horizontal (dentro das comunidades). Inquéritos de base, de meio-termo e finais entre as comunidades das localidades participantes, nos 56 distritos, determinarão a confiança resultante das principais intervenções do projecto. Entre comunidades: acordo sobre os projectos comunitários a estabelecer. Entre comunidades e o Estado: subvenções a empresas de mulheres e jovens, apoio psicossocial e a vítimas de VBG, e qualificação de jovens.',
      dataSource: 'Inquéritos',
      methodology: 'Inquérito a uma amostra de beneficiários.',
      disaggregation: [],
      baseline: 0,
      targets: [
        { period: 'Mai/2028', value: 40 },
        { period: 'Jun/2031', value: 50 },
      ],
    },

    // ---- Componente 2: Oportunidades Económicas e Emprego ----
    {
      id: 'c2-cash-transfers',
      level: 'Intermédio', component: 'Componente 2 — Oportunidades Económicas e Emprego',
      name: 'Beneficiários das intervenções de transferências monetárias (CRI)',
      unit: 'Número de pessoas', frequency: 'Trimestral',
      responsible: 'ADIN',
      description: 'Este indicador mede o número de pessoas que participam no programa de transferências monetárias. A meta reflecte 10.000 agregados familiares nas três províncias do norte, com uma dimensão média de 5 pessoas por agregado. A meta para jovens (15-24 anos) reflecte 17% e a meta para mulheres reflecte 51% da população da Região Norte, segundo cálculos do Banco Mundial com dados de 2022 do Inquérito sobre Orçamento Familiar.',
      dataSource: 'Relatórios de progresso',
      methodology: 'Revisão das transacções realizadas.',
      disaggregation: ['Mulheres', 'Jovens'],
      baseline: 0,
      baselineDisagg: { 'Mulheres': 0, 'Jovens': 0 },
      targets: [
        { period: 'Mai/2028', value: 25000, disagg: { 'Mulheres': 12500, 'Jovens': 4250 } },
        { period: 'Mai/2029', value: 50000, disagg: { 'Mulheres': 25000, 'Jovens': 8500 } },
        { period: 'Mai/2030', value: 50000, disagg: { 'Mulheres': 25000, 'Jovens': 8500 } },
        { period: 'Jun/2031', value: 50000, disagg: { 'Mulheres': 25000, 'Jovens': 8500 } },
      ],
    },
    {
      id: 'c2-grants-mulheres',
      level: 'Intermédio', component: 'Componente 2 — Oportunidades Económicas e Emprego',
      name: 'Percentagem do valor total de subvenções atribuída a empresas de mulheres',
      unit: 'Percentagem', frequency: 'Trimestral',
      responsible: 'ADIN, PPTs, DITs',
      description: 'Percentagem do valor total das subvenções atribuídas a empresas de mulheres.',
      dataSource: 'Relatórios de progresso',
      methodology: 'Revisão dos relatórios do prestador de serviços.',
      disaggregation: [],
      baseline: 0,
      targets: [
        { period: 'Mai/2027', value: 25 }, { period: 'Mai/2028', value: 35 },
        { period: 'Mai/2029', value: 40 }, { period: 'Mai/2030', value: 45 },
        { period: 'Mai/2031', value: 50 },
      ],
    },
    {
      id: 'c2-grants-jovens',
      level: 'Intermédio', component: 'Componente 2 — Oportunidades Económicas e Emprego',
      name: 'Percentagem do valor total de subvenções atribuída a empresas de jovens e pessoas com deficiência',
      unit: 'Percentagem', frequency: 'Trimestral',
      responsible: 'ADIN, PPTs, DITs',
      description: 'Percentagem do valor total das subvenções atribuídas a empresas de jovens e de pessoas com deficiência.',
      dataSource: 'Relatórios de progresso',
      methodology: 'Revisão dos relatórios do prestador de serviços.',
      disaggregation: [],
      baseline: 0,
      targets: [
        { period: 'Mai/2027', value: 25 }, { period: 'Mai/2028', value: 35 },
        { period: 'Mai/2029', value: 40 }, { period: 'Mai/2030', value: 45 },
        { period: 'Mai/2031', value: 50 },
      ],
    },
    {
      id: 'c2-sics',
      level: 'Intermédio', component: 'Componente 2 — Oportunidades Económicas e Emprego',
      name: 'Jovens formados nos Centros de Incubação de Competências (SICs)',
      unit: 'Número', frequency: 'Trimestral',
      responsible: 'ADIN, PPTs',
      description: 'Número de jovens que recebem formação, mentoria, colocação profissional e/ou apoio ao desenvolvimento de negócios nos Centros de Incubação de Competências (SICs) apoiados pelo projecto.',
      dataSource: 'Relatórios de progresso, visitas de campo',
      methodology: 'Revisão dos relatórios dos SICs.',
      disaggregation: [],
      baseline: 0,
      targets: [
        { period: 'Mai/2028', value: 500 }, { period: 'Mai/2029', value: 1000 },
        { period: 'Mai/2030', value: 1500 }, { period: 'Mai/2031', value: 2000 },
      ],
    },
    {
      id: 'c2-gbv',
      level: 'Intermédio', component: 'Componente 2 — Oportunidades Económicas e Emprego',
      name: 'Beneficiários de acções de prevenção e resposta à VBG',
      unit: 'Número', frequency: 'Trimestral',
      responsible: 'ADIN, PPTs, DITs',
      description: 'Número de pessoas alcançadas com mensagens de sensibilização sobre VBG, saúde sexual e reprodutiva, saúde mental, GALS e outros programas de apoio psicossocial, nas três províncias do norte.',
      dataSource: 'Relatórios de progresso',
      methodology: 'Revisão dos relatórios do prestador de serviços, visitas de campo.',
      disaggregation: ['Mulheres (%)'],
      baseline: 0,
      baselineDisagg: { 'Mulheres (%)': 0 },
      targets: [
        { period: 'Mai/2027', value: 12500, disagg: { 'Mulheres (%)': 75 } },
        { period: 'Mai/2028', value: 35000, disagg: { 'Mulheres (%)': 80 } },
        { period: 'Mai/2029', value: 50000, disagg: { 'Mulheres (%)': 85 } },
        { period: 'Mai/2030', value: 85000, disagg: { 'Mulheres (%)': 85 } },
        { period: 'Mai/2031', value: 110000, disagg: { 'Mulheres (%)': 85 } },
      ],
    },

    // ---- Componente 3: Infraestrutura Resiliente ao Clima ----
    {
      id: 'c3-infra-comunitaria',
      level: 'Intermédio', component: 'Componente 3 — Infraestrutura Resiliente ao Clima',
      name: 'Infra-estruturas comunitárias resilientes ao clima reabilitadas/estabelecidas e operacionais',
      unit: 'Número', frequency: 'Trimestral',
      responsible: 'DITs, PPTs, ANOP',
      description: 'Conforme priorizado nos Planos de Desenvolvimento Local Distrital (DLDPs), nas 80 localidades seleccionadas.',
      dataSource: 'Relatórios de progresso',
      methodology: 'Revisão dos relatórios do empreiteiro, visitas de campo.',
      disaggregation: [],
      baseline: 0,
      targets: [
        { period: 'Mai/2028', value: 30 }, { period: 'Mai/2029', value: 50 },
        { period: 'Mai/2030', value: 75 }, { period: 'Jun/2031', value: 80 },
      ],
    },
    {
      id: 'c3-infra-publica',
      level: 'Intermédio', component: 'Componente 3 — Infraestrutura Resiliente ao Clima',
      name: 'Infra-estruturas públicas reabilitadas/construídas',
      unit: 'Número', frequency: 'Trimestral',
      responsible: 'PPTs, ANOP',
      description: 'Conforme acordado com o governo no âmbito do projecto NCRP, nos dez distritos de Cabo Delgado.',
      dataSource: 'Relatórios de progresso',
      methodology: 'Revisão dos relatórios do empreiteiro, visitas de campo.',
      disaggregation: [],
      baseline: 0,
      targets: [
        { period: 'Mai/2027', value: 10 }, { period: 'Mai/2028', value: 30 },
        { period: 'Mai/2029', value: 40 }, { period: 'Mai/2030', value: 40 },
        { period: 'Jun/2031', value: 40 },
      ],
    },

    // ---- Componente 4: Gestão do Projecto e Agenda de Aprendizagem ----
    {
      id: 'c4-roteiro-clima',
      level: 'Intermédio', component: 'Componente 4 — Gestão do Projecto e Aprendizagem',
      name: 'Roteiro de financiamento climático para a Direcção Nacional de Finanças Climáticas do MPD elaborado',
      unit: 'Sim/Não', frequency: 'Anual',
      responsible: 'MPD, Direcção Nacional de Financiamento Climático',
      description: 'O roteiro especificará as acções necessárias para assegurar financiamento climático para a região norte, de modo a reforçar ainda mais a resiliência comunitária.',
      dataSource: 'Relatórios de progresso',
      methodology: 'Revisão do roteiro.',
      disaggregation: [],
      baseline: 'Não',
      isYesNoIndicator: true,
      targets: [
        { period: 'Mai/2027', value: 'Sim' }, { period: 'Mai/2028', value: 'Sim' },
        { period: 'Mai/2029', value: 'Sim' }, { period: 'Mai/2030', value: 'Sim' },
        { period: 'Jun/2031', value: 'Sim' },
      ],
    },
    {
      id: 'c4-reclamacoes',
      level: 'Intermédio', component: 'Componente 4 — Gestão do Projecto e Aprendizagem',
      name: 'Beneficiários que reportam que as suas reclamações relacionadas ao projecto foram tratadas',
      unit: 'Percentagem', frequency: 'Meio-termo e encerramento',
      responsible: 'ADIN, PPTs',
      description: 'Com base num inquérito a realizar no meio-termo e no encerramento do projecto.',
      dataSource: 'Questionário aos beneficiários',
      methodology: 'Inquéritos de meio-termo e de encerramento, realizados por uma entidade terceira.',
      disaggregation: [],
      baseline: 0,
      targets: [
        { period: 'Mai/2028', value: 60 },
        { period: 'Jun/2031', value: 75 },
      ],
    },
  ];

  let indicatorsCache = null; // cache em memória, invalidada após criar/editar/apagar

  async function ensureSeeded() {
    const snap = await db.collection(INDICATORS_COL).limit(1).get();
    if (!snap.empty) return;
    // Colecção vazia — primeira utilização: semeia com o catálogo por
    // defeito, um documento por indicador (ID do documento = id do
    // indicador), incluindo um campo "order" para manter a ordenação
    // original do Quadro de Resultados.
    // Só o Administrador geral tem permissão para escrever aqui — se for
    // outra pessoa (ou o relatório público, sem login) a carregar a
    // página pela primeira vez, a escrita falha silenciosamente e a
    // leitura simplesmente devolve uma lista vazia até o administrador
    // geral entrar pelo menos uma vez (ver README, "Arranque inicial").
    try {
      const batch = db.batch();
      DEFAULT_INDICATORS.forEach((ind, i) => {
        const ref = db.collection(INDICATORS_COL).doc(ind.id);
        batch.set(ref, { ...ind, order: i });
      });
      await batch.commit();
    } catch (err) {
      console.warn('Não foi possível semear o catálogo de indicadores (normal se não fores o Administrador geral):', err.message);
    }
  }

  async function getIndicators() {
    if (indicatorsCache) return indicatorsCache.slice();
    await ensureSeeded();
    const snap = await db.collection(INDICATORS_COL).get();
    const list = snap.docs.map(d => d.data());
    list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    indicatorsCache = list;
    return list.slice();
  }

  async function getIndicator(id) {
    const list = await getIndicators();
    return list.find(i => i.id === id) || null;
  }

  function invalidateIndicatorsCache() {
    indicatorsCache = null;
  }

  function slugify(text) {
    return (text || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 60);
  }

  // Criar ou editar um indicador — exclusivo do Administrador geral.
  async function upsertIndicator(indicatorData) {
    const admin = getCurrentAdminSync();
    if (!admin || admin.noProfile) throw new Error('A tua conta não tem permissões configuradas.');
    if (admin.role !== 'admin') throw new Error('Só o Administrador geral pode criar ou editar indicadores.');

    if (!indicatorData.name || !indicatorData.name.trim()) throw new Error('Indique o nome do indicador.');
    if (!indicatorData.level) throw new Error('Indique o nível do indicador.');
    if (!indicatorData.targets || !indicatorData.targets.length) throw new Error('Indique pelo menos uma meta.');

    let id = indicatorData.id;
    let order = indicatorData.order;
    if (!id) {
      // Novo indicador: gera um ID a partir do nome e coloca-o no fim da lista.
      id = slugify(indicatorData.name) || `indicador-${Date.now()}`;
      const existing = await db.collection(INDICATORS_COL).doc(id).get();
      if (existing.exists) id = `${id}-${Date.now().toString().slice(-5)}`;
      const all = await getIndicators();
      order = all.length;
    }

    const doc = { ...indicatorData, id, order };
    delete doc._isNew;
    await db.collection(INDICATORS_COL).doc(id).set(doc);
    invalidateIndicatorsCache();
    return id;
  }

  // Apagar um indicador — exclusivo do Administrador geral. Não apaga as
  // submissões já feitas para ele (ficam associadas a um indicador que já
  // não existe no catálogo — o histórico não se perde).
  async function deleteIndicator(id) {
    const admin = getCurrentAdminSync();
    if (!admin || admin.role !== 'admin') throw new Error('Só o Administrador geral pode apagar indicadores.');
    await db.collection(INDICATORS_COL).doc(id).delete();
    invalidateIndicatorsCache();
  }

  // Move um indicador uma posição para cima ou para baixo na lista
  // completa (não filtrada) do catálogo, trocando o campo "order" com o
  // vizinho imediato. Útil para colocar um indicador recém-criado junto
  // de outro relacionado (ex: um novo indicador de Componente 2 a seguir
  // ao indicador de VBG existente).
  async function moveIndicator(id, direction) {
    const admin = getCurrentAdminSync();
    if (!admin || admin.role !== 'admin') throw new Error('Só o Administrador geral pode reordenar indicadores.');

    const all = await getIndicators(); // já vem ordenada por "order"
    const index = all.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Indicador não encontrado.');
    const neighborIndex = direction === 'up' ? index - 1 : index + 1;
    if (neighborIndex < 0 || neighborIndex >= all.length) return; // já está na ponta, não faz nada

    const current = all[index];
    const neighbor = all[neighborIndex];
    const currentOrder = current.order ?? index;
    const neighborOrder = neighbor.order ?? neighborIndex;

    const batch = db.batch();
    batch.update(db.collection(INDICATORS_COL).doc(current.id), { order: neighborOrder });
    batch.update(db.collection(INDICATORS_COL).doc(neighbor.id), { order: currentOrder });
    await batch.commit();
    invalidateIndicatorsCache();
  }

  function getComponents() {
    return [
      'Componente 1 — Colaboração Comunidades-Governo',
      'Componente 2 — Oportunidades Económicas e Emprego',
      'Componente 3 — Infraestrutura Resiliente ao Clima',
      'Componente 4 — Gestão do Projecto e Aprendizagem',
    ];
  }
  function getLevels() {
    return ['PrDO', 'PDO', 'Intermédio'];
  }

  // ---------- Localização (para etiquetar submissões e filtrar relatórios) ----------
  const LOCATIONS = {
    'Cabo Delgado': ['Ancuabe', 'Balama', 'Chiúre', 'Ibo', 'Macomia', 'Mecúfi', 'Meluco', 'Metuge', 'Mocímboa da Praia', 'Montepuez', 'Mueda', 'Muidumbe', 'Namuno', 'Nangade', 'Palma', 'Pemba (cidade)', 'Quissanga'],
    'Nampula': ['Angoche', 'Eráti', 'Ilha de Moçambique', 'Lalaua', 'Larde', 'Liúpo', 'Malema', 'Meconta', 'Mecubúri', 'Memba', 'Mogincual', 'Mogovolas', 'Moma', 'Monapo', 'Mossuril', 'Muecate', 'Murrupula', 'Nacala-a-Velha', 'Nacala Porto', 'Nacarôa', 'Nampula (cidade)', 'Rapale', 'Ribaué'],
    'Niassa': ['Chimbonila', 'Cuamba', 'Lago', 'Lichinga (cidade)', 'Majune', 'Mandimba', 'Marrupa', 'Maúa', 'Mavago', 'Mecanhelas', 'Mecula', 'Metarica', 'Muembe', 'Ngauma', 'Nipepe', 'Sanga'],
  };
  function getProvinces() {
    return Object.keys(LOCATIONS).sort((a, b) => a.localeCompare(b, 'pt'));
  }
  function getDistricts(province) {
    return (LOCATIONS[province] || []).slice().sort((a, b) => a.localeCompare(b, 'pt'));
  }

  // Categorias de estatuto do beneficiário, tal como descritas no PAD
  // (deslocados internos, comunidades de acolhimento, retornados).
  const BENEFICIARY_STATUSES = ['Deslocados', 'Retornados', 'Anfitriões'];
  function getBeneficiaryStatuses() {
    return BENEFICIARY_STATUSES.slice();
  }

  // ---------- Períodos de reporte, de acordo com a periodicidade real ----------
  // Cobre a duração do programa (2026-2034). Para indicadores com
  // periodicidade regular (trimestral, semestral, anual, bienal), gera a
  // lista completa de períodos possíveis — não só os pontos de meta.
  // Para frequências baseadas em marcos (ex: "meio-termo e encerramento"),
  // que não seguem uma cadência regular, usa os períodos definidos nas
  // próprias metas.
  const PROJECT_START_YEAR = 2026;
  const PROJECT_END_YEAR = 2034;

  function yearsRange(step = 1) {
    const out = [];
    for (let y = PROJECT_START_YEAR; y <= PROJECT_END_YEAR; y += step) out.push(y);
    return out;
  }

  // Devolve como o formulário de submissão deve pedir o período, separado
  // em "Ano" + "Período dentro do ano" sempre que a periodicidade for
  // regular. Para frequências por marcos (que não seguem uma cadência
  // regular, ex: "meio-termo e encerramento"), devolve um único campo com
  // os períodos definidos nas próprias metas.
  function getSubmissionPeriodFields(indicator) {
    const freq = (indicator.frequency || '').trim();
    if (freq === 'Trimestral') {
      return { mode: 'year+sub', years: yearsRange(), subLabel: 'Trimestre', subOptions: ['T1', 'T2', 'T3', 'T4'] };
    }
    if (freq === 'Semestral') {
      return { mode: 'year+sub', years: yearsRange(), subLabel: 'Semestre', subOptions: ['1º Semestre', '2º Semestre'] };
    }
    if (freq === 'Anual') {
      return { mode: 'year-only', years: yearsRange() };
    }
    if (freq === 'Bienal') {
      return { mode: 'year-only', years: yearsRange(2), biennial: true };
    }
    return { mode: 'fixed', options: indicator.targets.map(t => t.period) };
  }

  function combinePeriod(fields, year, sub) {
    if (fields.mode === 'year+sub') return `${sub} ${year}`;
    if (fields.mode === 'year-only') return fields.biennial ? `${year}–${year + 1}` : String(year);
    return sub; // 'fixed' mode: o próprio valor já é o período completo
  }

  // Devolve uma chave numérica para ordenar cronologicamente rótulos de
  // período em vários formatos ("Mai/2027", "T1 2026", "1º Semestre 2026",
  // "2026", "2026–2027"). Usado para desenhar o gráfico de resultados.
  function periodSortKey(period) {
    const MONTHS = { Jan: 1, Fev: 2, Mar: 3, Abr: 4, Mai: 5, Jun: 6, Jul: 7, Ago: 8, Set: 9, Out: 10, Nov: 11, Dez: 12 };
    let m;
    if ((m = period.match(/^([A-Za-zçÇ]{3})\/(\d{4})$/))) return Number(m[2]) * 100 + (MONTHS[m[1]] || 1);
    if ((m = period.match(/^T(\d) (\d{4})$/))) return Number(m[2]) * 100 + (Number(m[1]) * 3 - 2);
    if ((m = period.match(/^(1|2)º Semestre (\d{4})$/))) return Number(m[2]) * 100 + (m[1] === '1' ? 1 : 7);
    if ((m = period.match(/^(\d{4})–(\d{4})$/))) return Number(m[1]) * 100 + 1;
    if ((m = period.match(/^(\d{4})$/))) return Number(m[1]) * 100 + 1;
    return 999999;
  }

  // ---------- Utilitários ----------
  function nowIso() { return new Date().toISOString(); }

  // ---------- Anexos (evidência de cada submissão) ----------
  const MAX_FILES = 2;
  const MAX_FILE_BYTES = 200 * 1024; // ~200KB por ficheiro

  function filesToEvidence(fileList) {
    const files = Array.from(fileList || []).slice(0, MAX_FILES);
    const tooBig = files.filter(f => f.size > MAX_FILE_BYTES);
    const usable = files.filter(f => f.size <= MAX_FILE_BYTES);
    const readers = usable.map(file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ name: file.name, type: file.type, size: file.size, dataUrl: reader.result });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    }));
    return Promise.all(readers).then(evidence => ({ evidence, skipped: tooBig.map(f => f.name) }));
  }

  // ---------- Submissão e aprovação de valores ----------
  async function submitValue(payload, fileList) {
    const admin = getCurrentAdminSync();
    if (!admin || admin.noProfile) throw new Error('A tua conta não tem permissões configuradas.');
    if (admin.role === 'readonly') throw new Error('A tua conta tem acesso apenas de leitura.');

    const indicator = await getIndicator(payload.indicator_id);
    if (!indicator) throw new Error('Indicador não encontrado.');
    if (!payload.period) throw new Error('Indique o período a que este valor se refere.');
    if (payload.value === '' || payload.value === undefined || payload.value === null) {
      throw new Error('Indique o valor do indicador.');
    }
    if (!payload.note || !payload.note.trim()) {
      throw new Error('Descreve o resumo do processo — este campo é obrigatório.');
    }
    if (!payload.province) throw new Error('Indique a província.');
    if (!payload.district) throw new Error('Indique o distrito.');
    if (!fileList || !fileList.length) throw new Error('Anexa pelo menos um ficheiro de evidência.');
    if ((indicator.disaggregation || []).length) {
      const missingDisagg = indicator.disaggregation.filter(d => !payload.disagg || payload.disagg[d] === undefined || payload.disagg[d] === null || payload.disagg[d] === '');
      if (missingDisagg.length) throw new Error(`Preenche a desagregação: ${missingDisagg.join(', ')}.`);
    }
    // Desagregação por estatuto de beneficiário só se aplica a
    // indicadores que contam pessoas (os que já têm desagregação por
    // género/idade definida no catálogo) — não faz sentido, por exemplo,
    // num indicador que conta localidades ou infra-estruturas.
    if ((indicator.disaggregation || []).length) {
      const requiredStatuses = getBeneficiaryStatuses();
      const missingStatus = requiredStatuses.filter(s => !payload.status_disagg || payload.status_disagg[s] === undefined || payload.status_disagg[s] === null || payload.status_disagg[s] === '');
      if (missingStatus.length) throw new Error(`Preenche a desagregação por estatuto: ${missingStatus.join(', ')}.`);
    }

    const { evidence, skipped } = await filesToEvidence(fileList);
    const timestamp = nowIso();

    const doc = {
      indicator_id: payload.indicator_id,
      indicator_name: indicator.name,
      component: indicator.component,
      period: payload.period,
      value: payload.value,
      disagg: payload.disagg || null,
      status_disagg: payload.status_disagg || null,
      province: payload.province || null,
      district: payload.district || null,
      note: payload.note || null,
      evidence,
      status: 'submetido', // submetido | aprovado | rejeitado
      submitted_by: admin.name,
      submitted_by_uid: admin.uid,
      submitted_at: timestamp,
      reviewed_by: null,
      reviewed_at: null,
      review_note: null,
    };

    const ref = await db.collection(VALUES).add(doc);

    // Notificação por email aos Administradores geral — usa a extensão
    // oficial do Firebase "Trigger Email" (ver README, secção
    // "Notificações"). Se a extensão ainda não estiver instalada, este
    // documento fica só à espera; não impede a submissão de funcionar.
    try {
      const adminsSnap = await db.collection(ADMINS).where('role', '==', 'admin').get();
      const adminEmails = adminsSnap.docs.map(d => d.data().email).filter(Boolean);
      if (adminEmails.length) {
        const link = `${window.location.origin}${window.location.pathname.replace(/[^/]*$/, '')}indicador.html?id=${encodeURIComponent(payload.indicator_id)}`;
        await db.collection('mail').add({
          to: adminEmails,
          message: {
            subject: `Novo valor a aguardar aprovação — ${indicator.name}`,
            html: `
              <p>Foi submetido um novo valor que aguarda a tua aprovação.</p>
              <p><strong>Indicador:</strong> ${indicator.name}</p>
              <p><strong>Período:</strong> ${payload.period}</p>
              <p><strong>Valor submetido:</strong> ${payload.value}</p>
              <p><strong>Submetido por:</strong> ${admin.name} (${admin.email})</p>
              <p><strong>Resumo do processo:</strong> ${payload.note}</p>
              <p><a href="${link}">Ver detalhes, histórico e evidência na plataforma</a></p>
            `,
          },
        });
      }
    } catch (err) {
      console.warn('Não foi possível preparar a notificação por email:', err.message);
    }

    return { id: ref.id, skipped };
  }

  // Subscreve, em tempo real, o número de valores à espera de aprovação —
  // usado pelo sino de notificações no topo de cada página. Devolve uma
  // função para cancelar a subscrição (chamar ao sair da página, se
  // relevante).
  function subscribePendingCount(callback) {
    return db.collection(VALUES).where('status', '==', 'submetido')
      .onSnapshot(
        snap => callback(snap.size),
        err => console.warn('Notificações em tempo real indisponíveis:', err.message)
      );
  }

  async function listValues(filters = {}) {
    let query = db.collection(VALUES);
    if (filters.status) query = query.where('status', '==', filters.status);
    if (filters.indicator_id) query = query.where('indicator_id', '==', filters.indicator_id);
    const snap = await query.get();
    let rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (filters.component) rows = rows.filter(r => r.component === filters.component);
    return rows.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
  }

  // Só valores APROVADOS contam como "oficiais" para o painel/relatório.
  async function listApprovedValues(indicatorId) {
    const snap = await db.collection(VALUES)
      .where('indicator_id', '==', indicatorId)
      .where('status', '==', 'aprovado')
      .get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  // Valor actual de um indicador = soma de TODOS os valores aprovados,
  // para indicadores numéricos (cada submissão representa um incremento
  // reportado, ex: mais X pessoas beneficiadas nesse período). Para
  // indicadores de texto ou Sim/Não, não faz sentido somar — usa-se o
  // valor aprovado mais recente.
  function computeCurrentValue(ind, approvedRows) {
    const isNumeric = !ind.isTextIndicator && !ind.isYesNoIndicator;
    if (!approvedRows.length) return { value: null, isSum: isNumeric, period: null };
    if (isNumeric) {
      const sum = approvedRows.reduce((acc, v) => acc + (isNaN(Number(v.value)) ? 0 : Number(v.value)), 0);
      return { value: sum, isSum: true, period: null };
    }
    const sorted = approvedRows.slice().sort((a, b) => new Date(b.submitted_at || b.updated_at) - new Date(a.submitted_at || a.updated_at));
    return { value: sorted[0].value, isSum: false, period: sorted[0].period };
  }

  // Classifica o estágio de um indicador face às suas metas:
  // - 'alcancada'  → já atingiu ou ultrapassou a meta final
  // - 'atraso'     → já passou pelo menos uma meta-marco (checkpoint) e
  //                  o valor actual ainda está abaixo dela
  // - 'prazo'      → ainda dentro do previsto (nenhuma meta-marco já
  //                  passada, ou já cumpriu a mais recente que passou)
  // - null         → não classificável (indicador de texto, ou sem metas
  //                  numéricas/Sim-Não definidas)
  // Converte um rótulo de período (ex: "Mai/2027", "T1 2026", "1º
  // Semestre 2026", "2026", "2026–2027") na data-limite real para esse
  // período: o último dia do mês que o período representa, mais 15 dias
  // de tolerância. Devolve null para períodos que não seguem um
  // calendário reconhecível (ex: rótulos por marcos como "Ano 1 do
  // projecto, meio-termo e encerramento").
  function getPeriodDeadline(period) {
    const MONTHS = { Jan: 1, Fev: 2, Mar: 3, Abr: 4, Mai: 5, Jun: 6, Jul: 7, Ago: 8, Set: 9, Out: 10, Nov: 11, Dez: 12 };
    let year, month, m;
    if ((m = period.match(/^([A-Za-zçÇ]{3})\/(\d{4})$/))) { month = MONTHS[m[1]]; year = Number(m[2]); }
    else if ((m = period.match(/^T(\d) (\d{4})$/))) { month = Number(m[1]) * 3; year = Number(m[2]); }
    else if ((m = period.match(/^(1|2)º Semestre (\d{4})$/))) { month = m[1] === '1' ? 6 : 12; year = Number(m[2]); }
    else if ((m = period.match(/^(\d{4})–(\d{4})$/))) { month = 12; year = Number(m[2]); }
    else if ((m = period.match(/^(\d{4})$/))) { month = 12; year = Number(m[1]); }
    else return null;

    const endOfMonth = new Date(year, month, 0); // dia 0 do mês seguinte = último dia do mês "month"
    const deadline = new Date(endOfMonth);
    deadline.setDate(deadline.getDate() + 15);
    return deadline;
  }

  // Classifica o estágio de um indicador face às suas metas, usando datas
  // reais (não apenas o mês/ano) — uma meta só conta como "em atraso" se
  // já tiver passado 15 dias do fim do mês a que se refere, e o valor
  // actual ainda não a tiver atingido.
  // - 'alcancada'  → já atingiu ou ultrapassou a meta final
  // - 'atraso'     → já passou o prazo (fim do mês + 15 dias) de pelo
  //                  menos uma meta-marco, e o valor actual está abaixo dela
  // - 'prazo'      → ainda dentro do previsto (nenhum prazo vencido, ou
  //                  já cumpriu o mais recente que venceu)
  // - null         → não classificável (indicador de texto, sem metas, ou
  //                  períodos que não seguem um calendário reconhecível)
  function classifyStage(ind, currentValue) {
    const isNumeric = !ind.isTextIndicator && !ind.isYesNoIndicator;
    if (ind.isTextIndicator) return null;
    if (!ind.targets || !ind.targets.length) return null;

    const finalTarget = ind.targets[ind.targets.length - 1];
    const now = new Date();

    const overdue = ind.targets
      .map(t => ({ ...t, deadline: getPeriodDeadline(t.period) }))
      .filter(t => t.deadline && now > t.deadline);

    if (isNumeric) {
      if (currentValue !== null && typeof finalTarget.value === 'number' && currentValue >= finalTarget.value) return 'alcancada';
      if (!overdue.length) return 'prazo';
      const mostRecent = overdue.reduce((a, b) => (b.deadline > a.deadline ? b : a));
      const value = currentValue || 0;
      return value >= mostRecent.value ? 'prazo' : 'atraso';
    }

    // Sim/Não: compara o valor mais recente com a meta do checkpoint mais
    // recente já vencido (ex: já devia ser "Sim" a partir de determinada data).
    if (currentValue !== null && currentValue === finalTarget.value) return 'alcancada';
    if (!overdue.length) return 'prazo';
    const mostRecent = overdue.reduce((a, b) => (b.deadline > a.deadline ? b : a));
    if (currentValue === null) return 'atraso';
    return currentValue === mostRecent.value ? 'prazo' : 'atraso';
  }

  async function reviewValue(valueId, { approve, review_note }) {
    const admin = getCurrentAdminSync();
    if (!admin || admin.noProfile) throw new Error('A tua conta não tem permissões configuradas.');
    if (admin.role !== 'admin') throw new Error('Só o Administrador geral pode aprovar ou rejeitar valores.');

    const ref = db.collection(VALUES).doc(valueId);
    const snap = await ref.get();
    if (!snap.exists) throw new Error('Registo não encontrado.');
    const record = snap.data();
    const timestamp = nowIso();

    await ref.update({
      status: approve ? 'aprovado' : 'rejeitado',
      reviewed_by: admin.name,
      reviewed_at: timestamp,
      review_note: review_note || null,
    });

    if (approve) {
      // Espelho público: uma entrada por indicador+período+localização (a
      // mais recente aprovação substitui a anterior para a mesma
      // combinação, se voltar a ser revista).
      const geoKey = `${record.province || 'geral'}__${record.district || 'geral'}`;
      const publicId = `${record.indicator_id}__${record.period}__${geoKey}`.replace(/[\/\s()]+/g, '_');
      await db.collection(VALUES_PUBLIC).doc(publicId).set({
        indicator_id: record.indicator_id,
        indicator_name: record.indicator_name,
        component: record.component,
        period: record.period,
        value: record.value,
        disagg: record.disagg || null,
        status_disagg: record.status_disagg || null,
        province: record.province || null,
        district: record.district || null,
        updated_at: timestamp,
      });
    }
  }

  // Progresso público (sem login) — só valores já aprovados, sem nomes,
  // notas ou evidências.
  async function listPublicValues(indicatorId) {
    let query = db.collection(VALUES_PUBLIC);
    if (indicatorId) query = query.where('indicator_id', '==', indicatorId);
    const snap = await query.get();
    return snap.docs.map(d => d.data());
  }

  async function deleteValue(valueId) {
    const admin = getCurrentAdminSync();
    if (!admin || admin.role !== 'admin') throw new Error('Só o Administrador geral pode apagar registos.');
    await db.collection(VALUES).doc(valueId).delete();
  }

  // Apaga TODOS os valores submetidos/aprovados/rejeitados de TODOS os
  // indicadores, e o respectivo espelho público — exclusivo do
  // Administrador geral. Não apaga o catálogo de indicadores em si, só os
  // valores já reportados. Acção irreversível.
  async function resetAllValues() {
    const admin = getCurrentAdminSync();
    if (!admin || admin.role !== 'admin') throw new Error('Só o Administrador geral pode zerar todos os valores.');

    const [valuesSnap, publicSnap] = await Promise.all([
      db.collection(VALUES).get(),
      db.collection(VALUES_PUBLIC).get(),
    ]);
    const allDocs = [...valuesSnap.docs, ...publicSnap.docs];
    for (let i = 0; i < allDocs.length; i += 450) {
      const batch = db.batch();
      allDocs.slice(i, i + 450).forEach(d => batch.delete(d.ref));
      await batch.commit();
    }
    return valuesSnap.size;
  }

  // ---------- Autenticação administrativa (Firebase Auth + perfis/roles) ----------
  let cachedProfile = null;

  async function loadProfile(user) {
    if (!user) { cachedProfile = null; return null; }
    const snap = await db.collection(ADMINS).doc(user.uid).get();
    if (!snap.exists) {
      cachedProfile = { uid: user.uid, email: user.email, name: user.email.split('@')[0], role: null, noProfile: true };
      return cachedProfile;
    }
    const data = snap.data();
    // Auto-correcção: se o perfil no Firestore não tiver o campo "email"
    // (ex: o primeiro administrador, criado manualmente no arranque
    // inicial, só com "role" e "name"), grava-o agora a partir da conta
    // de autenticação — necessário para as notificações por email
    // encontrarem para onde enviar.
    if (!data.email && user.email) {
      db.collection(ADMINS).doc(user.uid).set({ email: user.email }, { merge: true }).catch(() => {});
      data.email = user.email;
    }
    cachedProfile = {
      uid: user.uid,
      email: user.email,
      name: data.name || user.email.split('@')[0],
      role: data.role, // 'admin' | 'submitter' | 'readonly'
      noProfile: false,
    };
    return cachedProfile;
  }

  async function adminLogin(email, password) {
    const cred = await auth.signInWithEmailAndPassword(email, password);
    return loadProfile(cred.user);
  }
  function adminLogout() {
    cachedProfile = null;
    return auth.signOut();
  }
  function getCurrentAdminSync() {
    return cachedProfile;
  }
  function onAuthChange(callback) {
    return auth.onAuthStateChanged(async user => callback(await loadProfile(user)));
  }
  async function changeAdminPassword(currentPassword, newPassword) {
    const user = auth.currentUser;
    if (!user) throw new Error('Sessão inválida.');
    const cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
    await user.reauthenticateWithCredential(cred);
    await user.updatePassword(newPassword);
  }

  async function listAdminUsers() {
    const snap = await db.collection(ADMINS).get();
    return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
  }
  async function upsertAdminUser(uid, { name, role, email }) {
    if (!uid || !uid.trim()) throw new Error('Indique o User UID (Firebase Console → Authentication → Users).');
    if (!['admin', 'submitter', 'readonly'].includes(role)) throw new Error('Nível de acesso inválido.');
    await db.collection(ADMINS).doc(uid.trim()).set({
      name: name || null, email: email || null, role, updated_at: nowIso(),
    }, { merge: true });
  }
  async function removeAdminUser(uid) {
    await db.collection(ADMINS).doc(uid).delete();
  }

  return {
    getIndicators, getIndicator, getComponents, getLevels, getSubmissionPeriodFields, combinePeriod, periodSortKey,
    upsertIndicator, deleteIndicator, moveIndicator,
    getProvinces, getDistricts, getBeneficiaryStatuses,
    submitValue, listValues, listApprovedValues, computeCurrentValue, classifyStage, getPeriodDeadline, reviewValue, deleteValue, resetAllValues, listPublicValues, subscribePendingCount,
    adminLogin, adminLogout, onAuthChange, getCurrentAdminSync, changeAdminPassword,
    listAdminUsers, upsertAdminUser, removeAdminUser,
  };
})();
