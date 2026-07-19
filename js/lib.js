/* ============================================================
   GORS.lib — lógica de domínio pura (sem chamadas à rede)
   Portada 1:1 do código React anterior (src/lib/indicators.ts,
   periods.ts, geo.ts) para que o comportamento seja idêntico.
   ============================================================ */
(function (global) {
  "use strict";

  // -------- Geografia --------
  const NATIONAL_PROVINCE = "Nacional";
  const ALL_DISTRICTS = "Todos";
  const PROVINCES_DISTRICTS = {
    "Cabo Delgado": [
      "Pemba", "Ancuabe", "Balama", "Chiúre", "Ibo", "Macomia", "Mecúfi", "Meluco",
      "Metuge", "Mocímboa da Praia", "Montepuez", "Mueda", "Muidumbe", "Namuno",
      "Nangade", "Palma", "Quissanga",
    ],
    Nampula: [
      "Nampula", "Angoche", "Eráti", "Ilha de Moçambique", "Lalaua", "Larde", "Liúpo",
      "Malema", "Meconta", "Mecubúri", "Memba", "Mogincual", "Mogovolas", "Moma",
      "Monapo", "Mossuril", "Muecate", "Murrupula", "Nacala-a-Velha", "Nacala Porto",
      "Nacarôa", "Rapale", "Ribáuè",
    ],
    Niassa: [
      "Lichinga", "Cuamba", "Chimbunila", "Lago", "Majune", "Mandimba", "Marrupa",
      "Maúa", "Mavago", "Mecanhelas", "Mecula", "Metarica", "Muembe", "Ngauma",
      "Nipepe", "Sanga",
    ],
  };
  const PROVINCES = Object.keys(PROVINCES_DISTRICTS);
  function districtsFor(province) {
    if (province === NATIONAL_PROVINCE) return [ALL_DISTRICTS];
    return [ALL_DISTRICTS].concat(PROVINCES_DISTRICTS[province] || []);
  }

  // -------- Períodos --------
  const PERIOD_KIND_LABELS = {
    monthly: "Mensal", quarterly: "Trimestral", semestral: "Semestral",
    annual: "Anual", biennial: "Bienal",
  };
  const MONTHS_PT = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];
  function periodKindFromFrequency(freq) {
    const f = (freq || "").toLowerCase();
    if (f.includes("mens")) return "monthly";
    if (f.includes("trimestr")) return "quarterly";
    if (f.includes("semestr")) return "semestral";
    if (f.includes("bien")) return "biennial";
    return "annual";
  }
  function subOptions(kind) {
    if (kind === "monthly") return MONTHS_PT.map((m, i) => ({ value: i + 1, label: m }));
    if (kind === "quarterly") return [1, 2, 3, 4].map((q) => ({ value: q, label: `T${q}` }));
    if (kind === "semestral") return [1, 2].map((s) => ({ value: s, label: `S${s}` }));
    return [];
  }
  function makePeriod(kind, year, sub) {
    switch (kind) {
      case "monthly":
        return { label: `${year}-${String(sub).padStart(2, "0")}`, order: year * 100 + sub };
      case "quarterly":
        return { label: `${year}-T${sub}`, order: year * 100 + sub * 3 };
      case "semestral":
        return { label: `${year}-S${sub}`, order: year * 100 + sub * 6 };
      case "biennial":
        return { label: `${year}-${year + 1}`, order: year * 100 + 24 };
      default:
        return { label: `${year}`, order: year * 100 + 12 };
    }
  }
  function inferKindFromLabel(label) {
    if (/^\d{4}-\d{2}$/.test(label)) return "monthly";
    if (/^\d{4}-T[1-4]$/.test(label)) return "quarterly";
    if (/^\d{4}-S[12]$/.test(label)) return "semestral";
    if (/^\d{4}-\d{4}$/.test(label)) return "biennial";
    if (/^\d{4}$/.test(label)) return "annual";
    return "annual";
  }
  const DEMOGRAPHICS = [
    { value: "geral", label: "Geral" },
    { value: "mulheres", label: "Mulheres" },
    { value: "jovens", label: "Jovens" },
  ];
  const BENEFICIARY_STATUS = [
    { value: "geral", label: "Geral" },
    { value: "deslocado", label: "Deslocado" },
    { value: "retornado", label: "Retornado" },
    { value: "hospedeiro", label: "Hospedeiro" },
  ];

  // -------- Indicadores --------
  const LEVEL_LABELS = {
    pdo_program: "PDO — Programa",
    pdo_phase1: "PDO — Fase I",
    intermediate: "Intermediário",
  };
  const STATUS_META = {
    on_track: { label: "No alvo", cls: "status-on_track" },
    at_risk: { label: "Em risco", cls: "status-at_risk" },
    off_track: { label: "Atrasado", cls: "status-off_track" },
    no_data: { label: "Sem dados", cls: "status-no_data" },
  };

  function formatValue(v, type) {
    if (v === null || v === undefined) return "—";
    if (type === "percentage") return `${v.toLocaleString("pt-PT")}%`;
    if (type === "yes_no") return v >= 1 ? "Sim" : "Não";
    return v.toLocaleString("pt-PT");
  }

  function nationalActuals(ind) {
    const national = ind.actuals.filter((a) => a.province === NATIONAL_PROVINCE);
    return national.length > 0 ? national : ind.actuals;
  }

  function latestActual(ind) {
    const withValue = nationalActuals(ind)
      .filter((a) => a.actual_value !== null || a.actual_text !== null)
      .sort((a, b) => b.period_order - a.period_order);
    return withValue[0] || null;
  }

  function cumulativeValue(ind) {
    if (ind.value_type === "number") {
      const rows = nationalActuals(ind).filter((a) => a.actual_value !== null);
      if (rows.length === 0) return null;
      return rows.reduce((sum, a) => sum + (a.actual_value || 0), 0);
    }
    const last = latestActual(ind);
    return last ? last.actual_value : null;
  }

  function sumActuals(rows) {
    const withValue = rows.filter((a) => a.actual_value !== null);
    if (withValue.length === 0) return null;
    return withValue.reduce((sum, a) => sum + (a.actual_value || 0), 0);
  }

  function statusFromRatio(ratio) {
    if (ratio >= 1) return "on_track";
    if (ratio >= 0.8) return "at_risk";
    return "off_track";
  }

  function progressRatio(ind) {
    if (ind.value_type === "yes_no") {
      const last = latestActual(ind);
      if (!last || last.actual_value === null) return null;
      return last.actual_value >= 1 ? 1 : 0;
    }
    const value = cumulativeValue(ind);
    if (value === null) return null;
    const target = ind.final_target;
    if (target === null || target === 0) return value > 0 ? 1 : 0;
    return Math.max(0, Math.min(1.5, value / target));
  }

  function indicatorStatus(ind) {
    const last = latestActual(ind);
    if (!last) return "no_data";
    if (ind.value_type === "yes_no" || ind.value_type === "text") {
      return last.actual_value !== null || last.actual_text ? "on_track" : "no_data";
    }
    if (ind.value_type === "number") {
      const value = cumulativeValue(ind);
      if (value === null) return "no_data";
      const target = ind.final_target;
      if (target === null || target === 0) return value > 0 ? "on_track" : "at_risk";
      return statusFromRatio(value / target);
    }
    const target = ind.targets.find((t) => t.period_label === last.period_label);
    const targetValue = target ? target.target_value : null;
    if (last.actual_value === null) return "no_data";
    if (targetValue === null || targetValue === 0) {
      return last.actual_value > 0 ? "on_track" : "at_risk";
    }
    return statusFromRatio(last.actual_value / targetValue);
  }

  // -------- Misc utils --------
  function escapeHtml(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  function qs(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  global.GORS = global.GORS || {};
  Object.assign(global.GORS, {
    NATIONAL_PROVINCE, ALL_DISTRICTS, PROVINCES_DISTRICTS, PROVINCES, districtsFor,
    PERIOD_KIND_LABELS, MONTHS_PT, periodKindFromFrequency, subOptions, inferKindFromLabel, makePeriod,
    DEMOGRAPHICS, BENEFICIARY_STATUS,
    LEVEL_LABELS, STATUS_META,
    formatValue, nationalActuals, latestActual, cumulativeValue, sumActuals,
    progressRatio, indicatorStatus,
    escapeHtml, qs,
  });
})(window);
