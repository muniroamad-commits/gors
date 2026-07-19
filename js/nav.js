/* ============================================================
   GORS.nav — barra lateral, topo e sino de notificações da área
   autenticada. Chamado por cada página depois de obter a sessão
   e o "framework" (dados + isAdmin/role).
   ============================================================ */
(function (global) {
  "use strict";

  const ICONS = {
    dashboard: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>',
    indicators: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/></svg>',
    reports: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/></svg>',
    approvals: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3z"/><path d="m9 12 2 2 4-4"/></svg>',
    users: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    bell: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
    logout: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
    menu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  };

  function navItems(isAdmin) {
    const base = [
      { key: "dashboard", label: "Painel", href: "dashboard.html", icon: ICONS.dashboard },
      { key: "indicators", label: "Indicadores", href: "indicators.html", icon: ICONS.indicators },
      { key: "reports", label: "Relatórios", href: "reports.html", icon: ICONS.reports },
    ];
    if (isAdmin) {
      base.push({ key: "approvals", label: "Aprovações", href: "approvals.html", icon: ICONS.approvals });
      base.push({ key: "users", label: "Utilizadores", href: "users.html", icon: ICONS.users });
    }
    return base;
  }

  function renderShell(fw, activeKey) {
    const sidebar = document.getElementById("app-sidebar");
    const topbar = document.getElementById("app-topbar");
    if (sidebar) {
      const items = navItems(fw.isAdmin);
      sidebar.innerHTML = `
        <div class="brand">
          <span class="brand-mark"><img src="img/adin-logo.png" alt="ADIN"></span>
          <div>
            <p style="font-weight:600;font-size:0.9rem;">GORS · MozCommunity</p>
            <p style="font-size:0.72rem;opacity:0.65;">Monitoria de indicadores</p>
          </div>
        </div>
        <nav>
          ${items
            .map(
              (it) =>
                `<a href="${it.href}" class="${it.key === activeKey ? "active" : ""}">${it.icon}<span>${it.label}</span></a>`,
            )
            .join("")}
        </nav>`;
    }
    if (topbar) {
      topbar.innerHTML = `
        <button class="btn btn-ghost sidebar-toggle" id="sidebar-toggle" aria-label="Menu">${ICONS.menu}</button>
        <div style="flex:1"></div>
        <div style="position:relative">
          <button class="bell-btn" id="bell-btn" aria-label="Notificações">${ICONS.bell}<span id="bell-count" class="bell-count hidden">0</span></button>
          <div id="bell-panel" class="bell-panel hidden"></div>
        </div>
        <button class="btn btn-ghost btn-sm" id="sign-out-btn">${ICONS.logout} Terminar sessão</button>`;

      document.getElementById("sidebar-toggle")?.addEventListener("click", () => {
        document.getElementById("app-sidebar")?.classList.toggle("open");
      });
      document.getElementById("sign-out-btn")?.addEventListener("click", async () => {
        await window.GORS.sb.auth.signOut();
        window.location.href = "auth.html";
      });
      initBell(fw);
    }
  }

  const POLL_INTERVAL_MS = 30000;

  async function initBell(fw) {
    const btn = document.getElementById("bell-btn");
    const panel = document.getElementById("bell-panel");
    const countEl = document.getElementById("bell-count");
    if (!btn || !panel) return;

    async function refresh() {
      try {
        if (fw.isAdmin) {
          const pending = await window.GORS.listPendingActuals();
          renderAdminBell(pending);
        } else {
          const items = await window.GORS.listMyNotifications();
          renderUserBell(items);
        }
      } catch {
        // Silently ignore — the bell is a convenience, not critical path.
      }
    }

    function renderAdminBell(pending) {
      const count = pending.length;
      countEl.textContent = count > 9 ? "9+" : String(count);
      countEl.classList.toggle("hidden", count === 0);
      const list = pending.slice(0, 8);
      panel.innerHTML = `
        <div class="flex-between" style="padding:0.75rem 1rem;border-bottom:1px solid var(--border);">
          <div>
            <p class="font-semibold text-sm">Indicadores pendentes</p>
            <p class="text-xs muted">${count === 0 ? "Nada por rever" : `${count} valor(es) por validar`}</p>
          </div>
          <a href="approvals.html" class="btn btn-ghost btn-sm">Ver tudo</a>
        </div>
        ${
          list.length === 0
            ? `<p class="text-sm muted" style="padding:2rem 1rem;text-align:center;">Sem notificações no momento.</p>`
            : list
                .map(
                  (row) => `
          <div class="bell-item">
            <p class="font-medium">${window.GORS.escapeHtml(row.indicator_name)}</p>
            <p class="muted text-xs mt-1">${window.GORS.escapeHtml(row.period_label)} · ${window.GORS.escapeHtml(row.province)}</p>
            <p class="mt-1"><span class="muted">Valor: </span><strong>${window.GORS.escapeHtml(
              row.indicator_value_type === "text"
                ? row.actual_text || "—"
                : window.GORS.formatValue(row.actual_value, row.indicator_value_type),
            )}</strong></p>
          </div>`,
                )
                .join("")
        }`;
    }

    function renderUserBell(items) {
      const unread = items.filter((n) => !n.read).length;
      countEl.textContent = unread > 9 ? "9+" : String(unread);
      countEl.classList.toggle("hidden", unread === 0);
      panel.innerHTML = `
        <div class="flex-between" style="padding:0.75rem 1rem;border-bottom:1px solid var(--border);">
          <div>
            <p class="font-semibold text-sm">Notificações</p>
            <p class="text-xs muted">${unread === 0 ? "Tudo lido" : `${unread} por ler`}</p>
          </div>
          ${unread > 0 ? `<button class="btn btn-ghost btn-sm" id="bell-mark-all">Marcar todas</button>` : ""}
        </div>
        ${
          items.length === 0
            ? `<p class="text-sm muted" style="padding:2rem 1rem;text-align:center;">Sem notificações.</p>`
            : items
                .slice(0, 15)
                .map(
                  (n) => `
          <div class="bell-item" style="${n.read ? "" : "background:var(--muted);"}" data-id="${n.id}">
            <div class="flex-between">
              <p class="font-medium">${window.GORS.escapeHtml(n.title)}</p>
              <span class="badge ${n.type === "approved" ? "status-on_track" : "status-off_track"}">${n.type === "approved" ? "Aprovado" : n.type === "rejected" ? "Rejeitado" : window.GORS.escapeHtml(n.type)}</span>
            </div>
            ${n.message ? `<p class="muted text-xs mt-1">${window.GORS.escapeHtml(n.message)}</p>` : ""}
            <div class="flex gap-2 mt-2">
              ${n.indicator_id ? `<a class="btn btn-ghost btn-sm" href="indicator.html?id=${n.indicator_id}">Ver indicador</a>` : ""}
              ${!n.read ? `<button class="btn btn-ghost btn-sm bell-mark-one" data-id="${n.id}">Marcar lida</button>` : ""}
            </div>
          </div>`,
                )
                .join("")
        }`;
      panel.querySelector("#bell-mark-all")?.addEventListener("click", async () => {
        await window.GORS.markAllNotificationsRead();
        refresh();
      });
      panel.querySelectorAll(".bell-mark-one").forEach((b) =>
        b.addEventListener("click", async () => {
          await window.GORS.markNotificationRead(b.dataset.id);
          refresh();
        }),
      );
    }

    btn.addEventListener("click", () => {
      panel.classList.toggle("hidden");
      if (!panel.classList.contains("hidden")) refresh();
    });
    document.addEventListener("click", (e) => {
      if (!panel.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
        panel.classList.add("hidden");
      }
    });

    await refresh();
    setInterval(refresh, POLL_INTERVAL_MS);
  }

  global.GORS = global.GORS || {};
  Object.assign(global.GORS, { renderShell });
})(window);
