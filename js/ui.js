/* ============================================================
   GORS.ui — pequenos utilitários de interface partilhados
   (toasts, diálogos, formatação de erros) usados por todas as
   páginas.
   ============================================================ */
(function (global) {
  "use strict";

  function toastRoot() {
    let el = document.getElementById("toast-root");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast-root";
      document.body.appendChild(el);
    }
    return el;
  }

  function toast(message, type) {
    const root = toastRoot();
    const el = document.createElement("div");
    el.className = `toast ${type || ""}`;
    el.textContent = message;
    root.appendChild(el);
    setTimeout(() => el.remove(), 4500);
  }

  function toastError(err) {
    toast(err && err.message ? err.message : String(err), "error");
  }

  function openDialog(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove("hidden");
  }
  function closeDialog(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  }

  // Close any open overlay when clicking its backdrop.
  document.addEventListener("click", (e) => {
    if (e.target.classList && e.target.classList.contains("overlay")) {
      e.target.classList.add("hidden");
    }
  });

  function setBusy(btn, busy, label) {
    if (!btn) return;
    btn.disabled = busy;
    if (busy) {
      btn.dataset.label = btn.innerHTML;
      btn.innerHTML = `<span class="spinner"></span> ${label || "A processar…"}`;
    } else if (btn.dataset.label) {
      btn.innerHTML = btn.dataset.label;
    }
  }

  global.GORS = global.GORS || {};
  Object.assign(global.GORS, { toast, toastError, openDialog, closeDialog, setBusy });
})(window);
