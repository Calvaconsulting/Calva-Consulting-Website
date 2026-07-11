/* =========================================================
   Calva Consulting — interactions
   ========================================================= */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isDesktop = window.matchMedia("(min-width: 901px)").matches;

  /* ---------- current year ---------- */
  const yearEl = document.querySelector(".year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- nav scroll state ---------- */
  const nav = document.querySelector(".nav");
  const progress = document.querySelector(".progress span");
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 24);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");
  if (toggle && links) {
    const setOpen = (open) => {
      links.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    };
    toggle.addEventListener("click", () =>
      setOpen(toggle.getAttribute("aria-expanded") !== "true")
    );
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => setOpen(false))
    );
  }

  /* ---------- reveal on scroll ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReduced) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- custom cursor + magnetic + hover targets ---------- */
  if (isDesktop && !prefersReduced) {
    const dot = document.querySelector(".cursor");
    const ring = document.querySelector(".cursor-ring");
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    loop();

    const hoverTargets = document.querySelectorAll(
      "a, button, .card, .workitem, .step, input, textarea"
    );
    hoverTargets.forEach((t) => {
      t.addEventListener("mouseenter", () => {
        dot.classList.add("is-hover");
        ring.classList.add("is-hover");
      });
      t.addEventListener("mouseleave", () => {
        dot.classList.remove("is-hover");
        ring.classList.remove("is-hover");
      });
    });

    // magnetic buttons
    document.querySelectorAll(".magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* ---------- hero canvas: nodes resolving into a signal ---------- */
  const canvas = document.querySelector(".hero__canvas");
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext("2d");
    let w, h, dpr, nodes = [], raf, mouse = { x: -999, y: -999 };
    const ACCENT = "216,86,58";
    const INK = "35,67,60";

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const build = () => {
      const count = Math.min(64, Math.floor((w * h) / 20000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6,
      }));
    };

    const step = () => {
      ctx.clearRect(0, 0, w, h);
      const maxDist = 148;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        // gentle attraction to cursor
        const dxm = mouse.x - n.x, dym = mouse.y - n.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < 180) {
          n.x += (dxm / dm) * 0.5;
          n.y += (dym / dm) * 0.5;
        }

        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = n.x - m.x, dy = n.y - m.y;
          const d = Math.hypot(dx, dy);
          if (d < maxDist) {
            const a = (1 - d / maxDist) * 0.5;
            ctx.strokeStyle = `rgba(${INK},${a * 0.5})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        const near = Math.hypot(mouse.x - n.x, mouse.y - n.y) < 180;
        ctx.fillStyle = near ? `rgba(${ACCENT},0.9)` : `rgba(${INK},0.55)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(step);
    };

    window.addEventListener("mousemove", (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    window.addEventListener("mouseleave", () => { mouse.x = -999; mouse.y = -999; });
    window.addEventListener("resize", resize);
    resize();
    step();

    // pause when hero off-screen
    if ("IntersectionObserver" in window) {
      const heroIO = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { if (!raf) step(); }
          else { cancelAnimationFrame(raf); raf = null; }
        });
      });
      heroIO.observe(canvas);
    }
  }

  /* ---------- contact form (front-end only) ---------- */
  const form = document.querySelector(".contact__form");
  if (form) {
    const note = form.querySelector(".contact__note");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.querySelector("#name");
      const email = form.querySelector("#email");
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      if (!name.value.trim() || !emailOk) {
        note.style.color = "#f0a58f";
        note.textContent = "Please add your name and a valid email.";
        return;
      }
      note.style.color = "#7fd8a0";
      note.textContent = "Thanks — this demo form isn't wired up yet. [EDIT: connect to email/Formspree.]";
      form.reset();
    });
  }
})();
