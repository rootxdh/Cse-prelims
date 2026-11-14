/* CSE Prelims Lab — topic practice engine */
(function () {
  "use strict";
  var APP = window.APP;
  var $ = APP.$, $$ = APP.$$;
  var KEYS = ["A", "B", "C", "D"];

  var params = new URLSearchParams(window.location.search);
  var topicId = params.get("topic") || (APP.catalog().topics[0] && APP.catalog().topics[0].id);
  var topic = APP.topicById(topicId);
  var bank = APP.bankFor(topicId);
  var order = [];
  var filter = "all";
  var timerStart = Date.now();
  var timerPaused = false;
  var pausedAt = 0;

  function attempted(s) {
    return s && (typeof s.s === "number" || s.r);
  }

  function isCorrect(q, s) {
    return !!(s && s.r && s.s === q.ans);
  }

  function statusOf(q) {
    var s = APP.getProgress(topicId)[q.id];
    if (!s) return { text: "Not attempted", cls: "" };
    if (s.r) {
      if (typeof s.s !== "number") return { text: "Answer revealed", cls: "" };
      return s.s === q.ans ? { text: "Correct", cls: "ok" } : { text: "Incorrect", cls: "bad" };
    }
    if (typeof s.s === "number") return { text: "Attempted", cls: "" };
    if (s.b) return { text: "Bookmarked", cls: "" };
    return { text: "Not attempted", cls: "" };
  }

  function optionClass(q, idx, s) {
    var cls = "option";
    if (s && typeof s.s === "number" && s.s === idx) cls += " is-selected";
    if (s && s.r) {
      if (idx === q.ans) cls += " is-correct";
      else if (s && s.s === idx) cls += " is-wrong";
    }
    return cls;
  }

  function cardHtml(q, i) {
    var s = APP.getProgress(topicId)[q.id] || {};
    var st = statusOf(q);
    var diff = q.diff || "medium";
    var diffLabel = { easy: "Easy", medium: "Medium", hard: "Hard" }[diff] || "Medium";
    var diagram = q.diagram ? '<div class="q-diagram">' + q.diagram + "</div>" : "";
    var options = q.opts.map(function (o, idx) {
      return '<button type="button" class="' + optionClass(q, idx, s) + '" data-opt="' + idx + '"' + (s.r ? " disabled" : "") + ">" +
        '<span class="key">' + KEYS[idx] + '</span><span class="txt">' + o + "</span></button>";
    }).join("");
    var ansText = typeof q.ans === "number" ? q.ans : null;
    var answerBlock = ansText === null ? "" :
      '<details class="answer"' + (s.r ? "" : "") + ">" +
        "<summary>" + (s.r ? "Show answer & explanation" : "Show answer") + "</summary>" +
        '<div class="answer-body">' +
          '<div class="answer-correct"><span class="key">' + KEYS[ansText] + "</span><span>Correct option: (" + KEYS[ansText].toLowerCase() + ") " + q.opts[ansText] + "</span></div>" +
          '<div class="exp">' + q.exp + "</div>" +
          (q.trick ? '<div class="trick"><b>Shortcut:</b> ' + q.trick + "</div>" : "") +
        "</div>" +
      "</details>";
    var bm = s.b
      ? '<button type="button" class="icon-btn bookmark-btn is-saved" data-bookmark aria-pressed="true" aria-label="Remove bookmark" style="color:var(--accent)">' + APP.icon("bookmark") + "</button>"
      : '<button type="button" class="icon-btn bookmark-btn" data-bookmark aria-pressed="false" aria-label="Bookmark question">' + APP.icon("bookmark") + "</button>";
    return '<article class="q-card" id="q-' + q.id + '" data-qid="' + q.id + '">' +
      '<div class="q-head">' +
        '<span class="q-num">Q ' + String(i + 1).padStart(2, "0") + "</span>" +
        '<span class="difficulty d-' + diff + '">' + diffLabel + "</span>" +
        (q.tag ? '<span class="chip">' + q.tag + "</span>" : "") +
        '<div class="q-tags">' + bm + "</div>" +
      "</div>" +
      '<div class="q-stem">' + q.q + diagram + "</div>" +
      '<div class="options">' + options + "</div>" +
      '<div class="q-foot"><span class="q-status ' + st.cls + '" data-status>' + st.text + "</span>" +
        '<span style="margin-left:auto;font-size:.72rem;color:var(--muted)">' + (q.pattern || "") + "</span></div>" +
      answerBlock +
    "</article>";
  }

  function renderList() {
    var list = $("#question-list");
    if (!list) return;
    var visible = order.filter(function (idx) {
      var q = bank[idx];
      var s = APP.getProgress(topicId)[q.id];
      if (filter === "unattempted") return !attempted(s);
      if (filter === "incorrect") return s && s.r && s.s !== q.ans;
      if (filter === "bookmarked") return s && s.b;
      return true;
    });
    if (!visible.length) {
      list.innerHTML = '<div class="empty-state"><b>Nothing here yet.</b>' +
        (filter === "incorrect" ? "Attempt and reveal some questions; wrong answers will collect here." :
         filter === "bookmarked" ? "Bookmark questions while practising to build a revision list." :
         filter === "unattempted" ? "You have attempted every question in this topic." :
         "No questions available.") + "</div>";
    } else {
      list.innerHTML = visible.map(function (idx) { return cardHtml(bank[idx], idx); }).join("");
    }
    $("#visible-count").textContent = visible.length + " shown";
    bindCards();
    renderNav();
  }

  function bindCards() {
    $$(".q-card").forEach(function (card) {
      var qid = card.getAttribute("data-qid");
      var q = bank.filter(function (x) { return x.id === qid; })[0];
      if (!q) return;
      $$(".option", card).forEach(function (btn) {
        btn.addEventListener("click", function () {
          var s = APP.getProgress(topicId)[qid] || {};
          if (s.r) return;
          var idx = Number(btn.getAttribute("data-opt"));
          APP.saveQuestion(topicId, qid, { s: idx, c: idx === q.ans });
          var ns = APP.getProgress(topicId)[qid];
          $$(".option", card).forEach(function (b, j) { b.className = optionClass(q, j, ns); });
          var st = statusOf(q);
          var statusEl = $("[data-status]", card);
          statusEl.textContent = st.text;
          statusEl.className = "q-status " + st.cls;
          updateStats();
        });
      });
      var details = $("details.answer", card);
      if (details) {
        details.addEventListener("toggle", function () {
          if (!details.open) return;
          APP.saveQuestion(topicId, qid, { r: true });
          var ns = APP.getProgress(topicId)[qid];
          $$(".option", card).forEach(function (b, j) {
            b.className = optionClass(q, j, ns);
            b.disabled = true;
          });
          var st = statusOf(q);
          var statusEl = $("[data-status]", card);
          statusEl.textContent = st.text;
          statusEl.className = "q-status " + st.cls;
          updateStats();
          renderNav();
        });
      }
      var bm = $("[data-bookmark]", card);
      if (bm) {
        bm.addEventListener("click", function () {
          var s = APP.getProgress(topicId)[qid] || {};
          APP.saveQuestion(topicId, qid, { b: !s.b });
          var now = APP.getProgress(topicId)[qid];
          bm.setAttribute("aria-pressed", now.b ? "true" : "false");
          bm.style.color = now.b ? "var(--accent)" : "";
          bm.setAttribute("aria-label", now.b ? "Remove bookmark" : "Bookmark question");
          updateStats();
          if (filter === "bookmarked") renderList();
        });
      }
    });
  }

  function updateStats() {
    var st = APP.statsFor(topicId, bank);
    $$("[data-pstat]").forEach(function (el) {
      var k = el.getAttribute("data-pstat");
      el.textContent = st[k] !== undefined ? st[k] : "—";
    });
    var fill = $("[data-progress-fill]");
    if (fill) fill.style.width = st.pct + "%";
    var label = $("[data-progress-label]");
    if (label) label.textContent = st.pct + "%";
    var acc = $("[data-pstat='accuracy']");
    if (acc) acc.textContent = st.attempted ? st.accuracy + "%" : "—";
  }

  function renderNav() {
    var nav = $("#q-nav");
    if (!nav) return;
    var prog = APP.getProgress(topicId);
    nav.innerHTML = order.map(function (idx) {
      var q = bank[idx];
      var s = prog[q.id];
      var cls = "q-dot";
      if (s && s.r && typeof s.s === "number") cls += s.s === q.ans ? " is-correct" : " is-wrong";
      else if (attempted(s)) cls += " is-seen";
      return '<button type="button" class="' + cls + '" data-jump="' + q.id + '" title="Question ' + (idx + 1) + '">' + (idx + 1) + "</button>";
    }).join("");
    $$("[data-jump]", nav).forEach(function (b) {
      b.addEventListener("click", function () {
        if (filter !== "all") { filter = "all"; syncFilterButtons(); renderList(); }
        var target = document.getElementById("q-" + b.getAttribute("data-jump"));
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function syncFilterButtons() {
    $$("[data-filter]").forEach(function (b) {
      var active = b.getAttribute("data-filter") === filter;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function initToolbar() {
    $$("[data-filter]").forEach(function (b) {
      b.addEventListener("click", function () {
        filter = b.getAttribute("data-filter");
        syncFilterButtons();
        renderList();
      });
    });
    var shuffle = $("[data-shuffle]");
    if (shuffle) {
      shuffle.addEventListener("click", function () {
        for (var i = order.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var t = order[i]; order[i] = order[j]; order[j] = t;
        }
        renderList();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
    var reset = $("[data-reset]");
    if (reset) {
      reset.addEventListener("click", function () {
        if (!window.confirm("Reset all progress, answers and bookmarks for this topic?")) return;
        APP.resetTopic(topicId);
        filter = "all";
        syncFilterButtons();
        renderList();
        updateStats();
      });
    }
    var timer = $("#session-timer");
    if (timer) {
      setInterval(function () {
        if (timerPaused) return;
        var sec = Math.floor((Date.now() - timerStart) / 1000);
        var m = String(Math.floor(sec / 60)).padStart(2, "0");
        var s = String(sec % 60).padStart(2, "0");
        timer.textContent = m + ":" + s;
      }, 1000);
      var pause = $("[data-pause]");
      if (pause) {
        pause.addEventListener("click", function () {
          if (timerPaused) {
            timerStart += Date.now() - pausedAt;
            timerPaused = false;
            pause.textContent = "Pause";
          } else {
            pausedAt = Date.now();
            timerPaused = true;
            pause.textContent = "Resume";
          }
        });
      }
    }
  }

  function initHeaderContent() {
    if (!topic) {
      $("#practice-root").innerHTML = '<div class="empty-state" style="margin:3rem 0"><b>Topic not found.</b>Return to the <a href="csat.html">CSAT hub</a> and choose a topic.</div>';
      return false;
    }
    document.title = topic.title + " — CSAT Practice | CSE Prelims Lab";
    $("#crumb-track").textContent = topic.track === "quant" ? "Quantitative Aptitude" : "Logical Reasoning";
    $("#crumb-track").href = "csat.html#" + (topic.track === "quant" ? "quant" : "reasoning");
    $("#crumb-topic").textContent = topic.title;
    $("#topic-title").textContent = topic.title;
    $("#topic-sub").textContent = topic.short;
    $("#topic-chip-track").textContent = topic.track === "quant" ? "Quant" : "Logical Reasoning";
    $("#topic-chip-count").textContent = bank.length + " questions";
    $("#topic-chip-level").textContent = topic.level;
    return true;
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!topic) {
      initHeaderContent();
      return;
    }
    if (bank.length || !topic.file) {
      start();
      return;
    }
    var script = document.createElement("script");
    script.src = topic.file;
    script.onload = function () {
      bank = APP.bankFor(topicId);
      start();
    };
    script.onerror = function () {
      initHeaderContent();
      $("#question-list").innerHTML = '<div class="empty-state"><b>Could not load this question bank.</b>Check that <code>' + topic.file + "</code> exists, then reload the page.</div>";
    };
    document.head.appendChild(script);
  });

  function start() {
    if (!initHeaderContent()) return;
    order = bank.map(function (_, i) { return i; });
    initToolbar();
    syncFilterButtons();
    renderList();
    updateStats();
    if (!bank.length) {
      $("#question-list").innerHTML = '<div class="empty-state"><b>Question bank loading.</b>If this persists, make sure the data file for this topic is included on this page.</div>';
    }
  }
})();
