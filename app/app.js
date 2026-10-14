/* Rooter Champion help app shell. Progressive enhancement: every link works without this file. */
(function () {
  "use strict";
  // Jobber forms. drain = "$55 Drain Cleaning Special With Camera Inspection" (job booking, form 5263835).
  // camera + request = Jobber "Default Form" (request form, 1204571) until dedicated forms exist. Filled in at build time.
  var JOBBER = { drain: "https://clienthub.getjobber.com/hubs/9310cea7-0032-44c9-a612-cafd8cc04a3f/public/requests/5263835/new", camera: "https://clienthub.getjobber.com/hubs/9310cea7-0032-44c9-a612-cafd8cc04a3f/public/requests/1204571/new", request: "https://clienthub.getjobber.com/hubs/9310cea7-0032-44c9-a612-cafd8cc04a3f/public/requests/1204571/new" };
  var BOOK_MODE = "sheet"; // "sheet" = open Jobber in an in-page sheet (iframe); "tab" = open Jobber in a new tab
  var PHONE = "714-305-9263";
  var LABELS = { drain: "Book a drain cleaning", camera: "Camera inspection / estimate", request: "Other plumbing request" };
  var GUIDES = {"bathroom-sink-clog":["Bathroom sink","Slow or Clogged Bathroom Sink","Hair, soap scum and toothpaste usually build up in the stopper or the curved pipe (P-trap) under the sink."],"clogged-toilet":["Toilet","Clogged Toilet","Usually too much paper, wipes or a small object. If other drains act up when you flush, the main line may be the problem."],"shower-tub-drain":["Shower or tub","Slow Shower or Bathtub Drain","Hair and soap build-up are the usual cause. If the tub fills when the toilet flushes, it is likely the main line."],"kitchen-sink-grease":["Kitchen sink","Kitchen Sink Clog and Grease Build-Up","Cooking grease, food scraps and garbage disposal debris coat the line over time. Repeat clogs often need hydro jetting."],"main-sewer-line-clog":["Several drains / main line","Several Drains Backing Up: Main Sewer Line Clog","When more than one drain is slow, or water comes up in the lowest drain, the blockage is usually in the main sewer line."],"sewage-backup-emergency":["Sewage coming up","Sewage Backup or Overflowing Cleanout","Sewage coming up means the main line is blocked. Stop using water and call right away."],"gurgling-drains":["Gurgling drains","Gurgling Drains or a Bubbling Toilet","Gurgling means air is being pulled through a drain, usually from a partial clog or a vent problem."],"sewer-smell":["Sewer smell","Sewer Smell in the House","Often a dry drain trap or a failing toilet seal. If it keeps coming back, a camera can check for a cracked sewer line."],"tree-roots-sewer":["Tree roots","Tree Roots in the Sewer Line","Roots slip into older pipe joints and cracks looking for water, causing main line clogs that keep coming back."],"laundry-drain-overflow":["Laundry / washer","Laundry or Washer Drain Overflowing","Lint build-up in the standpipe or laundry line is common. If other drains also back up, it is likely the main line."],"yard-area-drain":["Yard / area drain","Yard, Patio or Area Drain Flooding","Dirt, leaves and roots fill outdoor drain lines. We clear them with hydro jetting."],"sewer-pipe-repair-trenchless":["Broken pipe / trenchless","Broken or Old Sewer Pipe and Trenchless Repair","Older clay and cast iron pipe can crack, sag or separate. A camera shows the damage; trenchless lining can fix many lines without digging."]};

  function track(name, params) { if (typeof window.gtag === "function") { try { window.gtag("event", name, params || {}); } catch (e) {} } }
  function lightTel() { var el = document.querySelector('header a[href^="tel:"], a[href^="tel:"]'); return el ? el.getAttribute("href") : "tel:" + PHONE.replace(/\D/g, ""); }
  function fmt(href) { var d = href.replace(/\D/g, "").slice(-10); return d.length === 10 ? d.slice(0, 3) + "-" + d.slice(3, 6) + "-" + d.slice(6) : PHONE; }
  function isPlaceholder(u) { return !u || /^JOBBER_LINK_/.test(u); }

  // ---------- Symptom checker ----------
/* Shared 4-tap symptom checker (no dependencies). Used by /app/app.js and /app/rc-widget.js.
   rcChecker(root, opts) renders into root. opts:
     guides  : {slug: [shortName, title, summary]}
     guideUrl(slug), bookHref(type), phoneHref(), phoneText(), track(name, params), onBook(type, ev) */
function rcChecker(root, o) {
  var STEPS = [
    { k: "where", q: "Where is the problem?", opts: [
      ["bath", "Bathroom sink"], ["toilet", "Toilet"], ["shower", "Shower or tub"], ["kitchen", "Kitchen sink"],
      ["laundry", "Laundry / washer"], ["many", "Several drains / whole house"], ["outside", "Outside / yard"], ["sense", "It's a smell or noise"]] },
    { k: "what", q: "What's happening?", opts: [
      ["slow", "Draining slowly"], ["stopped", "Completely stopped"], ["backup", "Backing up or overflowing"],
      ["gurgle", "Gurgling or bubbling"], ["smell", "Bad smell"]] },
    { k: "count", q: "How many drains are acting up?", opts: [
      ["one", "Just one drain"], ["more", "More than one drain"], ["unsure", "Not sure"]] },
    { k: "sewage", q: "Is sewage or dirty water coming up anywhere right now?", opts: [
      ["yes", "Yes, it's coming up now"], ["no", "No"]] }
  ];
  var FIX = { bath: "bathroom-sink-clog", toilet: "clogged-toilet", shower: "shower-tub-drain", kitchen: "kitchen-sink-grease", laundry: "laundry-drain-overflow" };
  var step = 0, a = {};
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function decide() {
    if (a.sewage === "yes") return { p: "sewage-backup-emergency", s: "main-sewer-line-clog", svc: "urgent" };
    var w = a.where, h = a.what;
    if (w === "outside") return h === "smell" ? { p: "sewer-smell", s: "yard-area-drain", svc: "camera" } : { p: "yard-area-drain", s: "tree-roots-sewer", svc: "camera" };
    if (w === "many" || a.count === "more") return h === "smell" ? { p: "sewer-smell", s: "main-sewer-line-clog", svc: "camera" } : { p: "main-sewer-line-clog", s: h === "gurgle" ? "gurgling-drains" : "tree-roots-sewer", svc: "mainline" };
    if (w === "sense") return h === "gurgle" ? { p: "gurgling-drains", s: "main-sewer-line-clog", svc: "drain" } : { p: "sewer-smell", s: "gurgling-drains", svc: "camera" };
    if (h === "smell") return { p: "sewer-smell", s: FIX[w], svc: "camera" };
    if (h === "gurgle") return { p: "gurgling-drains", s: FIX[w], svc: "drain" };
    return { p: FIX[w], s: a.count === "unsure" ? "main-sewer-line-clog" : (w === "kitchen" ? "main-sewer-line-clog" : "gurgling-drains"), svc: "drain" };
  }
  function dots(n) {
    var h = '<div class="rcx-dots" role="progressbar" aria-valuemin="1" aria-valuemax="5" aria-valuenow="' + (n + 1) + '" aria-label="Step ' + (n + 1) + ' of 5">';
    for (var i = 0; i < 5; i++) h += '<span class="' + (i < n ? "done" : i === n ? "on" : "") + '"></span>';
    return h + "</div>";
  }
  function callBtn(cls, label) {
    return '<a class="' + cls + '" href="' + esc(o.phoneHref()) + '" data-rc-call>' + label + " " + esc(o.phoneText()) + "</a>";
  }
  function bookBtn(type, cls, label) {
    return '<a class="' + cls + '" href="' + esc(o.bookHref(type)) + '" data-book-type="' + type + '">' + label + "</a>";
  }
  function render(dir) {
    var html;
    if (step < STEPS.length) {
      var s = STEPS[step];
      html = '<div class="rcx-top">' + (step ? '<button type="button" class="rcx-back" data-back aria-label="Back">&#8249; Back</button>' : '<span class="rcx-back-sp"></span>') + dots(step) + "</div>" +
        '<div class="rcx-step ' + (dir || "") + '"><p class="rcx-n">Step ' + (step + 1) + " of 4</p><h3 class=\"rcx-q\">" + esc(s.q) + '</h3><div class="rcx-opts">';
      s.opts.forEach(function (op) { html += '<button type="button" class="rcx-opt' + (s.k === "sewage" && op[0] === "yes" ? " rcx-opt-warn" : "") + '" data-v="' + op[0] + '">' + esc(op[1]) + "</button>"; });
      html += "</div></div>";
    } else {
      var r = decide(), g = o.guides[r.p] || [], g2 = o.guides[r.s];
      o.track("checker_result", { result: r.p, service: r.svc });
      html = '<div class="rcx-top"><button type="button" class="rcx-back" data-back aria-label="Back">&#8249; Back</button>' + dots(4) + "</div>";
      if (r.svc === "urgent") {
        html += '<div class="rcx-step rcx-urgent ' + (dir || "") + '"><p class="rcx-urgent-h">Stop using water and call ' + esc(o.phoneText()) + " now.</p>" +
          callBtn("rcx-btn rcx-btn-call rcx-btn-big", "Call") +
          '<ul class="rcx-list"><li>No flushing, showers, laundry, dishwasher or running faucets.</li><li>Keep kids and pets away from the water.</li><li>Don\'t touch sewage without gloves, and don\'t pour in chemicals.</li></ul>' +
          '<a class="rcx-link" href="' + esc(o.guideUrl(r.p)) + '">Read: what to do during a sewage backup &rsaquo;</a></div>';
      } else {
        var acts = r.svc === "mainline"
          ? '<p class="rcx-tip">Stop using water until the line is cleared.</p>' + callBtn("rcx-btn rcx-btn-call", "Call") + bookBtn("camera", "rcx-btn rcx-btn-ghost", "Request a camera inspection / estimate")
          : r.svc === "camera"
            ? bookBtn("camera", "rcx-btn rcx-btn-book", "Book a camera inspection / estimate") + callBtn("rcx-btn rcx-btn-ghost", "Call")
            : bookBtn("drain", "rcx-btn rcx-btn-book", "Book a $55 drain cleaning") + callBtn("rcx-btn rcx-btn-ghost", "Call");
        html += '<div class="rcx-step ' + (dir || "") + '"><p class="rcx-n">Most likely</p><h3 class="rcx-q">' + esc(g[1] || "") + "</h3>" +
          '<p class="rcx-sum">' + esc(g[2] || "") + "</p>" +
          '<a class="rcx-btn rcx-btn-dark" href="' + esc(o.guideUrl(r.p)) + '">Read the guide &rsaquo;</a>' +
          (g2 ? '<a class="rcx-link" href="' + esc(o.guideUrl(r.s)) + '">Also see: ' + esc(g2[1]) + " &rsaquo;</a>" : "") +
          '<div class="rcx-acts">' + acts + "</div></div>";
      }
      html += '<button type="button" class="rcx-restart" data-restart>Start over</button>';
    }
    root.innerHTML = html;
    var first = root.querySelector(".rcx-opt, .rcx-urgent-h, .rcx-q");
    if (first && dir) { first.setAttribute("tabindex", "-1"); try { first.focus({ preventScroll: true }); } catch (e) {} }
  }
  root.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("button,a") : null;
    if (!t || !root.contains(t)) return;
    if (t.hasAttribute("data-v")) {
      var k = STEPS[step].k; a[k] = t.getAttribute("data-v");
      o.track("checker_step", { step: step + 1, question: k, answer: a[k] });
      step = k === "sewage" ? STEPS.length : step + 1; render("rcx-fwd");
    } else if (t.hasAttribute("data-back")) { step = Math.max(0, step - 1); render("rcx-bwd"); }
    else if (t.hasAttribute("data-restart")) { step = 0; a = {}; render("rcx-bwd"); }
    else if (t.hasAttribute("data-book-type") && o.onBook) { o.onBook(t.getAttribute("data-book-type"), e); }
    else if (t.hasAttribute("data-rc-call")) { o.track("phone_call_click", { event_category: "engagement", event_label: t.getAttribute("href"), source: "checker" }); }
  });
  render();
  return { reset: function () { step = 0; a = {}; render(); } };
}

  document.querySelectorAll("[data-rc-checker]").forEach(function (el) {
    el.classList.add("rcx");
    rcChecker(el, {
      guides: GUIDES,
      guideUrl: function (s) { return "/help/" + s + "/"; },
      bookHref: function (t) { return "/book/#" + t; },
      phoneHref: lightTel, phoneText: function () { return fmt(lightTel()); },
      track: track
    });
  });

  // ---------- Booking sheet ----------
  var sheet, frame, timer, lastFocus;
  function buildSheet() {
    sheet = document.createElement("div");
    sheet.className = "rc-sheet"; sheet.setAttribute("role", "dialog"); sheet.setAttribute("aria-modal", "true"); sheet.setAttribute("aria-labelledby", "rc-sheet-t");
    sheet.innerHTML = '<div class="rc-sheet-bg" data-close></div><div class="rc-sheet-p"><div class="rc-sheet-grab" aria-hidden="true"></div>' +
      '<div class="rc-sheet-h"><p id="rc-sheet-t">Book online</p><a class="rc-sheet-tab" target="_blank" rel="noopener">Open in new tab</a><button type="button" class="rc-sheet-x" data-close aria-label="Close">&times;</button></div>' +
      '<div class="rc-sheet-b"><div class="rc-sheet-load">Loading the booking form&hellip;</div><div class="rc-sheet-fb" hidden></div></div>' +
      '<p class="rc-sheet-zip">ZIP not accepted online? Call <a href="' + lightTel() + '">' + fmt(lightTel()) + '</a> and we&rsquo;ll still come out.</p></div>';
    document.body.appendChild(sheet);
    sheet.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) close(); });
  }
  function open(type, url) {
    if (!sheet) buildSheet();
    lastFocus = document.activeElement;
    sheet.querySelector("#rc-sheet-t").textContent = LABELS[type] || "Book online";
    var tab = sheet.querySelector(".rc-sheet-tab"), fb = sheet.querySelector(".rc-sheet-fb"), load = sheet.querySelector(".rc-sheet-load"), body = sheet.querySelector(".rc-sheet-b");
    if (frame) { frame.remove(); frame = null; }
    clearTimeout(timer); fb.hidden = true; load.hidden = false;
    if (isPlaceholder(url)) {
      tab.hidden = true; load.hidden = true; fb.hidden = false;
      fb.innerHTML = '<p class="rc-sheet-pv">PREVIEW: the Jobber booking form for &ldquo;' + (LABELS[type] || "booking") + '&rdquo; will open here once its link is added (' + (url || "JOBBER_LINK") + ').</p><p>Until then, call <a href="' + lightTel() + '">' + fmt(lightTel()) + "</a>.</p>";
    } else {
      tab.hidden = false; tab.href = url;
      frame = document.createElement("iframe");
      frame.title = LABELS[type] || "Book online"; frame.src = url; frame.setAttribute("allow", "geolocation");
      frame.addEventListener("load", function () { load.hidden = true; clearTimeout(timer); });
      body.appendChild(frame);
      timer = setTimeout(function () {
        fb.hidden = false;
        fb.innerHTML = '<p>Taking a while to load?</p><a class="rcx-btn rcx-btn-dark" target="_blank" rel="noopener" href="' + url + '">Open the booking page in a new tab</a>';
      }, 8000);
    }
    document.documentElement.classList.add("rc-lock");
    requestAnimationFrame(function () { sheet.classList.add("open"); });
    sheet.querySelector(".rc-sheet-x").focus();
    if (location.hash !== "#booking") history.pushState({ rcSheet: 1 }, "", "#booking");
  }
  function close(fromPop) {
    if (!sheet || !sheet.classList.contains("open")) return;
    sheet.classList.remove("open"); document.documentElement.classList.remove("rc-lock");
    clearTimeout(timer);
    setTimeout(function () { if (frame && !sheet.classList.contains("open")) { frame.remove(); frame = null; } }, 300);
    if (!fromPop && history.state && history.state.rcSheet) history.back();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  window.addEventListener("popstate", function () { close(true); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  window.addEventListener("message", function (e) {
    if (e.origin === location.origin && e.data && e.data.rc === "booked") { close(); toast("You're booked! Check your email for the confirmation."); }
  });
  function toast(msg) {
    var t = document.createElement("div"); t.className = "rc-toast"; t.setAttribute("role", "status"); t.textContent = msg;
    document.body.appendChild(t); setTimeout(function () { t.classList.add("show"); }, 20);
    setTimeout(function () { t.classList.remove("show"); setTimeout(function () { t.remove(); }, 400); }, 5000);
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest("a[data-jobber], a[data-book-type]") : null;
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var type = a.getAttribute("data-jobber") || a.getAttribute("data-book-type");
    var url = a.hasAttribute("data-jobber") ? a.getAttribute("href") : JOBBER[type];
    track("book_click", { book_type: type, page: location.pathname, mode: BOOK_MODE });
    if (BOOK_MODE === "tab" && !isPlaceholder(url)) { e.preventDefault(); window.open(url, "_blank", "noopener"); return; }
    e.preventDefault(); open(type, url);
  });
  if (/^#(drain|camera|request)$/.test(location.hash)) {
    var card = document.getElementById(location.hash.slice(1)); if (card) card.classList.add("rc-hl");
  }

  // ---------- Add to Home Screen ----------
  var standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  if (standalone) document.documentElement.classList.add("rc-standalone");
  var deferred = null, KEY = "rc-a2hs-dismissed";
  var views = 0; try { views = +(sessionStorage.getItem("rc-views") || 0) + 1; sessionStorage.setItem("rc-views", views); } catch (e) {}
  function dismissedRecently() { try { return Date.now() - (+localStorage.getItem(KEY) || 0) < 30 * 864e5; } catch (e) { return false; } }
  function banner(ios) {
    if (document.querySelector(".rc-a2hs")) return;
    var b = document.createElement("div"); b.className = "rc-a2hs"; b.setAttribute("role", "region"); b.setAttribute("aria-label", "Install app");
    b.innerHTML = '<img src="/app/icons/icon-192.png" alt="" width="44" height="44"><div class="rc-a2hs-t"><strong>Get the Rooter Champion app</strong><span>' +
      (ios ? 'Tap <b>Share</b> <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5M5 13v7h14v-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> then <b>Add to Home Screen</b>' : "Drain help and booking, one tap away.") +
      "</span></div>" + (ios ? "" : '<button type="button" class="rc-a2hs-i">Install</button>') + '<button type="button" class="rc-a2hs-x" aria-label="Dismiss">&times;</button>';
    document.body.appendChild(b); requestAnimationFrame(function () { b.classList.add("show"); });
    b.addEventListener("click", function (e) {
      if (e.target.closest(".rc-a2hs-x")) { try { localStorage.setItem(KEY, Date.now()); } catch (x) {} b.remove(); track("a2hs_dismiss"); }
      if (e.target.closest(".rc-a2hs-i") && deferred) {
        deferred.prompt(); deferred.userChoice.then(function (c) { track("a2hs_choice", { outcome: c.outcome }); deferred = null; b.remove(); });
      }
    });
  }
  var forcePreview = /[?&]install=preview/.test(location.search);
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault(); deferred = e;
    if (!dismissedRecently() && (views >= 2 || /^\/help\/$/.test(location.pathname))) setTimeout(function () { banner(false); }, 1500);
  });
  var isIOS = (/iphone|ipad|ipod/i.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1)) && !window.MSStream;
  if (forcePreview) banner(isIOS);
  else if (isIOS && !standalone && !dismissedRecently() && (views >= 2 || /^\/help\/$/.test(location.pathname))) setTimeout(function () { banner(true); }, 2000);
  window.addEventListener("appinstalled", function () { track("a2hs_installed"); var b = document.querySelector(".rc-a2hs"); if (b) b.remove(); });

  // ---------- Service worker (offline help pages) ----------
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
    window.addEventListener("load", function () { ["/help/", "/book/"].forEach(function (sc) { navigator.serviceWorker.register("/app/sw.js", { scope: sc }).catch(function () {}); }); });
  }
})();
