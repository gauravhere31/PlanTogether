(function () {
  function parseAmount(value) {
    const n = Number(String(value).replace(/[^0-9.-]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }

  function recalc() {
    const inputs = document.querySelectorAll("[data-budget='expense']");
    if (!inputs.length) return;

    let total = 0;
    inputs.forEach((input) => {
      total += parseAmount(input.value);
    });

    const people = parseAmount(document.querySelector("[data-budget='people']")?.value || 1) || 1;

    const totalEl = document.querySelector("[data-budget='total']");
    const perPersonEl = document.querySelector("[data-budget='per-person']");

    if (totalEl) totalEl.textContent = `$${total.toFixed(0)}`;
    if (perPersonEl) perPersonEl.textContent = `$${(total / people).toFixed(0)}`;
  }

  function init() {
    if (!document.querySelector("[data-page='budgeting']")) return;

    const root = document.querySelector("[data-budget='root']");
    if (!root) return;

    root.addEventListener("input", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) return;
      if (!target.matches("[data-budget='expense'], [data-budget='people']")) return;
      recalc();
    });

    recalc();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
