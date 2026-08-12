(function () {
  "use strict";

  var root = document.documentElement;
  var THEME_KEY = "ab-theme-v2";

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var loomLabel = document.querySelector('[data-theme-label="loom"]');
    var fabLabel = document.querySelector('[data-theme-label="fab"]');
    if (loomLabel && fabLabel) {
      loomLabel.classList.toggle("active", theme === "loom");
      fabLabel.classList.toggle("active", theme === "fab");
    }
  }

  var savedTheme = localStorage.getItem(THEME_KEY) || "fab";
  applyTheme(savedTheme);

  var toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") === "loom" ? "fab" : "loom";
      applyTheme(current);
      localStorage.setItem(THEME_KEY, current);
    });
  }

  var LANG_KEY = "ab-lang";

  function applyLang(lang) {
    root.setAttribute("data-lang", lang);
    root.setAttribute("lang", lang === "hi" ? "hi" : "en");
    document.querySelectorAll("[data-en]").forEach(function (el) {
      var value = lang === "hi" ? el.getAttribute("data-hi") : el.getAttribute("data-en");
      if (value == null) return;
      if (el.hasAttribute("data-i18n-html")) {
        el.innerHTML = value;
      } else {
        el.textContent = value;
      }
    });
    document.querySelectorAll("[data-placeholder-en]").forEach(function (el) {
      var value = lang === "hi" ? el.getAttribute("data-placeholder-hi") : el.getAttribute("data-placeholder-en");
      if (value != null) el.setAttribute("placeholder", value);
    });

    document.dispatchEvent(new CustomEvent("ab:langchange", { detail: { lang: lang } }));
    var enLabel = document.querySelector('[data-lang-label="en"]');
    var hiLabel = document.querySelector('[data-lang-label="hi"]');
    if (enLabel && hiLabel) {
      enLabel.classList.toggle("active", lang === "en");
      hiLabel.classList.toggle("active", lang === "hi");
    }
  }

  var savedLang = localStorage.getItem(LANG_KEY) || "en";
  applyLang(savedLang);

  var langToggle = document.getElementById("langToggle");
  if (langToggle) {
    langToggle.addEventListener("click", function () {
      var current = root.getAttribute("data-lang") === "hi" ? "en" : "hi";
      applyLang(current);
      localStorage.setItem(LANG_KEY, current);
    });
  }

  var burger = document.getElementById("hamburger");
  var navLinks = document.getElementById("navLinks");
  if (burger && navLinks) {
    burger.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  var here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    var target = a.getAttribute("href");
    if (target === here || (here === "" && target === "index.html")) {
      a.setAttribute("aria-current", "page");
    }
  });

  var bar = document.getElementById("progressThread");
  function updateProgress() {
    if (!bar) return;
    var h = document.documentElement;
    var scrollable = h.scrollHeight - h.clientHeight;
    var pct = scrollable > 0 ? (h.scrollTop / scrollable) * 100 : 0;
    bar.style.width = pct + "%";
  }
  document.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  var counters = document.querySelectorAll("[data-counter]");
  function animateCounter(el) {
    var end = parseFloat(el.getAttribute("data-counter"));
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1200;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = end % 1 === 0 ? Math.round(end * eased) : (end * eased).toFixed(1);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (counters.length) {
    if ("IntersectionObserver" in window) {
      var cio = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              cio.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach(function (el) { cio.observe(el); });
    } else {
      counters.forEach(animateCounter);
    }
  }

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

