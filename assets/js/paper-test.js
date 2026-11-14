/* Official paper tests — timed attempt, submit, solutions. */
(function () {
  "use strict";

  var $ = APP.$, $$ = APP.$$;
  var KEYS = ["a", "b", "c", "d"];
  var LKEY = "cseprelims.papertests.v1";
  var LIMIT = 120 * 60;

  var params = new URLSearchParams(window.location.search);
  var paperId = (params.get("paper") || "csat-2021").toLowerCase().replace(/[^a-z0-9-]/g, "");
  var paper = null;
  var entry = null;
  var timerId = null;

  function readAll() {
    try { return JSON.parse(localStorage.getItem(LKEY) || "{}"); }
    catch (e) { return {}; }
  }
  function writeEntry(e) {
    var all = readAll();
    if (e) all[paperId] = e;
    else delete all[paperId];
    try { localStorage.setItem(LKEY, JSON.stringify(all)); } catch (err) {}
  }
  function state() {
    if (!entry || !entry.startedAt) return "intro";
    return entry.submittedAt ? "done" : "running";
  }
  function fmtClock(sec) {
    var m = Math.floor(sec / 60), s = sec % 60;
    return (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
  }
  function fmtDuration(sec) {
    var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    if (h) return h + "h " + m + "m";
    return m + "m " + s + "s";
  }

  function showError(msg) {
    $("#intro-panel").hidden = false;
    $("#intro-panel").innerHTML = '<div class="empty-state"><b>Test unavailable.</b>' + msg +
      '<p style="margin-top:.9rem"><a class="btn btn-ghost btn-sm" href="papers.html">Back to Papers</a></p></div>';
    $("#paper-title").textContent = "Paper test";
  }

  function loadPaper(cb) {
    var s = document.createElement("script");
    s.src = "data/papers/" + paperId + ".js";
    s.onload = function () { cb((window.PAPER_TESTS || {})[paperId] || null); };
    s.onerror = function () { cb(null); };
    document.body.appendChild(s);
  }

  function setChrome() {
    document.title = "CSAT " + paper.year + " Test — CSE Prelims Lab";
    $("#crumb-paper").textContent = "CSAT " + paper.year + " test";
    $("#paper-title").textContent = "CSAT " + paper.year + " — paper test";
    $("#paper-sub").textContent = paper.note || "Quantitative Aptitude + Logical Reasoning, in original paper order.";
    $("#paper-chips").innerHTML =
      '<span class="chip chip-accent">Official paper</span>' +
      '<span class="chip">' + paper.questions.length + " questions</span>" +
      '<span class="chip">120 minutes</span>' +
      '<span class="chip">2.5 marks · −⅓ negative</span>';
    $("#pdf-link").href = "papers/" + paperId + ".pdf";
  }

  function render() {
    var st = state();
    $("#intro-panel").hidden = st !== "intro";
    $("#result-panel").hidden = st !== "done";
    $("#test-layout").hidden = st === "intro";
    $("#expand-solutions").hidden = st !== "done";

    if (st === "intro") {
      renderIntro();
    } else if (st === "running") {
      renderQuestions();
      renderPalette();
      updateAnswered();
      startTimer();
    } else {
      if (timerId) { clearInterval(timerId); timerId = null; }
      renderResultPanel();
      renderQuestions();
      renderPalette();
      $("#test-timer").textContent = "Submitted";
      $("#test-timer").classList.remove("is-low");
    }
  }

  function renderIntro() {
    $("#intro-panel").innerHTML =
      '<div class="callout teal"><b>Exam mode.</b> ' +
        paper.questions.length + " questions from the official CSAT " + paper.year +
        " paper — quantitative aptitude and logical reasoning only; reading-comprehension items are omitted. " +
        "Original paper numbering is kept (Q16, Q17 …), so every question can be cross-checked against the PDF." +
      "</div>" +
      '<div class="chart-card" style="margin-top:1rem">' +
        "<h3>Rules</h3>" +
        '<ul style="margin:.3rem 0 .9rem 1.1rem;color:var(--ink-2);line-height:1.9">' +
          "<li>Time limit: <b>120 minutes</b>. The attempt auto-submits when the clock hits zero.</li>" +
          "<li>Marking: <b>+2.5</b> per correct, <b>−⅓</b> penalty per wrong, unattempted scores zero.</li>" +
          "<li>Answers save automatically. Solutions unlock only after you submit.</li>" +
          "<li>CSAT is qualifying: <b>133 / 200</b> (66.67%) is the bar — accuracy beats coverage.</li>" +
        "</ul>" +
        '<button type="button" class="btn btn-primary" id="start-btn">Start test · 120:00</button>' +
      "</div>";
    $("#start-btn").addEventListener("click", start);
  }

  function start() {
    entry = { startedAt: Date.now(), answers: {}, submittedAt: null, timeUsed: null };
    writeEntry(entry);
    render();
  }

  function startTimer() {
    if (timerId) clearInterval(timerId);
    tick();
    timerId = setInterval(tick, 1000);
  }

  function tick() {
    if (state() !== "running") { clearInterval(timerId); timerId = null; return; }
    var left = LIMIT - Math.floor((Date.now() - entry.startedAt) / 1000);
    if (left <= 0) { submit(true); return; }
    var el = $("#test-timer");
    el.textContent = fmtClock(left);
    el.classList.toggle("is-low", left <= 300);
  }

  function updateAnswered() {
    var answered = paper.questions.filter(function (q) {
      return entry && entry.answers && entry.answers[q.n] !== undefined;
    }).length;
    var total = paper.questions.length;
    var el = $("#stat-answered");
    if (el) el.textContent = answered;
    var totalEl = $("#stat-total");
    if (totalEl) totalEl.textContent = total;
    var fill = $("#answer-fill");
    if (fill) fill.style.width = Math.round((answered / total) * 100) + "%";
    var label = $("#answer-label");
    if (label) label.textContent = Math.round((answered / total) * 100) + "%";
  }

  function cardHtml(q) {
    var st = state();
    var picked = entry ? entry.answers[q.n] : undefined;
    var opts = q.opts.map(function (text, j) {
      var cls = "option";
      if (st === "running" && picked === j) cls += " is-selected";
      if (st === "done") {
        if (j === q.ans) cls += " is-correct";
        else if (picked === j) cls += " is-wrong";
      }
      var dis = st === "done" ? " disabled" : "";
      return '<button type="button" class="' + cls + '" data-opt="' + j + '"' + dis + ">" +
        '<span class="key">' + KEYS[j] + "</span>" +
        '<span class="txt">' + text + "</span></button>";
    }).join("");

    var status = "", statusCls = "q-status";
    if (st === "running") {
      status = picked === undefined ? "Not answered" : "Answered";
    } else if (st === "done") {
      if (picked === undefined) status = "Unattempted";
      else if (picked === q.ans) { status = "Correct"; statusCls += " ok"; }
      else { status = "Incorrect"; statusCls += " bad"; }
    }

    var solution = st === "done"
      ? '<details class="answer"><summary>Show solution</summary><div class="answer-body">' +
          '<div class="answer-correct"><span class="key">' + KEYS[q.ans] + "</span><span>Correct option: (" +
            KEYS[q.ans] + ") " + q.opts[q.ans] + "</span></div>" +
          '<div class="exp">' + q.exp + "</div>" +
        "</div></details>"
      : "";

    return '<article class="q-card" id="pq-' + q.n + '" data-n="' + q.n + '">' +
      '<div class="q-head">' +
        '<span class="q-num">Q ' + q.n + "</span>" +
        '<span class="chip">' + q.tag + "</span>" +
        '<div class="q-tags"><span class="' + statusCls + '" data-qstatus>' + status + "</span></div>" +
      "</div>" +
      '<div class="q-stem">' + q.q +
        (q.diagram ? '<div class="q-diagram">' + q.diagram + "</div>" : "") +
      "</div>" +
      '<div class="options">' + opts + "</div>" +
      solution +
    "</article>";
  }

  function renderQuestions() {
    var list = $("#question-list");
    list.innerHTML = paper.questions.map(cardHtml).join("");
    if (state() !== "running") return;
    paper.questions.forEach(function (q) {
      var card = $("#pq-" + q.n);
      if (!card) return;
      $$(".option", card).forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (state() !== "running") return;
          var idx = Number(btn.getAttribute("data-opt"));
          if (entry.answers[q.n] === idx) delete entry.answers[q.n];
          else entry.answers[q.n] = idx;
          writeEntry(entry);
          $$(".option", card).forEach(function (b, j) {
            b.classList.toggle("is-selected", entry.answers[q.n] === j);
          });
          var stEl = $("[data-qstatus]", card);
          stEl.textContent = entry.answers[q.n] === undefined ? "Not answered" : "Answered";
          var dot = $('[data-jump="' + q.n + '"]');
          if (dot) dot.classList.toggle("is-seen", entry.answers[q.n] !== undefined);
          updateAnswered();
        });
      });
    });
  }

  function renderPalette() {
    var st = state();
    var mount = $("#palette");
    mount.innerHTML = paper.questions.map(function (q) {
      var cls = "q-dot";
      var picked = entry ? entry.answers[q.n] : undefined;
      if (st === "done" && picked !== undefined) cls += picked === q.ans ? " is-correct" : " is-wrong";
      else if (st === "running" && picked !== undefined) cls += " is-seen";
      return '<button type="button" class="' + cls + '" data-jump="' + q.n + '">' + q.n + "</button>";
    }).join("");
    $$("[data-jump]", mount).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var card = $("#pq-" + btn.getAttribute("data-jump"));
        if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function submit(auto) {
    if (state() !== "running") return;
    var answered = Object.keys(entry.answers).length;
    if (!auto) {
      var ok = window.confirm("Submit test? " + answered + " of " + paper.questions.length +
        " answered. Solutions will unlock and answers cannot be changed.");
      if (!ok) return;
    }
    entry.submittedAt = Date.now();
    entry.timeUsed = Math.min(LIMIT, Math.floor((entry.submittedAt - entry.startedAt) / 1000));
    writeEntry(entry);
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderResultPanel() {
    var correct = 0, wrong = 0, unanswered = 0;
    var byTag = {};
    paper.questions.forEach(function (q) {
      var picked = entry.answers[q.n];
      if (!byTag[q.tag]) byTag[q.tag] = { total: 0, correct: 0 };
      byTag[q.tag].total++;
      if (picked === undefined) unanswered++;
      else if (picked === q.ans) { correct++; byTag[q.tag].correct++; }
      else wrong++;
    });
    var attempted = correct + wrong;
    var acc = attempted ? Math.round((correct / attempted) * 100) : 0;
    var marks = Math.round((correct * 2.5 - wrong * (2.5 / 3)) * 10) / 10;

    var tags = Object.keys(byTag).sort().map(function (t) {
      var d = byTag[t];
      return '<div class="stat-line"><span>' + t + "</span><b>" + d.correct + " / " + d.total + "</b></div>";
    }).join("");

    $("#result-panel").innerHTML =
      '<div class="side-card results-panel">' +
        "<h3>Result — CSAT " + paper.year + " paper test</h3>" +
        '<div class="results-grid">' +
          '<div class="result-stat"><span>Correct</span><b style="color:var(--success)">' + correct + "</b></div>" +
          '<div class="result-stat"><span>Incorrect</span><b style="color:var(--danger)">' + wrong + "</b></div>" +
          '<div class="result-stat"><span>Unattempted</span><b>' + unanswered + "</b></div>" +
          '<div class="result-stat"><span>Accuracy</span><b>' + acc + "%</b></div>" +
          '<div class="result-stat"><span>Time used</span><b>' + fmtDuration(entry.timeUsed || 0) + "</b></div>" +
          '<div class="result-stat"><span>Est. marks</span><b>' + marks + " / 200</b></div>" +
        "</div>" +
        '<p class="muted" style="margin:0 0 .8rem">Qualifying bar: 133 / 200. Estimated marks use +2.5 per correct and −⅓ per wrong, as in the real paper.</p>' +
        '<div class="tag-grid">' + tags + "</div>" +
        '<div class="results-actions">' +
          '<button type="button" class="btn btn-ghost btn-sm" id="expand-all">Expand all solutions</button>' +
          '<button type="button" class="btn btn-ghost btn-sm" id="retake-btn">Retake test</button>' +
          '<a class="btn btn-ghost btn-sm" href="papers.html">All papers</a>' +
        "</div>" +
      "</div>";

    $("#expand-all").addEventListener("click", function () {
      var open = this.getAttribute("data-open") !== "true";
      $$("details.answer").forEach(function (d) { d.open = open; });
      this.setAttribute("data-open", open ? "true" : "false");
      this.textContent = open ? "Collapse all solutions" : "Expand all solutions";
    });
    $("#retake-btn").addEventListener("click", retake);
  }

  function retake() {
    if (!window.confirm("Clear this attempt and start fresh?")) return;
    entry = null;
    writeEntry(null);
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function init(p) {
    if (!p) {
      showError("This paper bank has not been added yet. Pick a paper from the Papers page.");
      return;
    }
    paper = p;
    entry = readAll()[paperId] || null;
    setChrome();
    $("#submit-btn").addEventListener("click", function () { submit(false); });
    $("#expand-solutions").addEventListener("click", function () {
      var open = this.getAttribute("data-open") !== "true";
      $$("details.answer").forEach(function (d) { d.open = open; });
      this.setAttribute("data-open", open ? "true" : "false");
      this.textContent = open ? "Collapse all solutions" : "Expand all solutions";
    });
    render();
  }

  loadPaper(init);
})();
