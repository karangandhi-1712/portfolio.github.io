// script.js — updated: theme toggle, button interactions, reveal on scroll, form handling
(function () {
  /* ------------------ helpers ------------------ */
  const $ = (s, ctx = document) => (ctx || document).querySelector(s);
  const $$ = (s, ctx = document) =>
    Array.from((ctx || document).querySelectorAll(s));
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ------------------ THEME ------------------ */
  const root = document.documentElement;
  const container = $("#page") || document.body;
  const themeToggle = $("#themeToggle");
  const themeStatus = $("#themeStatus");

  // Possible modes: "light", "dark", "auto"
  function getStoredTheme() {
    try {
      return localStorage.getItem("site-theme");
    } catch (e) {
      return null;
    }
  }
  function storeTheme(v) {
    try {
      localStorage.setItem("site-theme", v);
    } catch (e) {}
  }

  function applyTheme(mode) {
    // mode: 'light' | 'dark' | 'auto'
    if (!container) return;
    if (mode === "auto") {
      // use system setting
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      container.setAttribute("data-theme", systemDark ? "dark" : "light");
    } else {
      container.setAttribute("data-theme", mode);
    }
    // update toggle aria
    if (themeToggle)
      themeToggle.setAttribute(
        "aria-pressed",
        mode === "dark" ? "true" : "false"
      );
    if (themeStatus) themeStatus.textContent = `Theme set to ${mode}`;
  }

  // Cycle theme on toggle: auto -> dark -> light -> auto
  function nextTheme(current) {
    if (current === "auto") return "dark";
    if (current === "dark") return "light";
    return "auto";
  }

  // init
  (function initTheme() {
    let mode = getStoredTheme() || "auto";
    applyTheme(mode);
    // Make header button reflect actual state (visual update only)
    if (themeToggle) {
      themeToggle.addEventListener("click", (e) => {
        e.preventDefault();
        mode = nextTheme(mode);
        storeTheme(mode);
        applyTheme(mode);
      });

      // keyboard friendly: Enter/Space
      themeToggle.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          themeToggle.click();
        }
      });
    }
  })();

  /* ------------------ Smooth scroll for anchors ------------------ */
  function smoothScrollToId(hash) {
    if (!hash) return;
    const id = hash.replace(/^#/, "");
    const el = document.getElementById(id);
    if (!el) return;
    if (prefersReducedMotion) el.scrollIntoView();
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      if (href.startsWith("#")) {
        e.preventDefault();
        history.pushState(null, "", href);
        smoothScrollToId(href);
      }
    });
  });

  /* ------------------ Fade-up reveal ------------------ */
  (function reveal() {
    const els = $$(".fade-up");
    if (prefersReducedMotion) {
      els.forEach((el) => el.classList.add("visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
  })();

  /* ------------------ Buttons: keyboard/press accessibility / micro-feedback  ------------------ */
  // For interactive elements with .btn, set aria-pressed when activated via keyboard/mouse briefly so :active styles can be applied accessibly
  $$(".btn").forEach((btn) => {
    // mouse down -> pressed state
    btn.addEventListener("pointerdown", () => {
      btn.setAttribute("data-pressed", "true");
      setTimeout(() => btn.removeAttribute("data-pressed"), 120);
    });

    // keyboard activation: Enter/Space
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        btn.setAttribute("data-pressed", "true");
        setTimeout(() => btn.removeAttribute("data-pressed"), 120);
      }
    });

    // allow toggles to have aria-pressed semantics if they have role or data-toggle
    if (btn.dataset.toggle === "true") {
      btn.setAttribute("role", "button");
      btn.setAttribute("aria-pressed", "false");
      btn.addEventListener("click", () => {
        const cur = btn.getAttribute("aria-pressed") === "true";
        btn.setAttribute("aria-pressed", String(!cur));
      });
    }
  });

  /* ------------------ Contact form handling ------------------ */
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const fd = new FormData(this);
      const name = (fd.get("name") || "").trim();
      const email = (fd.get("email") || "").trim();
      const message = (fd.get("message") || "").trim();
      if (!name || !email || !message) {
        // small inline accessible alert (fallback to alert)
        if (typeof window.ariaAlert === "function")
          window.ariaAlert("Please fill all fields.");
        else alert("Please fill all fields.");
        return;
      }

      // Create mailto fallback and success UI
      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(message + "\n\n— " + name + "\n" + email);
      // Attempt to open mail client
      window.location.href = `mailto:karan@example.com?subject=${subject}&body=${body}`;

      // Reset form
      this.reset();

      // visual confirmation (small ephemeral)
      const btn = this.querySelector('button[type="submit"]');
      if (btn) {
        const old = btn.textContent;
        btn.textContent = "Sent ✓";
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = old;
          btn.disabled = false;
        }, 2200);
      }
    });
  }

  /* ------------------ Download CV placeholder ------------------ */
  const downloadCv = $("#downloadCv");
  if (downloadCv) {
    downloadCv.addEventListener("click", (e) => {
      e.preventDefault();
      // Small placeholder PDF-ish blob (replace with your real CV file or server URL)
      const content = `
        Karan Gandhi - CV
        -----------------
        Replace this with your real CV PDF file.
      `;
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Karan-Gandhi-CV.txt"; // change to .pdf when real file available
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    });
  }

  /* ------------------ small UX: keyboard shortcut to toggle theme (T) ------------------ */
  window.addEventListener("keydown", (e) => {
    if (
      e.key.toLowerCase() === "t" &&
      (e.ctrlKey || e.metaKey) === false &&
      e.altKey === false
    ) {
      // quick toggle between dark & light (not auto)
      const cur = localStorage.getItem("site-theme") || "auto";
      const next = cur === "dark" ? "light" : "dark";
      localStorage.setItem("site-theme", next);
      applyTheme(next);
      if (themeToggle)
        themeToggle.animate(
          [{ transform: "scale(0.98)" }, { transform: "none" }],
          { duration: 200, easing: "ease" }
        );
    }
  });
})();
