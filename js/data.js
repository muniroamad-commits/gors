/* ============================================================
   GORS.data — todo o acesso à base de dados (Supabase), directo
   do browser. A autorização é garantida pelas políticas RLS no
   Supabase, não por este código (tal como o Firestore Rules na
   plataforma de queixas) — por isso não há aqui nenhuma chave
   privilegiada, só a chave pública "anon".
   ============================================================ */
(function (global) {
  "use strict";
  const sb = () => window.GORS.sb;

  const EVIDENCE_BUCKET = "indicator-evidence";
  const EVIDENCE_SIGNED_URL_TTL_SECONDS = 300;
  const DISAGGREGATION_CONFLICT_TARGET =
    "indicator_id,period_label,province,district,demographic,beneficiary_status";

  // -------- Auth --------
  async function getSession() {
    const { data } = await sb().auth.getSession();
    return data.session;
  }
  async function getUser() {
    const { data, error } = await sb().auth.getUser();
    if (error) return null;
    return data.user;
  }

  // Guard used at the top of every authenticated page: redirects to the
  // login page when there's no valid session, mirroring the old
  // `_authenticated` route's beforeLoad check.
  async function requireAuth() {
    const session = await getSession();
    if (!session) {
      window.location.href = "auth.html";
      return null;
    }
    const user = await getUser();
    if (!user) {
      await sb().auth.signOut();
      window.location.href = "auth.html";
      return null;
    }
    return user;
  }

  // -------- Shape helpers (mirror the old server DTO builders) --------
  function toActualDTO(row) {
    return {
      id: row.id,
      period_label: row.period_label,
      period_order: row.period_order,
      province: row.province ?? "Nacional",
      district: row.district ?? "Todos",
      demographic: row.demographic ?? "geral",
      beneficiary_status: row.beneficiary_status ?? "geral",
      actual_value: row.actual_value,
      actual_text: row.actual_text,
      note: row.note,
      recorded_by: row.recorded_by,
      status: row.status,
      approved_by: row.approved_by,
      approved_at: row.approved_at,
      rejection_reason: row.rejection_reason,
      updated_at: row.updated_at,
    };
  }

  function groupByIndicator(rows) {
    const map = new Map();
    for (const row of rows) {
      const list = map.get(row.indicator_id) || [];
      list.push(row);
      map.set(row.indicator_id, list);
    }
    return map;
  }

  function buildIndicators(indicatorRows, targetsByInd, actualsByInd, evidenceByInd) {
    return indicatorRows.map((row) => ({
      id: row.id,
      name: row.name,
      unit: row.unit,
      level: row.level,
      value_type: row.value_type,
      component_id: row.component_id,
      parent_id: row.parent_id,
      baseline_value: row.baseline_value,
      baseline_text: row.baseline_text,
      final_target: row.final_target,
      final_target_text: row.final_target_text,
      frequency: row.frequency,
      data_source: row.data_source,
      methodology: row.methodology,
      responsibility: row.responsibility,
      description: row.description,
      sort_order: row.sort_order,
      targets: (targetsByInd.get(row.id) || []).sort((a, b) => a.period_order - b.period_order),
      actuals: (actualsByInd.get(row.id) || []).sort((a, b) => a.period_order - b.period_order),
      evidence: evidenceByInd.get(row.id) || null,
    }));
  }

  function buildComponents(rows) {
    return rows.map((row) => ({
      id: row.id,
      code: row.code,
      title: row.title,
      description: row.description,
      sort_order: row.sort_order,
    }));
  }

  // -------- Framework (public + authenticated) --------

  // Anonymous / public: only approved actuals, no role/evidence. Works
  // without login thanks to the anon-readable RLS policies already on
  // components / indicators / indicator_targets / indicator_actuals(approved).
  async function getPublicFramework() {
    const client = sb();
    const [compRes, indRes, tgtRes, actRes] = await Promise.all([
      client.from("components").select("*").order("sort_order"),
      client.from("indicators").select("*").order("sort_order"),
      client.from("indicator_targets").select("*").order("period_order"),
      client.from("indicator_actuals").select("*").eq("status", "approved").order("period_order"),
    ]);
    if (compRes.error) throw new Error(compRes.error.message);
    if (indRes.error) throw new Error(indRes.error.message);
    if (tgtRes.error) throw new Error(tgtRes.error.message);
    if (actRes.error) throw new Error(actRes.error.message);

    const targetsByInd = new Map();
    for (const t of tgtRes.data || []) {
      const list = targetsByInd.get(t.indicator_id) || [];
      list.push(t);
      targetsByInd.set(t.indicator_id, list);
    }
    const actualsByInd = groupByIndicator(
      (actRes.data || []).map((row) => Object.assign(toActualDTO(row), { indicator_id: row.indicator_id })),
    );
    return {
      components: buildComponents(compRes.data || []),
      indicators: buildIndicators(indRes.data || [], targetsByInd, actualsByInd, new Map()),
      isAdmin: false,
      role: null,
    };
  }

  // Authenticated: approved actuals for everyone, PLUS the caller's own
  // pending/rejected rows (RLS: "status = approved OR recorded_by = me OR
  // I'm admin"). Also resolves the caller's role/isAdmin flag.
  async function getFramework() {
    const client = sb();
    const user = await getUser();
    if (!user) throw new Error("Sessão expirada. Inicie sessão novamente.");

    const [compRes, indRes, tgtRes, actRes, evRes, adminRoleRes, myRoleRes] = await Promise.all([
      client.from("components").select("*").order("sort_order"),
      client.from("indicators").select("*").order("sort_order"),
      client.from("indicator_targets").select("*").order("period_order"),
      client.from("indicator_actuals").select("*").order("period_order"),
      client.from("indicator_evidence").select("*"),
      client.rpc("has_role", { _user_id: user.id, _role: "admin" }),
      client
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);
    if (compRes.error) throw new Error(compRes.error.message);
    if (indRes.error) throw new Error(indRes.error.message);
    if (tgtRes.error) throw new Error(tgtRes.error.message);
    if (actRes.error) throw new Error(actRes.error.message);

    const isAdmin = !adminRoleRes.error && adminRoleRes.data === true;
    const role = (myRoleRes && myRoleRes.data && myRoleRes.data.role) || null;

    const targetsByInd = new Map();
    for (const t of tgtRes.data || []) {
      const list = targetsByInd.get(t.indicator_id) || [];
      list.push(t);
      targetsByInd.set(t.indicator_id, list);
    }
    const actualsByInd = groupByIndicator(
      (actRes.data || []).map((row) => Object.assign(toActualDTO(row), { indicator_id: row.indicator_id })),
    );
    const evidenceByInd = new Map();
    if (!evRes.error) {
      for (const e of evRes.data || []) evidenceByInd.set(e.indicator_id, e);
    }

    return {
      userId: user.id,
      components: buildComponents(compRes.data || []),
      indicators: buildIndicators(indRes.data || [], targetsByInd, actualsByInd, evidenceByInd),
      isAdmin,
      role,
    };
  }

  // -------- Recording actual values --------
  async function upsertActual(payload) {
    const user = await getUser();
    if (!user) throw new Error("Sessão expirada.");
    const row = {
      indicator_id: payload.indicator_id,
      period_label: payload.period_label,
      period_order: payload.period_order,
      province: payload.province || "Nacional",
      district: payload.district || "Todos",
      demographic: payload.demographic || "geral",
      beneficiary_status: payload.beneficiary_status || "geral",
      actual_value: payload.actual_value ?? null,
      actual_text: payload.actual_text ?? null,
      note: payload.note ?? null,
      recorded_by: user.id,
    };
    const { error } = await sb()
      .from("indicator_actuals")
      .upsert(row, { onConflict: DISAGGREGATION_CONFLICT_TARGET });
    if (error) throw new Error(error.message);
    return { ok: true };
  }

  async function deleteActual(key) {
    const { error } = await sb()
      .from("indicator_actuals")
      .delete()
      .eq("indicator_id", key.indicator_id)
      .eq("period_label", key.period_label)
      .eq("province", key.province || "Nacional")
      .eq("district", key.district || "Todos")
      .eq("demographic", key.demographic || "geral")
      .eq("beneficiary_status", key.beneficiary_status || "geral");
    if (error) throw new Error(error.message);
    return { ok: true };
  }

  // -------- Indicator management (admin) --------
  async function saveIndicator(data) {
    const row = {
      name: data.name,
      unit: data.unit,
      level: data.level,
      value_type: data.value_type,
      component_id: data.component_id ?? null,
      baseline_value: data.baseline_value ?? null,
      final_target: data.final_target ?? null,
      frequency: data.frequency ?? null,
      data_source: data.data_source ?? null,
      methodology: data.methodology ?? null,
      responsibility: data.responsibility ?? null,
      description: data.description ?? null,
    };
    if (data.id) {
      const { error } = await sb().from("indicators").update(row).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true, id: data.id };
    }
    const { data: inserted, error } = await sb().from("indicators").insert(row).select("id").single();
    if (error) throw new Error(error.message);
    return { ok: true, id: inserted.id };
  }

  async function deleteIndicator(id) {
    await sb().from("indicator_actuals").delete().eq("indicator_id", id);
    await sb().from("indicator_targets").delete().eq("indicator_id", id);
    const { error } = await sb().from("indicators").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  }

  async function resetAllActuals() {
    const { error } = await sb().from("indicator_actuals").delete().not("id", "is", null);
    if (error) throw new Error(error.message);
    return { ok: true };
  }

  // -------- Approval workflow --------
  async function listPendingActuals() {
    const { data, error } = await sb()
      .from("indicator_actuals")
      .select("*, indicators!inner(id, name, unit, value_type, component_id)")
      .eq("status", "pending")
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    const rows = data || [];

    const recorderIds = Array.from(new Set(rows.map((r) => r.recorded_by).filter(Boolean)));
    const recorderMap = new Map();
    if (recorderIds.length > 0) {
      const { data: profiles } = await sb()
        .from("profiles")
        .select("id, full_name, organization, email")
        .in("id", recorderIds);
      for (const p of profiles || []) {
        recorderMap.set(p.id, { name: p.full_name, email: p.email, organization: p.organization });
      }
    }

    return rows.map((row) => {
      const info = row.recorded_by ? recorderMap.get(row.recorded_by) : null;
      const dto = toActualDTO(row);
      return Object.assign(dto, {
        indicator_id: row.indicators.id,
        indicator_name: row.indicators.name,
        indicator_unit: row.indicators.unit,
        indicator_value_type: row.indicators.value_type,
        component_id: row.indicators.component_id,
        recorded_by_name: info ? info.name : null,
        recorded_by_email: info ? info.email : null,
        recorded_by_organization: info ? info.organization : null,
      });
    });
  }

  async function notifyRecorder(actualId, type, reason) {
    const { data: row } = await sb()
      .from("indicator_actuals")
      .select("recorded_by, indicator_id, period_label, indicators(name)")
      .eq("id", actualId)
      .maybeSingle();
    if (!row || !row.recorded_by) return;
    const indicatorName = (row.indicators && row.indicators.name) || "indicador";
    const title = type === "approved" ? `Valor aprovado — ${indicatorName}` : `Valor rejeitado — ${indicatorName}`;
    const message =
      type === "approved"
        ? `O seu valor para ${row.period_label} foi validado e publicado.`
        : `O seu valor para ${row.period_label} foi rejeitado.${reason ? ` Motivo: ${reason}` : ""}`;
    await sb().from("user_notifications").insert({
      user_id: row.recorded_by,
      type,
      title,
      message,
      actual_id: actualId,
      indicator_id: row.indicator_id,
    });
  }

  async function approveActual(id) {
    const { error } = await sb().from("indicator_actuals").update({ status: "approved" }).eq("id", id);
    if (error) throw new Error(error.message);
    await notifyRecorder(id, "approved");
    return { ok: true };
  }

  async function rejectActual(id, reason) {
    const { error } = await sb()
      .from("indicator_actuals")
      .update({ status: "rejected", rejection_reason: reason })
      .eq("id", id);
    if (error) throw new Error(error.message);
    await notifyRecorder(id, "rejected", reason);
    return { ok: true };
  }

  async function updatePendingActual(patch) {
    const row = {};
    if (patch.actual_value !== undefined) row.actual_value = patch.actual_value;
    if (patch.actual_text !== undefined) row.actual_text = patch.actual_text;
    if (patch.note !== undefined) row.note = patch.note;
    const { error } = await sb().from("indicator_actuals").update(row).eq("id", patch.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  }

  // -------- Evidence (PDF) --------
  async function saveEvidenceRecord(data) {
    const user = await getUser();
    const { error } = await sb()
      .from("indicator_evidence")
      .upsert(
        {
          indicator_id: data.indicator_id,
          file_path: data.file_path,
          file_name: data.file_name || null,
          uploaded_by: user ? user.id : null,
        },
        { onConflict: "indicator_id" },
      );
    if (error) throw new Error(error.message);
    return { ok: true };
  }

  async function deleteEvidence(indicatorId) {
    const { data: existing } = await sb()
      .from("indicator_evidence")
      .select("file_path")
      .eq("indicator_id", indicatorId)
      .maybeSingle();
    if (existing && existing.file_path) {
      await sb().storage.from(EVIDENCE_BUCKET).remove([existing.file_path]);
    }
    const { error } = await sb().from("indicator_evidence").delete().eq("indicator_id", indicatorId);
    if (error) throw new Error(error.message);
    return { ok: true };
  }

  async function uploadEvidence(indicatorId, file) {
    const path = `${(await getUser()).id}/${indicatorId}.pdf`;
    const { error } = await sb().storage.from(EVIDENCE_BUCKET).upload(path, file, { upsert: true });
    if (error) throw new Error(error.message);
    await saveEvidenceRecord({ indicator_id: indicatorId, file_path: path, file_name: file.name });
    return { ok: true };
  }

  async function getEvidenceUrl(indicatorId) {
    const { data: row } = await sb()
      .from("indicator_evidence")
      .select("file_path")
      .eq("indicator_id", indicatorId)
      .maybeSingle();
    if (!row || !row.file_path) return null;
    const { data: signed, error } = await sb()
      .storage.from(EVIDENCE_BUCKET)
      .createSignedUrl(row.file_path, EVIDENCE_SIGNED_URL_TTL_SECONDS);
    if (error) throw new Error(error.message);
    return signed ? signed.signedUrl : null;
  }

  // -------- Users (admin) --------
  async function listUsers() {
    const [{ data: profiles, error: pErr }, { data: roles, error: rErr }] = await Promise.all([
      sb().from("profiles").select("id, full_name, organization, email, created_at").order("created_at", { ascending: false }),
      sb().from("user_roles").select("user_id, role"),
    ]);
    if (pErr) throw new Error(pErr.message);
    if (rErr) throw new Error(rErr.message);
    const roleByUser = new Map((roles || []).map((r) => [r.user_id, r.role]));
    return (profiles || []).map((p) => ({
      id: p.id,
      full_name: p.full_name,
      organization: p.organization,
      email: p.email,
      role: roleByUser.get(p.id) || null,
    }));
  }

  async function setUserRole(userId, role) {
    const del = await sb().from("user_roles").delete().eq("user_id", userId);
    if (del.error) throw new Error(del.error.message);
    const ins = await sb().from("user_roles").insert({ user_id: userId, role });
    if (ins.error) throw new Error(ins.error.message);
    return { ok: true };
  }

  // -------- Notifications --------
  async function listMyNotifications() {
    const user = await getUser();
    if (!user) return [];
    const { data, error } = await sb()
      .from("user_notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return data || [];
  }

  async function markNotificationRead(id) {
    const { error } = await sb().from("user_notifications").update({ read: true }).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  }

  async function markAllNotificationsRead() {
    const user = await getUser();
    if (!user) return { ok: true };
    const { error } = await sb()
      .from("user_notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);
    if (error) throw new Error(error.message);
    return { ok: true };
  }

  global.GORS = global.GORS || {};
  Object.assign(global.GORS, {
    getSession, getUser, requireAuth,
    getPublicFramework, getFramework,
    upsertActual, deleteActual,
    saveIndicator, deleteIndicator, resetAllActuals,
    listPendingActuals, approveActual, rejectActual, updatePendingActual,
    saveEvidenceRecord, deleteEvidence, uploadEvidence, getEvidenceUrl,
    listUsers, setUserRole,
    listMyNotifications, markNotificationRead, markAllNotificationsRead,
  });
})(window);
