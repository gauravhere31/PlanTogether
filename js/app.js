(function () {
  const prefersReduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  function initSectionReveal() {
    if (prefersReduceMotion || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "-10% 0px -10% 0px",
        threshold: 0.1,
      }
    );

    document.querySelectorAll(".reveal-on-scroll").forEach((el) => observer.observe(el));
  }

  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        const targetId = anchor.getAttribute("href");
        const target = targetId && document.querySelector(targetId);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: prefersReduceMotion ? "auto" : "smooth" });
      });
    });
  }

  function initCTAHooks() {
    const ctaButtons = document.querySelectorAll("[data-action='start-planning']");
    ctaButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        console.log("[PlanTogether] CTA — start planning clicked", {
          origin: btn.dataset.origin || "unknown",
        });
        const target = document.querySelector("[data-section='product-demo']");
        if (target) {
          target.scrollIntoView({ behavior: prefersReduceMotion ? "auto" : "smooth" });
        }
      });
    });
  }

  function initForms() {
    const newsletter = document.querySelector("[data-form='newsletter']");
    if (newsletter) {
      newsletter.addEventListener("submit", (event) => {
        event.preventDefault();
        const email = newsletter.querySelector("input[type='email']")?.value || "";
        console.log("[PlanTogether] Newsletter sign-up", { email });
        alert("Thanks for subscribing. We'll share our launch roadmap soon.");
      });
    }

    const contactForm = document.querySelector("[data-form='contact']");
    if (contactForm) {
      contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        console.log("[PlanTogether] Contact form submission stub");
        window.location.href = "thankyou.html";
      });
    }
  }

  function boot() {
    initSectionReveal();
    initSmoothAnchors();
    initCTAHooks();
    initForms();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
