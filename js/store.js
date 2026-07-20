/* ============================================================
   M&E MozCommunity — camada de dados (Firestore + Auth)
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

  // ---------- Catálogo de indicadores (Quadro de Resultados) ----------
  // Fonte: PAD do projecto (Banco Mundial, P514199), secção "Results
  // Framework and Monitoring". "targets" usa os mesmos períodos do
  // documento original; "baseline" é o valor de partida (Maio/2026).
  const INDICATORS = [
    // ---- Nível de Programa (PrDO) — todo o Norte, Fases I e II ----
    {
      id: 'prdo-localities',
      level: 'PrDO', component: null,
      name: 'Localidades a implementar processos de planeamento local participativo',
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
      name: 'Mais e melhores empregos (CRI)',
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
      name: 'Localidades a implementar processos de planeamento local participativo (Áreas-alvo)',
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
      name: 'Mais e melhores empregos — Áreas-alvo (CRI)',
      unit: 'Número', frequency: 'Trimestral',
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
      name: 'Pessoas beneficiadas por infraestrutura resiliente ao clima (CRI)',
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
      name: 'Fórum Regional Consultivo do Norte (NRCF) operacional',
      unit: 'Texto (sim/estado)', frequency: 'Semestral',
      responsible: 'ADIN, MPD',
      description: 'Os membros do NRCF realizam pelo menos reuniões semestrais; publicam as actas e a lista de participantes; e monitoram a implementação das estratégias de desenvolvimento provincial.',
      dataSource: 'Relatórios de progresso',
      methodology: 'Revisão das actas das reuniões.',
      disaggregation: [],
      baseline: 'Termos de Referência preparados pela ADIN, aprovação formal do Conselho de Ministros',
      targets: [
        { period: 'Mai/2027', value: 'Reuniões semestrais, actas e lista de participantes publicadas' },
        { period: 'Mai/2028', value: 'Reuniões semestrais, actas e lista de participantes publicadas' },
        { period: 'Mai/2029', value: 'Reuniões semestrais, actas e lista de participantes publicadas' },
        { period: 'Mai/2030', value: 'Reuniões semestrais, actas e lista de participantes publicadas' },
        { period: 'Jun/2031', value: 'Reuniões semestrais, actas e lista de participantes publicadas' },
      ],
      isTextIndicator: true,
    },
    {
      id: 'c1-observatorios',
      level: 'Intermédio', component: 'Componente 1 — Colaboração Comunidades-Governo',
      name: 'Observatórios provinciais operacionais',
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
      name: 'Conselhos Consultivos distritais operacionais',
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
      name: 'Comités consultivos de localidade operacionais',
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
      name: 'Beneficiários que reportam maior confiança entre a comunidade e com o Estado',
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
      name: 'Beneficiários de transferências monetárias (CRI)',
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
      name: 'Subvenções a pequenas e médias empresas de mulheres',
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
      name: 'Subvenções a pequenas e médias empresas de jovens e pessoas com deficiência',
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
        { period: 'Mai/2028', value: 5000 }, { period: 'Mai/2029', value: 1000 },
        { period: 'Mai/2030', value: 1500 }, { period: 'Mai/2031', value: 2000 },
      ],
    },
    {
      id: 'c2-gbv',
      level: 'Intermédio', component: 'Componente 2 — Oportunidades Económicas e Emprego',
      name: 'Beneficiários de acções para acabar com a VBG',
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
      name: 'Infraestrutura comunitária resiliente ao clima reabilitada/criada e operacional',
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
      name: 'Infraestrutura pública reabilitada/construída',
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
      name: 'Roteiro de financiamento climático desenvolvido para a Direcção Nacional de Financiamento Climático do MPD',
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
      name: 'Beneficiários que reportam que as suas reclamações relacionadas com o projecto foram resolvidas',
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

  function getIndicators() {
    return INDICATORS.slice();
  }
  function getIndicator(id) {
    return INDICATORS.find(i => i.id === id) || null;
  }
  function getComponents() {
    const set = new Set(INDICATORS.map(i => i.component).filter(Boolean));
    return Array.from(set);
  }
  function getLevels() {
    return ['PrDO', 'PDO', 'Intermédio'];
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

    const indicator = getIndicator(payload.indicator_id);
    if (!indicator) throw new Error('Indicador não encontrado.');
    if (!payload.period) throw new Error('Indique o período a que este valor se refere.');
    if (payload.value === '' || payload.value === undefined || payload.value === null) {
      throw new Error('Indique o valor do indicador.');
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
    return { id: ref.id, skipped };
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
      // Espelho público: uma entrada por indicador+período (a mais
      // recente aprovação substitui a anterior, se voltar a ser revista).
      const publicId = `${record.indicator_id}__${record.period}`.replace(/[\/\s]+/g, '_');
      await db.collection(VALUES_PUBLIC).doc(publicId).set({
        indicator_id: record.indicator_id,
        indicator_name: record.indicator_name,
        component: record.component,
        period: record.period,
        value: record.value,
        disagg: record.disagg || null,
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
    submitValue, listValues, listApprovedValues, reviewValue, deleteValue, listPublicValues,
    adminLogin, adminLogout, onAuthChange, getCurrentAdminSync, changeAdminPassword,
    listAdminUsers, upsertAdminUser, removeAdminUser,
  };
})();
