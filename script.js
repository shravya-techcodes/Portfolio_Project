document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("primaryNav");

  function closeNav() {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    nav.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ---------- Theme toggle (light / dark) ---------- */
  const themeToggle = document.getElementById("themeToggle");
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("portfolio-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      themeToggle?.setAttribute("aria-pressed", "true");
      themeToggle?.setAttribute("aria-label", "Switch to light mode");
    } else {
      root.removeAttribute("data-theme");
      themeToggle?.setAttribute("aria-pressed", "false");
      themeToggle?.setAttribute("aria-label", "Switch to dark mode");
    }
  }

  applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

  themeToggle?.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    const next = isDark ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("portfolio-theme", next);
  });

  /* ---------- Sticky header shadow on scroll ---------- */
  const header = document.getElementById("siteHeader");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 8) {
      header.style.boxShadow = "0 8px 24px -18px rgba(0,0,0,0.4)";
    } else {
      header.style.boxShadow = "none";
    }
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${id}`,
            );
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );

  sections.forEach((section) => navObserver.observe(section));

  /* ---------- Scroll reveal animations ---------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById("backToTop");
  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Contact form validation ---------- */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  function setError(id, message) {
    const errEl = document.getElementById(`${id}Error`);
    if (errEl) errEl.textContent = message;
  }

  function validateField(field) {
    const value = field.value.trim();
    if (field.id === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        setError("email", "Enter a valid email address.");
        return false;
      }
    } else if (!value) {
      setError(field.id, "This field is required.");
      return false;
    }
    setError(field.id, "");
    return true;
  }

  form?.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fields = form.querySelectorAll("input, textarea");
    let isValid = true;
    fields.forEach((field) => {
      if (!validateField(field)) isValid = false;
    });

    if (!isValid) {
      status.textContent = "Please fix the highlighted fields.";
      status.style.color = "var(--crimson)";
      return;
    }

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // No backend configured — open the user's mail client as a fallback.
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:hello@example.com?subject=${subject}&body=${body}`;

    status.style.color = "var(--indigo)";
    status.textContent = "Opening your email client to send this message…";
    form.reset();
  });
});
