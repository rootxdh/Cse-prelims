/* CSE Prelims Lab — shared shell, theme, storage, rendering helpers */
(function () {
  "use strict";

  var STORE_KEY = "cseprelims.v1";

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function readStore() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return { theme: null, progress: {}, lastTopic: null, lastAt: null };
      var data = JSON.parse(raw);
      if (!data.progress) data.progress = {};
      return data;
    } catch (e) {
      return { theme: null, progress: {}, lastTopic: null, lastAt: null };
    }
  }

  function writeStore(data) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch (e) {}
  }

  var store = readStore();

  function getTheme() {
    if (store.theme) return store.theme;
    try {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    } catch (e) {}
    return "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var btn = $("[data-theme-toggle]");
    if (btn) {
      btn.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
      btn.innerHTML = theme === "dark"
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>';
    }
  }

  function toggleTheme() {
    var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    store.theme = next;
    writeStore(store);
    applyTheme(next);
  }

  function icon(name) {
    var paths = {
      home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
      book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
      chart: '<path d="M3 3v18h18"/><path d="M7 15v3M12 10v8M17 6v12"/>',
      file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/>',
      layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
      arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
      check: '<path d="M20 6 9 17l-5-5"/>',
      target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
      info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
      clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
      star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2-6.2 3.2 1.2-6.8-5-4.9 6.9-1Z"/>',
      bookmark: '<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/>',
      menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
      close: '<path d="M6 6l12 12M18 6 6 18"/>',
      download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
      refresh: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
      shuffle: '<path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="m15 15 6 6M4 4l5 5"/>'
    };
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (paths[name] || "") + "</svg>";
  }

  function navItems() {
    return [
      { href: "index.html", label: "Home", page: "home" },
      { href: "csat.html", label: "CSAT", page: "csat" },
      { href: "analysis.html", label: "Analysis", page: "analysis" },
      { href: "papers.html", label: "Papers", page: "papers" },
      { href: "gs.html", label: "GS", page: "gs" }
    ];
  }

  function renderHeader() {
    var mount = $("[data-site-header]");
    if (!mount) return;
    var page = document.body.getAttribute("data-page") || "";
    var links = navItems().map(function (n) {
      var cur = n.page === page ? ' aria-current="page"' : "";
      return '<a href="' + n.href + '"' + cur + ">" + n.label + "</a>";
    }).join("");
    mount.outerHTML =
      '<header class="site-header">' +
        '<div class="header-inner">' +
          '<a class="brand" href="index.html" aria-label="CSE Prelims Lab home">' +
            '<span class="brand-mark">PL</span>' +
            '<span class="brand-text"><b>CSE Prelims Lab</b><span>GS + CSAT · 2027</span></span>' +
          '</a>' +
          '<nav class="nav" id="primary-nav" aria-label="Primary">' + links + '</nav>' +
          '<div class="header-actions">' +
            '<button class="icon-btn" type="button" data-theme-toggle aria-label="Toggle theme"></button>' +
            '<button class="icon-btn nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="primary-nav">' + icon("menu") + '</button>' +
          '</div>' +
        '</div>' +
      '</header>';
    var toggle = $(".nav-toggle");
    var nav = $("#primary-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.innerHTML = open ? icon("close") : icon("menu");
      });
      nav.addEventListener("click", function (e) {
        if (e.target.tagName === "A" && nav.classList.contains("is-open")) {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.innerHTML = icon("menu");
        }
      });
    }
    var themeBtn = $("[data-theme-toggle]");
    if (themeBtn) themeBtn.addEventListener("click", toggleTheme);
  }

  function renderFooter() {
    var mount = $("[data-site-footer]");
    if (!mount) return;
    mount.outerHTML =
      '<footer class="site-footer">' +
        '<div class="container">' +
          '<div class="footer-grid">' +
            '<div>' +
              '<a class="brand" href="index.html" style="margin-bottom:.7rem">' +
                '<span class="brand-mark">PL</span>' +
                '<span class="brand-text"><b>CSE Prelims Lab</b><span>GS + CSAT · 2027</span></span>' +
              '</a>' +
              '<p>A focused practice workspace for UPSC Civil Services Prelims. Built around official papers, topic-wise PYQ analysis and deliberately calibrated question banks.</p>' +
            '</div>' +
            '<div class="footer-col"><b>CSAT</b><a href="csat.html#quant">Quantitative Aptitude</a><a href="csat.html#reasoning">Logical Reasoning</a><a href="analysis.html">PYQ Analysis</a></div>' +
            '<div class="footer-col"><b>Resources</b><a href="papers.html">Official Papers</a><a href="gs.html">GS Track</a><a href="index.html">Home</a></div>' +
          '</div>' +
          '<div class="footer-bottom"><span>Independent study project. Not affiliated with UPSC.</span><span>Data: official UPSC CSAT papers, 2021–2026 + PYQ compilations.</span></div>' +
        '</div>' +
      '</footer>';
  }

  function getProgress(topicId) {
    return store.progress[topicId] || {};
  }

  function saveQuestion(topicId, qid, patch) {
    if (!store.progress[topicId]) store.progress[topicId] = {};
    var prev = store.progress[topicId][qid] || {};
    for (var k in patch) if (Object.prototype.hasOwnProperty.call(patch, k)) prev[k] = patch[k];
    store.progress[topicId][qid] = prev;
    store.lastTopic = topicId;
    store.lastAt = Date.now();
    writeStore(store);
  }

  function resetTopic(topicId) {
    delete store.progress[topicId];
    writeStore(store);
  }

  function statsFor(topicId, bank) {
    var p = getProgress(topicId);
    var attempted = 0, correct = 0, revealed = 0, bookmarked = 0;
    if (bank && bank.length) {
      bank.forEach(function (q) {
        var s = p[q.id];
        if (!s) return;
        if (typeof s.s === "number" || s.r) attempted++;
        if (s.c) correct++;
        if (s.r) revealed++;
        if (s.b) bookmarked++;
      });
    } else {
      Object.keys(p).forEach(function (qid) {
        var s = p[qid];
        if (!s) return;
        if (typeof s.s === "number" || s.r) attempted++;
        if (s.c) correct++;
        if (s.r) revealed++;
        if (s.b) bookmarked++;
      });
    }
    var cat = topicById(topicId);
    var total = (bank && bank.length) ? bank.length : (cat && cat.count) || attempted;
    return {
      total: total, attempted: attempted, correct: correct, revealed: revealed, bookmarked: bookmarked,
      accuracy: attempted ? Math.round((correct / attempted) * 100) : 0,
      pct: total ? Math.round((attempted / total) * 100) : 0
    };
  }

  function catalog() { return window.CATALOG || { topics: [] }; }
  function topicById(id) {
    return catalog().topics.filter(function (t) { return t.id === id; })[0] || null;
  }
  function bankFor(id) { return (window.BANKS && window.BANKS[id]) || []; }

  function topicCard(t) {
    var bank = bankFor(t.id);
    var st = statsFor(t.id, bank);
    var color = t.color || "accent";
    return '<a class="topic-card" href="practice.html?topic=' + encodeURIComponent(t.id) + '">' +
      '<div class="topic-top">' +
        '<span class="topic-mono ' + color + '">' + t.mono + '</span>' +
        '<div><div class="topic-title">' + t.title + '</div></div>' +
      '</div>' +
      '<p class="topic-sub">' + t.short + '</p>' +
      '<div class="topic-meta">' +
        '<span class="chip">' + t.count + ' Qs</span>' +
        '<span class="chip">' + t.level + '</span>' +
        '<span class="progress-mini">' + st.attempted + '/' + st.total + '</span>' +
      '</div>' +
      '<div class="mini-bar"><span style="width:' + st.pct + '%"></span></div>' +
    '</a>';
  }

  function renderTopicGrids() {
    var quantMount = $("[data-quant-grid]");
    var lrMount = $("[data-lr-grid]");
    var topics = catalog().topics;
    if (quantMount) {
      quantMount.innerHTML = topics.filter(function (t) { return t.track === "quant"; }).map(topicCard).join("");
    }
    if (lrMount) {
      lrMount.innerHTML = topics.filter(function (t) { return t.track === "reasoning"; }).map(topicCard).join("");
    }
  }

  function renderHomeStats() {
    var topics = catalog().topics;
    var totalQs = topics.reduce(function (a, t) { return a + (t.count || 0); }, 0);
    var totalAttempted = 0, totalCorrect = 0;
    topics.forEach(function (t) {
      var st = statsFor(t.id, bankFor(t.id));
      totalAttempted += st.attempted;
      totalCorrect += st.correct;
    });
    $$("[data-stat]").forEach(function (el) {
      var key = el.getAttribute("data-stat");
      if (key === "questions") el.textContent = totalQs;
      if (key === "topics") el.textContent = topics.length;
      if (key === "papers") el.textContent = (catalog().analysis && catalog().analysis.years || []).length || 6;
      if (key === "accuracy") el.textContent = totalAttempted ? Math.round((totalCorrect / totalAttempted) * 100) + "%" : "—";
      if (key === "attempted") el.textContent = totalAttempted;
    });
    var resume = $("[data-resume]");
    if (resume) {
      var last = store.lastTopic && topicById(store.lastTopic);
      if (last) {
        resume.innerHTML = 'Continue: <b>' + last.title + '</b>';
        resume.setAttribute("href", "practice.html?topic=" + encodeURIComponent(last.id));
      } else {
        resume.innerHTML = 'Start with Number System <span aria-hidden="true">→</span>';
        resume.setAttribute("href", "practice.html?topic=number-system");
      }
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function year() {
    var y = new Date().getFullYear();
    return y > 2026 ? "2026" : String(y);
  }

  window.APP = {
    $: $, $$: $$, icon: icon, store: store, readStore: readStore, writeStore: writeStore,
    getProgress: getProgress, saveQuestion: saveQuestion, resetTopic: resetTopic,
    statsFor: statsFor, catalog: catalog, topicById: topicById, bankFor: bankFor,
    topicCard: topicCard, renderTopicGrids: renderTopicGrids, renderHomeStats: renderHomeStats,
    escapeHtml: escapeHtml, year: year
  };

  applyTheme(getTheme());
  document.addEventListener("DOMContentLoaded", function () {
    renderHeader();
    renderFooter();
    renderTopicGrids();
    renderHomeStats();
  });
})();
