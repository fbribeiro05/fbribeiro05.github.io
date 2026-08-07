// Language switcher, progress bar, currency display,
// credits expand/collapse, copy-to-clipboard, mobile nav.
// Reads window.TRANSLATIONS / window.CURRENCY_CONFIG / window.CAMPAIGN
// from translations.js (loaded before this file).

(function () {
  "use strict";

  var LANG_KEY = "fbr-lang";
  var SUPPORTED_LANGS = ["en", "fr", "de", "pt"];

  function getStoredLang() {
    var stored = null;
    try {
      stored = localStorage.getItem(LANG_KEY);
    } catch (e) {
      // localStorage unavailable (private mode, etc.) — fall back silently
    }
    return SUPPORTED_LANGS.indexOf(stored) !== -1 ? stored : "en";
  }

  function storeLang(lang) {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (e) {
      // ignore — non-critical
    }
  }

  // ---------- i18n text swap ----------
  function applyTranslations(lang) {
    var dict = window.TRANSLATIONS[lang] || window.TRANSLATIONS.en;

    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });

    document.querySelectorAll("[data-i18n][data-i18n-attr]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var attr = el.getAttribute("data-i18n-attr");
      if (dict[key] !== undefined) el.setAttribute(attr, dict[key]);
    });

    document.querySelectorAll("[data-i18n]:not([data-i18n-attr])").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.textContent = dict[key];
    });

    document.documentElement.setAttribute("lang", lang);

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-lang") === lang);
      btn.setAttribute("aria-pressed", btn.getAttribute("data-lang") === lang ? "true" : "false");
    });
  }

  // ---------- Currency ----------
  function formatCurrency(amountGBP, lang) {
    var cfg = window.CURRENCY_CONFIG[lang] || window.CURRENCY_CONFIG.en;
    var converted = amountGBP * cfg.rate;
    try {
      return new Intl.NumberFormat(cfg.locale, {
        style: "currency",
        currency: cfg.code,
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
      }).format(converted);
    } catch (e) {
      // Fallback if Intl/currency code is unsupported in a given browser
      return cfg.symbol + " " + Math.round(converted).toLocaleString(cfg.locale);
    }
  }

  function applyCurrencyDisplay(lang) {
    var goal = window.CAMPAIGN.goalGBP;
    var raised = window.CAMPAIGN.raisedGBP;
    var pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 1000) / 10) : 0;

    var statRaised = document.getElementById("stat-raised");
    var statGoal = document.getElementById("stat-goal");
    var statPercent = document.getElementById("stat-percent");
    var progressFill = document.getElementById("progress-fill");
    var progressBar = progressFill ? progressFill.closest(".progress-bar") : null;
    var rateNote = document.getElementById("rate-note");

    if (statRaised) statRaised.textContent = formatCurrency(raised, lang);
    if (statGoal) statGoal.textContent = formatCurrency(goal, lang);
    if (statPercent) statPercent.textContent = pct + "%";
    if (progressFill) progressFill.style.width = pct + "%";
    if (progressBar) progressBar.setAttribute("aria-valuenow", String(pct));

    // GBP is the native currency for EN — no conversion note needed there
    if (rateNote) rateNote.hidden = lang === "en";

    document.querySelectorAll(".budget-amount[data-amount-gbp]").forEach(function (el) {
      var gbp = parseFloat(el.getAttribute("data-amount-gbp"));
      if (!isNaN(gbp)) el.textContent = formatCurrency(gbp, lang);
    });
  }

  // ---------- Language switching ----------
  function setLanguage(lang) {
    if (SUPPORTED_LANGS.indexOf(lang) === -1) lang = "en";
    applyTranslations(lang);
    applyCurrencyDisplay(lang);
    storeLang(lang);
  }

  function initLangSwitcher() {
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setLanguage(btn.getAttribute("data-lang"));
        closeMobileNav();
      });
    });
  }

  // ---------- Mobile nav ----------
  var navToggle, navMenu;

  function openMobileNav() {
    navToggle.setAttribute("aria-expanded", "true");
    navMenu.classList.add("is-open");
  }
  function closeMobileNav() {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute("aria-expanded", "false");
    navMenu.classList.remove("is-open");
  }
  function initMobileNav() {
    navToggle = document.getElementById("nav-toggle");
    navMenu = document.getElementById("nav-menu");
    if (!navToggle || !navMenu) return;

    navToggle.addEventListener("click", function () {
      var isOpen = navMenu.classList.contains("is-open");
      if (isOpen) closeMobileNav(); else openMobileNav();
    });

    navMenu.querySelectorAll(".nav-links a, .nav-cta").forEach(function (link) {
      link.addEventListener("click", closeMobileNav);
    });

    document.addEventListener("click", function (e) {
      if (!navMenu.classList.contains("is-open")) return;
      if (navMenu.contains(e.target) || navToggle.contains(e.target)) return;
      closeMobileNav();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMobileNav();
    });
  }

  // ---------- Credits expand/collapse ----------
  function initCredits() {
    var toggle = document.getElementById("credits-toggle");
    var list = document.getElementById("credits-list");
    if (!toggle || !list) return;

    toggle.addEventListener("click", function () {
      var isOpen = list.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // ---------- Copy to clipboard ----------
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand("copy");
        resolve();
      } catch (e) {
        reject(e);
      } finally {
        document.body.removeChild(ta);
      }
    });
  }

  function initCopyButtons() {
    document.querySelectorAll(".copy-btn[data-copy-target]").forEach(function (btn) {
      var originalLabelKey = btn.getAttribute("data-i18n");
      btn.addEventListener("click", function () {
        var targetEl = document.getElementById(btn.getAttribute("data-copy-target"));
        if (!targetEl) return;
        var text = targetEl.textContent.trim();

        copyText(text).then(function () {
          var lang = document.documentElement.getAttribute("lang") || "en";
          var dict = window.TRANSLATIONS[lang] || window.TRANSLATIONS.en;
          btn.classList.add("is-copied");
          btn.textContent = dict["contribute.copiedLabel"];
          window.setTimeout(function () {
            btn.classList.remove("is-copied");
            btn.textContent = dict[originalLabelKey];
          }, 1800);
        }).catch(function () {
          // Clipboard unavailable — the value is still visible as selectable text
        });
      });
    });
  }

  // ---------- Boot ----------
  document.addEventListener("DOMContentLoaded", function () {
    initLangSwitcher();
    initMobileNav();
    initCredits();
    initCopyButtons();
    setLanguage(getStoredLang());
  });
})();
