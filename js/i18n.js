/* ============================================================
   GORS - MOZCOMMUNITY — Sistema de tradução (PT / EN)
   ============================================================
   Traduz a interface (menus, botões, cabeçalhos, mensagens) e o
   catálogo FIXO de indicadores (nome, descrição, metodologia...), que
   foram traduzidos uma vez, com cuidado, e não têm custo nenhum.

   O que NÃO é traduzido automaticamente: as notas de processo escritas
   pela equipa ao submeter valores. Isso muda todos os dias, e traduzir
   isso em tempo real exigiria uma ligação paga a um serviço de tradução
   (o mesmo tipo de ligação que a narrativa por IA usa, ver
   js/store.js e functions/index.js). Por agora, essas notas continuam
   em português mesmo no modo inglês — fica claramente assinalado.
   ============================================================ */

const I18N = (() => {
  const LANG_KEY = 'me_lang';

  // ---------- Dicionário da interface ----------
  const UI = {
    // Navegação e geral
    nav_indicators: { pt: 'Indicadores', en: 'Indicators' },
    nav_reports: { pt: 'Relatórios', en: 'Reports' },
    nav_approvals: { pt: 'Aprovações', en: 'Approvals' },
    nav_users: { pt: 'Utilizadores', en: 'Users' },
    nav_logout: { pt: 'Sair', en: 'Log out' },
    nav_login: { pt: 'Entrar', en: 'Log in' },
    public_access_label: { pt: 'Acesso público', en: 'Public access' },
    brand_tagline: { pt: 'Monitoria de Indicadores — ADIN', en: 'Indicator Monitoring — ADIN' },
    gors_full_name: { pt: 'Sistema Global de Relatório de Produtos e Resultados', en: 'Global Output and Outcome Reporting System' },

    // Login
    login_area: { pt: 'Área reservada', en: 'Restricted area' },
    login_title: { pt: 'Entrar', en: 'Log in' },
    login_desc: { pt: 'Plataforma de monitoria de indicadores do projecto "Jobs, Social Cohesion and Community Resilience in Northern Mozambique — Phase I".', en: 'Indicator monitoring platform for the "Jobs, Social Cohesion and Community Resilience in Northern Mozambique — Phase I" project.' },
    email: { pt: 'Email', en: 'Email' },
    password: { pt: 'Password', en: 'Password' },
    login_btn: { pt: 'Entrar', en: 'Log in' },
    login_note: { pt: 'Para aceder ao painel interno, contacta o administrador da plataforma para obteres as tuas credenciais de acesso.', en: 'To access the internal dashboard, contact the platform administrator to obtain your access credentials.' },
    view_public_report: { pt: 'Ver relatório público de progresso', en: 'View public progress report' },
    public_access_note: { pt: 'Acesso livre, sem precisar de login.', en: 'Open access, no login required.' },

    // Painel de indicadores
    catalog_title: { pt: 'Indicadores do Quadro de Resultados', en: 'Results Framework Indicators' },
    add_indicator: { pt: '+ Adicionar indicador', en: '+ Add indicator' },
    reset_values: { pt: 'Zerar todos os valores', en: 'Reset all values' },
    col_level: { pt: 'Nível', en: 'Level' },
    col_indicator: { pt: 'Indicador', en: 'Indicator' },
    col_baseline: { pt: 'Base', en: 'Baseline' },
    col_current_value: { pt: 'Valor actual', en: 'Current value' },
    col_final_target: { pt: 'Meta final', en: 'Final target' },
    col_progress: { pt: 'Progresso', en: 'Progress' },
    col_stage: { pt: 'Estágio', en: 'Stage' },
    col_component: { pt: 'Componente', en: 'Component' },
    filter_all: { pt: 'Todos', en: 'All' },
    filter_all_f: { pt: 'Todas', en: 'All' },
    filter_prdo: { pt: 'PrDO (Programa)', en: 'PrDO (Program)' },
    filter_pdo: { pt: 'PDO (Projecto)', en: 'PDO (Project)' },
    filter_intermediate: { pt: 'Intermédio', en: 'Intermediate' },
    no_approved_value: { pt: 'Sem valor aprovado', en: 'No approved value' },
    no_results: { pt: 'Nenhum indicador encontrado com estes filtros.', en: 'No indicators found with these filters.' },

    // Estágios
    stage_atraso: { pt: '🔴 Em atraso', en: '🔴 Overdue' },
    stage_alcancada: { pt: '🟢 Meta alcançada', en: '🟢 Target achieved' },
    stage_prazo: { pt: '🟡 Dentro do prazo', en: '🟡 On track' },

    // Página do indicador
    back_to_indicators: { pt: '← Voltar aos indicadores', en: '← Back to indicators' },
    edit_indicator: { pt: 'Editar indicador', en: 'Edit indicator' },
    unit_label: { pt: 'Unidade', en: 'Unit' },
    frequency_label: { pt: 'Periodicidade', en: 'Frequency' },
    verification_means: { pt: 'Meios de Verificação', en: 'Means of Verification' },
    responsible_label: { pt: 'Responsável pela recolha', en: 'Responsible for data collection' },
    baseline_full: { pt: 'Base (Mai/2026)', en: 'Baseline (May/2026)' },
    current_value_sum: { pt: 'Valor actual', en: 'Current value' },
    description_label: { pt: 'Descrição / Definição', en: 'Description / Definition' },
    methodology_label: { pt: 'Metodologia de recolha de dados', en: 'Data collection methodology' },
    results_chart: { pt: 'Gráfico de resultados', en: 'Results chart' },
    targets_and_values: { pt: 'Metas e valores realizados, por ano e período', en: 'Targets and actual values, by year and period' },
    submission_history: { pt: 'Histórico de submissões', en: 'Submission history' },
    submit_new_value: { pt: 'Submeter novo valor', en: 'Submit new value' },
    readonly_note: { pt: 'A tua conta tem acesso apenas de leitura — não podes submeter valores.', en: 'Your account has read-only access — you cannot submit values.' },
    year: { pt: 'Ano', en: 'Year' },
    target_of_year: { pt: 'Meta do ano', en: 'Target for the year' },
    total_achieved: { pt: 'Total realizado', en: 'Total achieved' },
    notes: { pt: 'Observações', en: 'Notes' },
    period: { pt: 'Período', en: 'Period' },
    target: { pt: 'Meta', en: 'Target' },
    achieved: { pt: 'Realizado', en: 'Achieved' },

    // Formulário de submissão
    value_label: { pt: 'Valor', en: 'Value' },
    province_label: { pt: 'Província', en: 'Province' },
    district_label: { pt: 'Distrito', en: 'District' },
    select_placeholder: { pt: 'Seleccione...', en: 'Select...' },
    select_province_first: { pt: 'Seleccione primeiro a província...', en: 'Select a province first...' },
    process_summary_label: { pt: 'Descreva o resumo do processo', en: 'Describe the process summary' },
    process_summary_placeholder: { pt: 'Explica como este valor foi apurado: o que foi feito, onde, e como foi confirmado', en: 'Explain how this value was determined: what was done, where, and how it was confirmed' },
    attach_evidence: { pt: 'Anexar evidência', en: 'Attach evidence' },
    submit_for_approval: { pt: 'Submeter para aprovação', en: 'Submit for approval' },
    beneficiary_status_disagg: { pt: 'Desagregação por estatuto de beneficiário:', en: 'Disaggregation by beneficiary status:' },
    required_field: { pt: 'obrigatório', en: 'required' },

    // Aprovações
    approvals_title: { pt: 'Valores por aprovar', en: 'Values pending approval' },
    approvals_eyebrow: { pt: 'Fila de aprovação', en: 'Approval queue' },
    approve: { pt: 'Aprovar', en: 'Approve' },
    reject: { pt: 'Rejeitar', en: 'Reject' },
    view_details: { pt: 'Ver detalhes', en: 'View details' },
    submitted_by: { pt: 'Submetido por', en: 'Submitted by' },
    date: { pt: 'Data', en: 'Date' },
    no_pending: { pt: 'Não há valores pendentes de aprovação neste momento.', en: 'There are no values pending approval at this time.' },
    access_denied: { pt: 'Acesso restrito', en: 'Access restricted' },
    admin_only_approvals: { pt: 'Só o Administrador geral pode aceder às aprovações.', en: 'Only the General Administrator can access approvals.' },
    view_full_indicator: { pt: 'Ver indicador completo', en: 'View full indicator' },
    evidence_label: { pt: 'Evidência', en: 'Evidence' },
    no_evidence: { pt: 'Sem evidência anexada.', en: 'No evidence attached.' },
    process_summary: { pt: 'Resumo do processo', en: 'Process summary' },
    location_label: { pt: 'Localização', en: 'Location' },
    disaggregation_label: { pt: 'Desagregação', en: 'Disaggregation' },
    status_label: { pt: 'Estatuto', en: 'Status' },
    status_submitted: { pt: 'Submetido', en: 'Submitted' },
    status_approved: { pt: 'Aprovado', en: 'Approved' },
    status_rejected: { pt: 'Rejeitado', en: 'Rejected' },
    reviewed_by: { pt: 'Revisto por', en: 'Reviewed by' },
    no_submissions_yet: { pt: 'Ainda não há submissões para este indicador.', en: 'There are no submissions for this indicator yet.' },

    // Relatórios
    reports_eyebrow: { pt: 'Progresso do projecto', en: 'Project progress' },
    open_data_label: { pt: 'Dados abertos', en: 'Open data' },
    public_report_lead: { pt: 'Progresso dos indicadores do projecto "Jobs, Social Cohesion and Community Resilience in Northern Mozambique — Phase I", com base apenas em valores já aprovados. Acesso livre, sem necessidade de login.', en: 'Progress of the indicators for the "Jobs, Social Cohesion and Community Resilience in Northern Mozambique — Phase I" project, based only on values that have already been approved. Free access, no login required.' },
    footer_text: { pt: 'GORS - MOZCOMMUNITY — Monitoria de Indicadores, ADIN.', en: 'GORS - MOZCOMMUNITY — Indicator Monitoring, ADIN.' },
    public_report_page_title: { pt: 'Relatório Público — GORS - MOZCOMMUNITY', en: 'Public Report — GORS - MOZCOMMUNITY' },
    reports_title: { pt: 'Relatórios', en: 'Reports' },
    reports_lead: { pt: 'Progresso dos indicadores face às metas do Quadro de Resultados, com base apenas em valores aprovados.', en: 'Indicator progress against the Results Framework targets, based only on approved values.' },
    report_filters: { pt: 'Filtros do relatório', en: 'Report filters' },
    gender_label: { pt: 'Género', en: 'Gender' },
    women: { pt: 'Mulheres', en: 'Women' },
    youth: { pt: 'Jovens', en: 'Youth' },
    displaced: { pt: 'Deslocados', en: 'Displaced' },
    returnees: { pt: 'Retornados', en: 'Returnees' },
    host: { pt: 'Anfitriões', en: 'Host communities' },
    apply_filters: { pt: 'Aplicar filtros', en: 'Apply filters' },
    clear_filters: { pt: 'Limpar filtros', en: 'Clear filters' },
    download_pdf: { pt: '⬇ Descarregar relatório em PDF', en: '⬇ Download report as PDF' },
    tile_indicators: { pt: 'Indicadores', en: 'Indicators' },
    tile_with_value: { pt: 'Com valor aprovado', en: 'With an approved value' },
    tile_without_value: { pt: 'Sem nenhum valor ainda', en: 'With no value yet' },
    tile_avg_progress: { pt: 'Progresso médio', en: 'Average progress' },
    chart_by_level: { pt: 'Indicadores por nível (PrDO / PDO)', en: 'Indicators by level (PrDO / PDO)' },
    chart_by_level_sub: { pt: 'Programa e Projecto — indicadores intermédios são vistos por componente', en: 'Program and Project — intermediate indicators are shown by component' },
    chart_by_component: { pt: 'Progresso médio por componente', en: 'Average progress by component' },
    chart_by_component_sub: { pt: 'C1–C4 · indicadores intermédios numéricos', en: 'C1–C4 · numeric intermediate indicators' },
    chart_stage: { pt: 'Estágio dos indicadores', en: 'Indicator stage' },
    chart_stage_sub: { pt: 'Face às metas do Quadro de Resultados, à data de hoje', en: 'Against the Results Framework targets, as of today' },
    chart_demo: { pt: 'Desagregação por género e idade', en: 'Disaggregation by gender and age' },
    chart_demo_sub: { pt: 'Soma de: transferências monetárias, jovens formados nos SICs, e beneficiários de VBG', en: 'Sum of: cash transfers, youth trained at SICs, and GBV beneficiaries' },
    chart_status: { pt: 'Desagregação por estatuto de beneficiário', en: 'Disaggregation by beneficiary status' },
    chart_status_sub: { pt: 'Soma de: transferências monetárias, jovens formados nos SICs, e beneficiários de VBG', en: 'Sum of: cash transfers, youth trained at SICs, and GBV beneficiaries' },
    program_indicators_title: { pt: 'Indicadores de Programa (PrDO e PDO)', en: 'Program Indicators (PrDO and PDO)' },
    intermediate_indicators_title: { pt: 'Indicadores Intermédios', en: 'Intermediate Indicators' },
    avg_by_level_title: { pt: 'Progresso médio por nível', en: 'Average progress by level' },
    col_num_indicators: { pt: 'Nº de indicadores', en: 'No. of indicators' },
    col_avg_progress: { pt: 'Progresso médio', en: 'Average progress' },
    descriptive_report_title: { pt: 'Relatório Descritivo', en: 'Descriptive Report' },
    ai_improve_btn: { pt: '🤖 Melhorar com IA (Claude)', en: '🤖 Improve with AI (Claude)' },
    no_descriptive_data: { pt: 'Ainda não há resumos de processo registados para os indicadores nestes filtros.', en: 'There are no process summaries recorded yet for the indicators in these filters.' },
    generated_on: { pt: 'Gerado em', en: 'Generated on' },
    analysis_period: { pt: 'Período em análise', en: 'Period under review' },

    // Utilizadores
    users_title: { pt: 'Gestão de Utilizadores', en: 'User Management' },
    users_lead: { pt: 'Cria primeiro a conta de login em Firebase Console → Authentication → Users → Add user, copia o User UID gerado, e cola-o aqui para atribuir o nível de acesso.', en: 'First create the login account in Firebase Console → Authentication → Users → Add user, copy the generated User UID, and paste it here to assign the access level.' },
    name_label: { pt: 'Nome', en: 'Name' },
    access_level: { pt: 'Nível de acesso', en: 'Access level' },
    save_user: { pt: 'Guardar utilizador', en: 'Save user' },
    edit: { pt: 'Editar', en: 'Edit' },
    remove_access: { pt: 'Remover acesso', en: 'Remove access' },
    role_admin: { pt: 'Administrador geral', en: 'General Administrator' },
    role_submitter: { pt: 'Equipa de reporte', en: 'Reporting team' },
    role_readonly: { pt: 'Só leitura', en: 'Read only' },
    role_admin_desc: { pt: 'Administrador geral — aprova/rejeita e gere tudo', en: 'General Administrator — approves/rejects and manages everything' },
    role_submitter_desc: { pt: 'Equipa de reporte — submete valores para aprovação', en: 'Reporting team — submits values for approval' },
    role_readonly_desc: { pt: 'Só leitura — só vê o progresso', en: 'Read only — can only view progress' },

    // Editar indicador
    new_indicator: { pt: 'Novo indicador', en: 'New indicator' },
    save_indicator: { pt: 'Guardar indicador', en: 'Save indicator' },
    delete_indicator: { pt: 'Apagar indicador', en: 'Delete indicator' },
  };

  // ---------- Traduções do catálogo fixo de indicadores ----------
  // Chave = id do indicador. Só cobre os 19 indicadores do Quadro de
  // Resultados original — indicadores criados/editados manualmente pelo
  // administrador não têm tradução automática (mantêm-se em português
  // mesmo no modo inglês).
  const INDICATOR_EN = {
    'prdo-localities': {
      name: 'Localities implementing participatory local planning processes',
      unit: 'Number', frequency: 'Semi-annually',
      description: 'The target reflects the number of localities, under Phases I and II, where locality consultative councils (elected representatives of internally displaced persons, host communities, returnees, men, women, youth, and persons with disabilities) identify community projects, in collaboration with district government, using the participatory planning and budgeting tool.',
      dataSource: 'Progress reports',
      methodology: 'Review of works progress reports, meeting minutes, and District Local Development Plans (DLDPs).',
    },
    'prdo-jobs': {
      name: 'Better and higher-paid jobs created/benefited (CRI)',
      unit: 'Number', frequency: 'Semi-annually',
      description: 'The target reflects the number of people, under Phases I and II, benefiting from short and medium/long-term jobs resulting from the program. Short-term jobs result from infrastructure construction/rehabilitation (10,450 jobs), while medium and long-term jobs result from cash transfers to vulnerable households (25,000), grants to socioeconomic enterprises (10,000), youth upskilling activities in SICs (2,500), and the long-term operation of community subprojects (600 jobs).',
      dataSource: 'Progress reports, field visits',
      methodology: "Review of works progress reports, cash transfer program reports, SICs and service provider reports, and grants program service provider reports.",
    },
    'pdo-localities': {
      name: 'Localities implementing participatory local planning processes (Targeted Areas)',
      unit: 'Number', frequency: 'Quarterly',
      description: 'This target reflects the number of localities where locality consultative committees (elected representatives of internally displaced persons, host communities, returnees, men, women, youth, and persons with disabilities) identify community projects, in collaboration with district government, using the participatory planning and budgeting tool. The localities are 80 selected localities in the provinces of Niassa, Cabo Delgado and Nampula, across the 56 districts of these provinces, excluding their respective capitals.',
      dataSource: 'Progress reports',
      methodology: 'Review of works progress reports, meeting minutes, and District Local Development Plans (DLDPs).',
    },
    'pdo-jobs': {
      name: 'Better and higher-paid jobs created/benefited — Targeted Areas (CRI)',
      unit: 'Number', frequency: 'Semi-annually',
      description: 'The proposed target reflects the number of people benefiting from short and medium/long-term jobs resulting from the project. Short-term jobs result from infrastructure construction/rehabilitation (4,180 jobs), while medium and long-term jobs result from cash transfers (10,000), grants to socioeconomic enterprises (4,000), youth upskilling activities in SICs (1,000), and the long-term operation of community subprojects (240 jobs). Jobs will be created in the three provinces of northern Mozambique, excluding their respective capitals.',
      dataSource: 'Progress reports, field visits',
      methodology: 'Review of works progress reports, cash transfer program reports, SICs and service provider reports, and grants program service provider reports.',
    },
    'pdo-cri-infra': {
      name: 'People benefiting from climate resilient infrastructure (CRI)',
      unit: 'Number of people', frequency: 'Quarterly',
      description: "The proposed target reflects people benefiting from rehabilitated or new public infrastructure (222,000) in ten districts of Cabo Delgado province, and from community infrastructure (560,000) in 80 selected localities in the provinces of Niassa, Cabo Delgado and Nampula. The target for youth (15-24 years) reflects 17% and the target for women reflects 51% of the Northern Region's population, according to World Bank calculations using 2022 data from the Household Budget Survey. The number of public infrastructure beneficiaries reflects about 15% of the population of the ten districts, and the number of community infrastructure beneficiaries reflects 80 projects benefiting about 7,000 people per project, based on the average locality population in the Northern Region.",
      dataSource: 'Progress reports',
      methodology: 'Review of works progress reports, field visits.',
      disaggregation: ['Women', 'Youth'],
    },
    'c1-nrcf': {
      name: 'Northern Regional Consultative Forum (NRCF) operational',
      unit: 'Yes/No', frequency: 'Semi-annually',
      description: 'NRCF members hold at least semi-annual meetings; publish minutes and the list of participants; and monitor the implementation of provincial development strategies.',
      dataSource: 'Progress reports',
      methodology: 'Review of meeting minutes.',
    },
    'c1-observatorios': {
      name: 'Provincial Observatories operational',
      unit: 'Number', frequency: 'Quarterly (first half) / Semi-annually (second half)',
      description: 'Meet at least quarterly during the first half of the project and at least semi-annually during the second half; publish minutes and list of participants; and monitor implementation of district development strategies.',
      dataSource: 'Progress reports',
      methodology: 'Review of meeting minutes.',
    },
    'c1-conselhos': {
      name: 'District Consultative Councils operational',
      unit: 'Number', frequency: 'Quarterly',
      description: 'New ones are legalized by the district administration; new and existing ones meet at least quarterly, publishing minutes and lists of participants; and monitor implementation of locality activities, including flagship community projects.',
      dataSource: 'Progress reports',
      methodology: 'Review of meeting minutes.',
    },
    'c1-comites-localidade': {
      name: 'Locality Consultative Committees/Councils operational',
      unit: 'Number', frequency: 'Quarterly',
      description: 'Consultative councils (one for each of the 80 targeted localities) are composed of elected representatives of internally displaced persons, host communities, returnees, men, women, youth, and persons with disabilities, who identify flagship projects.',
      dataSource: 'Progress reports',
      methodology: 'Ongoing review of council membership and meeting minutes, field visits.',
    },
    'c1-confianca': {
      name: 'Beneficiaries reporting increased trust among community members and between community and State',
      unit: 'Percentage', frequency: 'Project Year 1, mid-term, and closing',
      description: "This indicator measures the outcome of vertical (community-State) and horizontal (within communities) social cohesion. Baseline, mid-term, and final surveys among communities of participating localities, across 56 districts, will determine the trust resulting from the project's key interventions. Within communities: agreement on community projects to be established. Between communities and the State: grants to women and youth enterprises, psychosocial support and support to GBV victims, and youth upskilling.",
      dataSource: 'Surveys',
      methodology: 'Survey of a sample of beneficiaries.',
    },
    'c2-cash-transfers': {
      name: 'Beneficiaries of cash transfer interventions (CRI)',
      unit: 'Number of people', frequency: 'Quarterly',
      description: "This indicator measures the number of people participating in the cash transfer program. The target reflects 10,000 households across the three northern provinces, with an average household size of 5 people. The target for youth (15-24 years) reflects 17% and the target for women reflects 51% of the Northern Region's population, according to World Bank calculations using 2022 data from the Household Budget Survey.",
      dataSource: 'Progress reports',
      methodology: 'Review of transactions made.',
      disaggregation: ['Women', 'Youth'],
    },
    'c2-cash-transfers-mulheres': {
      name: 'Beneficiaries of cash-based interventions — Female (CRI)',
      unit: 'Number of people', frequency: 'Quarterly',
      description: "This indicator measures the number of people participating in the cash transfer program. The target reflects 10,000 households across the three northern provinces, with an average household size of 5 people. The target for youth (15-24 years) reflects 17% and the target for women reflects 51% of the Northern Region's population, according to World Bank calculations using 2022 data from the Household Budget Survey.",
      dataSource: 'Progress reports',
      methodology: 'Review of transactions made.',
    },
    'c2-cash-transfers-jovens': {
      name: 'Beneficiaries of cash-based interventions — Youth (CRI)',
      unit: 'Number of people', frequency: 'Quarterly',
      description: "This indicator measures the number of people participating in the cash transfer program. The target reflects 10,000 households across the three northern provinces, with an average household size of 5 people. The target for youth (15-24 years) reflects 17% and the target for women reflects 51% of the Northern Region's population, according to World Bank calculations using 2022 data from the Household Budget Survey.",
      dataSource: 'Progress reports',
      methodology: 'Review of transactions made.',
    },
    'c2-grants-mulheres': {
      name: 'Percentage of total grant value awarded to women-owned enterprises',
      unit: 'Percentage', frequency: 'Quarterly',
      description: 'Percentage of the total value of grants awarded to women-owned enterprises.',
      dataSource: 'Progress reports',
      methodology: "Review of service provider's reports.",
    },
    'c2-grants-jovens': {
      name: 'Percentage of total grant value awarded to youth and persons-with-disabilities enterprises',
      unit: 'Percentage', frequency: 'Quarterly',
      description: 'Percentage of the total value of grants awarded to youth-owned enterprises and enterprises of persons with disabilities.',
      dataSource: 'Progress reports',
      methodology: "Review of service provider's reports.",
    },
    'c2-sics': {
      name: 'Youth trained at Skills Incubation Centers (SICs)',
      unit: 'Number', frequency: 'Quarterly',
      description: 'Number of youth receiving training, mentoring, job placement and/or business development support at the project-supported Skills Incubation Centers (SICs).',
      dataSource: 'Progress reports, field visits',
      methodology: "Review of SICs' reports.",
      disaggregation: ['Women'],
    },
    'c2-gbv': {
      name: 'Beneficiaries of GBV prevention and response actions',
      unit: 'Number', frequency: 'Quarterly',
      description: 'Number of people reached with awareness-raising messages on GBV, sexual and reproductive health, mental health, GALS, and other psychosocial support programs, in the three northern provinces.',
      dataSource: 'Progress reports',
      methodology: "Review of service provider's reports, field visits.",
      disaggregation: ['Women (%)'],
    },
    'c3-infra-comunitaria': {
      name: 'Climate resilient community infrastructure rehabilitated/established and operational',
      unit: 'Number', frequency: 'Quarterly',
      description: 'As prioritized in the District Local Development Plans (DLDPs), in the 80 selected localities.',
      dataSource: 'Progress reports',
      methodology: 'Review of contractor reports, field visits.',
    },
    'c3-infra-publica': {
      name: 'Public infrastructure rehabilitated/constructed',
      unit: 'Number', frequency: 'Quarterly',
      description: 'As agreed with the government under the NCRP project, in the ten districts of Cabo Delgado.',
      dataSource: 'Progress reports',
      methodology: 'Review of contractor reports, field visits.',
    },
    'c4-roteiro-clima': {
      name: "Climate finance roadmap for the MPD's National Directorate of Climate Finance developed",
      unit: 'Yes/No', frequency: 'Annually',
      description: 'The roadmap will specify the actions needed to secure climate finance for the northern region, in order to further strengthen community resilience.',
      dataSource: 'Progress reports',
      methodology: 'Review of the roadmap.',
    },
    'c4-reclamacoes': {
      name: 'Beneficiaries reporting that their project-related grievances were addressed',
      unit: 'Percentage', frequency: 'Mid-term and closing',
      description: 'Based on a survey to be carried out at mid-term and at project closing.',
      dataSource: 'Beneficiary questionnaire',
      methodology: 'Mid-term and closing surveys, conducted by a third party.',
    },
  };

  const COMPONENT_EN = {
    'Componente 1 — Colaboração Comunidades-Governo': 'Component 1 — Community-Government Collaboration',
    'Componente 2 — Oportunidades Económicas e Emprego': 'Component 2 — Economic Opportunities and Jobs',
    'Componente 3 — Infraestrutura Resiliente ao Clima': 'Component 3 — Climate Resilient Infrastructure',
    'Componente 4 — Gestão do Projecto e Aprendizagem': 'Component 4 — Project Management and Learning',
  };
  const LEVEL_EN = { 'Intermédio': 'Intermediate', 'PrDO': 'PrDO', 'PDO': 'PDO' };

  function getLang() {
    return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'pt';
  }
  function setLang(lang) {
    localStorage.setItem(LANG_KEY, lang === 'en' ? 'en' : 'pt');
  }
  function toggleLang() {
    setLang(getLang() === 'en' ? 'pt' : 'en');
    location.reload();
  }

  function t(key) {
    const entry = UI[key];
    if (!entry) return key;
    return entry[getLang()] || entry.pt;
  }

  // Devolve o indicador com os campos traduzidos, se existir tradução e
  // o idioma actual for inglês. Caso contrário, devolve o indicador tal
  // como veio (português). Não modifica o objecto original.
  // Reserva: alguns indicadores criados manualmente pela equipa (fora do
  // catálogo original) podem ter um identificador gerado automaticamente
  // que não corresponde ao que aqui está previsto (ex: dois nomes muito
  // parecidos e longos podem gerar o MESMO identificador cortado, já
  // que o sistema limita o identificador a 60 caracteres). Por isso,
  // esta tabela funciona como reserva, indexada pelo NOME exacto em
  // português — usada só se a procura pelo identificador falhar.
  const INDICATOR_EN_BY_NAME = {
    'Beneficiários das intervenções de transferências monetárias — Mulheres (CRI)': {
      name: 'Beneficiaries of cash-based interventions — Female (CRI)',
      unit: 'Number of people', frequency: 'Quarterly',
      description: "This indicator measures the number of people participating in the cash transfer program. The target reflects 10,000 households across the three northern provinces, with an average household size of 5 people. The target for youth (15-24 years) reflects 17% and the target for women reflects 51% of the Northern Region's population, according to World Bank calculations using 2022 data from the Household Budget Survey.",
      dataSource: 'Progress reports',
      methodology: 'Review of transactions made.',
    },
    'Beneficiários das intervenções de transferências monetárias — Jovens (CRI)': {
      name: 'Beneficiaries of cash-based interventions — Youth (CRI)',
      unit: 'Number of people', frequency: 'Quarterly',
      description: "This indicator measures the number of people participating in the cash transfer program. The target reflects 10,000 households across the three northern provinces, with an average household size of 5 people. The target for youth (15-24 years) reflects 17% and the target for women reflects 51% of the Northern Region's population, according to World Bank calculations using 2022 data from the Household Budget Survey.",
      dataSource: 'Progress reports',
      methodology: 'Review of transactions made.',
    },
    'Beneficiários das intervenções de transferências monetárias — Mulheres': {
      name: 'Beneficiaries of cash-based interventions — Female',
      unit: 'Number of people', frequency: 'Quarterly',
      description: "This indicator measures the number of people participating in the cash transfer program. The target reflects 10,000 households across the three northern provinces, with an average household size of 5 people. The target for youth (15-24 years) reflects 17% and the target for women reflects 51% of the Northern Region's population, according to World Bank calculations using 2022 data from the Household Budget Survey.",
      dataSource: 'Progress reports',
      methodology: 'Review of transactions made.',
    },
    'Beneficiários das intervenções de transferências monetárias — Jovens': {
      name: 'Beneficiaries of cash-based interventions — Youth',
      unit: 'Number of people', frequency: 'Quarterly',
      description: "This indicator measures the number of people participating in the cash transfer program. The target reflects 10,000 households across the three northern provinces, with an average household size of 5 people. The target for youth (15-24 years) reflects 17% and the target for women reflects 51% of the Northern Region's population, according to World Bank calculations using 2022 data from the Household Budget Survey.",
      dataSource: 'Progress reports',
      methodology: 'Review of transactions made.',
    },
    'Beneficiários VBG — % Mulheres': {
      name: 'GBV Beneficiaries — % Female',
      unit: 'Percentage', frequency: 'Quarterly',
      description: 'Percentage of women among the people reached with awareness-raising messages on GBV, sexual and reproductive health, mental health, GALS, and other psychosocial support programs, in the three northern provinces.',
      dataSource: 'Progress reports',
      methodology: "Review of service provider's reports, field visits.",
    },
  };

  function translateIndicator(ind) {
    if (getLang() !== 'en' || !ind) return ind;
    const en = INDICATOR_EN[ind.id] || INDICATOR_EN_BY_NAME[ind.name];
    const level = LEVEL_EN[ind.level] || ind.level;
    const component = ind.component ? (COMPONENT_EN[ind.component] || ind.component) : ind.component;
    if (!en) return { ...ind, level, component };
    return {
      ...ind,
      level, component,
      name: en.name || ind.name,
      unit: en.unit || ind.unit,
      frequency: en.frequency || ind.frequency,
      description: en.description || ind.description,
      dataSource: en.dataSource || ind.dataSource,
      methodology: en.methodology || ind.methodology,
      disaggregation: en.disaggregation || ind.disaggregation,
    };
  }

  function translateLevel(level) {
    return getLang() === 'en' ? (LEVEL_EN[level] || level) : level;
  }
  function translateComponent(component) {
    if (!component) return component;
    return getLang() === 'en' ? (COMPONENT_EN[component] || component) : component;
  }

  // Aplica traduções a todos os elementos com atributo data-i18n na
  // página (texto estático do HTML).
  function applyStaticTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translated = t(key);
      if (el.hasAttribute('data-i18n-placeholder')) {
        el.setAttribute('placeholder', translated);
      } else {
        el.textContent = translated;
      }
    });
    document.querySelectorAll('[data-i18n-placeholder-only]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder-only');
      el.setAttribute('placeholder', t(key));
    });
  }

  // Insere o botão de alternância PT/EN no menu, antes do último
  // elemento (tipicamente "Sair"/"Entrar").
  function injectToggle(navSelector) {
    const nav = document.querySelector(navSelector);
    if (!nav) return;
    const btn = document.createElement('a');
    btn.href = '#';
    btn.id = 'lang-toggle';
    btn.style.marginRight = '4px';
    btn.textContent = getLang() === 'en' ? 'PT' : 'EN';
    btn.title = getLang() === 'en' ? 'Mudar para português' : 'Switch to English';
    btn.addEventListener('click', (e) => { e.preventDefault(); toggleLang(); });
    const lastChild = nav.lastElementChild;
    if (lastChild) {
      nav.insertBefore(btn, lastChild);
    } else {
      nav.appendChild(btn);
    }
  }

  return { getLang, setLang, toggleLang, t, translateIndicator, translateLevel, translateComponent, applyStaticTranslations, injectToggle };
})();
