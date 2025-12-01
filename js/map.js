(function () {
  const state = {
    stops: [
      { label: "A", name: "Airport", etaMinutes: 0, distanceKm: 0 },
      { label: "B", name: "Hotel", etaMinutes: 24, distanceKm: 18 },
      { label: "C", name: "Old Town", etaMinutes: 45, distanceKm: 33 },
      { label: "D", name: "Coastline", etaMinutes: 72, distanceKm: 54 },
    ],
    activeIndex: 1,
  };

  function renderStops() {
    const list = document.querySelector("[data-map='route-list']");
    if (!list) return;

    list.innerHTML = "";
    state.stops.forEach((stop, index) => {
      const item = document.createElement("div");
      item.className = "map-route-list__item" + (index === state.activeIndex ? " is-active" : "");
      item.dataset.index = String(index);
      item.innerHTML = `<strong>${stop.label}</strong> ${stop.name}
        <div class="stat-row" style="margin-top:4px;font-size:0.78rem;opacity:.8">
          <span>${stop.distanceKm} km</span>
          <span>${stop.etaMinutes} min</span>
        </div>`;
      list.appendChild(item);
    });
  }

  function updateSummary() {
    const totalDistance = state.stops[state.stops.length - 1].distanceKm;
    const totalMinutes = state.stops[state.stops.length - 1].etaMinutes;

    const distanceEl = document.querySelector("[data-map='summary-distance']");
    const timeEl = document.querySelector("[data-map='summary-time']");

    if (distanceEl) distanceEl.textContent = `${totalDistance} km`;
    if (timeEl) timeEl.textContent = `${totalMinutes} min total`;
  }

  function initInteractions() {
    const list = document.querySelector("[data-map='route-list']");
    if (!list) return;

    list.addEventListener("click", (event) => {
      const target = event.target.closest(".map-route-list__item");
      if (!target) return;

      const index = Number(target.dataset.index || "0");
      state.activeIndex = index;
      renderStops();
    });

    const addBtn = document.querySelector("[data-map='add-stop']");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        const input = document.querySelector("[data-map='add-stop-input']");
        const name = (input && input.value.trim()) || "Custom stop";
        state.stops.push({
          label: String.fromCharCode("A".charCodeAt(0) + state.stops.length),
          name,
          etaMinutes: state.stops[state.stops.length - 1].etaMinutes + 18,
          distanceKm: state.stops[state.stops.length - 1].distanceKm + 12,
        });
        if (input) input.value = "";
        state.activeIndex = state.stops.length - 1;
        renderStops();
        updateSummary();
      });
    }
  }

  function boot() {
    if (!document.querySelector("[data-page='map']")) return;
    renderStops();
    updateSummary();
    initInteractions();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
