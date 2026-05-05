document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Mobile nav ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
      toggle.textContent = links.classList.contains("open") ? "Schließen" : "Menü";
    });
    links.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.textContent = "Menü";
      });
    });
  }

  /* ---------- Year stamp ---------- */
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Respect reduced motion: skip animation wiring ---------- */
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  /* ---------- Auto-tag reveal targets ---------- */
  // Generic fade-up for section headers, panels, cards, etc.
  const fadeUpTargets = [
    ".section-eyebrow",
    ".section-title",
    ".section-script",
    ".menu-section",
    ".legend",
    ".contact-card",
    ".imprint",
    ".hours-strip",
    ".payment-notice",
    ".map-wrap",
    ".res-grid",
    ".menu-hero",
  ];
  document.querySelectorAll(fadeUpTargets.join(",")).forEach(el => {
    el.classList.add("reveal");
  });

  // Section divider: line grow
  document.querySelectorAll(".section-divider").forEach(el => {
    // observed separately so it animates via its own keyframe
  });

  // Split rows: alternating slide
  document.querySelectorAll(".split").forEach(split => {
    const isReverse = split.classList.contains("reverse");
    const img = split.querySelector(".split-img");
    const content = split.querySelector(".split-content");
    if (img && content) {
      if (isReverse) {
        img.classList.add("reveal-right");
        content.classList.add("reveal-left");
      } else {
        img.classList.add("reveal-left");
        content.classList.add("reveal-right");
      }
    }
  });

  // Menu items: stagger inside each menu-grid
  document.querySelectorAll(".menu-grid").forEach(grid => {
    grid.classList.add("reveal-stagger");
    grid.querySelectorAll(".menu-item").forEach(item => {
      item.classList.add("reveal");
    });
  });

  // Menu hero tiles: stagger
  document.querySelectorAll(".menu-hero").forEach(hero => {
    hero.classList.add("reveal-stagger");
    hero.querySelectorAll(".menu-hero-tile").forEach(t => {
      t.classList.add("reveal-scale");
    });
  });

  // Footer columns: stagger
  document.querySelectorAll(".footer-inner").forEach(footer => {
    footer.classList.add("reveal-stagger");
    footer.querySelectorAll(".footer-brand, .footer-col").forEach(col => {
      col.classList.add("reveal");
    });
  });

  /* ---------- IntersectionObserver: trigger .in-view ----------
     threshold:0 + small rootMargin → fires as soon as ANY part of an
     element enters the viewport. Critical for very tall elements (e.g.
     the long Datenschutzerklärung article) where requiring a percentage
     of the element to be visible would never be satisfied. */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0,
    rootMargin: "0px 0px -40px 0px",
  });

  /* Safety net: any reveal element that starts above the fold on page
     load gets revealed immediately, even if the observer's first tick
     hasn't fired yet. */
  requestAnimationFrame(() => {
    document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger, .section-divider").forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("in-view");
      }
    });
  });

  document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger, .section-divider"
  ).forEach(el => observer.observe(el));

  /* ---------- Subtle parallax on hero image ---------- */
  const heroImage = document.querySelector(".hero-image");
  if (heroImage && window.matchMedia("(min-width: 981px)").matches) {
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y < 800) {
            heroImage.style.backgroundPosition = `center ${50 + y * 0.04}%`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---------- Nav: shrink on scroll for a touch of polish ---------- */
  const nav = document.querySelector(".site-nav");
  if (nav) {
    let lastY = 0;
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      if (y > 60) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
      lastY = y;
    }, { passive: true });
  }

  /* ---------- Magnetic tilt on CTA buttons (subtle) ---------- */
  document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.08}px, ${-2 + y * 0.08}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
});
