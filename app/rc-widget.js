/*! Rooter Champion help & booking widget (rooterchampion.net). One tag, no dependencies, styles isolated in Shadow DOM.
  <script src="/app/rc-widget.js" async></script>
  Jobber links, phone and position are built in. Optional attributes:
    data-only="/,/drain-cleaning.html"   show only on these paths (comma list, "*" at the end = prefix match)
    data-skip="/privacy.html"            never show on these paths (app pages /help/, /book/, /booked/, /offline/ are always skipped)
    data-avoid="auto|off"                auto (default) lifts the button above any fixed bar along the bottom of the screen
    data-bottom="20" data-bottom-mobile="20"   base gap in px when nothing needs avoiding
    data-side="right|left"  data-label="Need help? Book"  data-z="60"
    data-ga="G-SPGTXCPJVT"               only used if the page has NO Google tag at all; never loads a second copy
    data-jobber-drain / data-jobber-camera / data-jobber-request   override the Jobber form links
  JS API: window.RCWidget.open("check"|"book"|"call"), window.RCWidget.close() */
(function () {
  "use strict";
  if (window.RCWidget) return;
  var me = document.currentScript || document.querySelector('script[src*="rc-widget"]');
  function attr(n, d) { var v = me && me.getAttribute("data-" + n); return v == null || v === "" ? d : v; }
  function onPath(list) {
    var p = location.pathname;
    return String(list || "").split(",").some(function (x) { x = x.trim(); if (!x) return false; return x.slice(-1) === "*" ? p.indexOf(x.slice(0, -1)) === 0 : p === x || (x === "/" && p === "/index.html"); });
  }
  // Which pages get the widget. App pages have their own Book/Call bar, so the widget never shows there.
  if (/^\/(help|book|booked|offline)\//.test(location.pathname)) return;
  if (attr("only", "") && !onPath(attr("only", ""))) return;
  if (onPath(attr("skip", ""))) return;
  var BASE = attr("base", me && me.src ? new URL(me.src, location.href).origin : "https://rooterchampion.net").replace(/\/$/, "");
  // Google tag guard: use the page's existing gtag. Only if the page has no Google tag at all AND data-ga is set, load one copy.
  (function () {
    var ga = attr("ga", "");
    if (!ga || typeof window.gtag === "function" || document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) return;
    window.dataLayer = window.dataLayer || []; window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date()); window.gtag("config", ga);
    var g = document.createElement("script"); g.async = true; g.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ga); document.head.appendChild(g);
  })();
  var PHONE = attr("phone", "714-305-9263");
  var JOBBER = { drain: attr("jobber-drain", "https://clienthub.getjobber.com/hubs/9310cea7-0032-44c9-a612-cafd8cc04a3f/public/requests/5263835/new"), camera: attr("jobber-camera", "https://clienthub.getjobber.com/hubs/9310cea7-0032-44c9-a612-cafd8cc04a3f/public/requests/1204571/new"), request: attr("jobber-request", "https://clienthub.getjobber.com/hubs/9310cea7-0032-44c9-a612-cafd8cc04a3f/public/requests/1204571/new") };
  var LABEL = attr("label", "Book now");
  var SIDE = attr("side", "right") === "left" ? "left" : "right";
  var BOTTOM = +attr("bottom", 20), BOTTOM_M = +attr("bottom-mobile", BOTTOM);
  var AVOID = attr("avoid", "auto") !== "off", Z = +attr("z", 60);
  var GUIDES = {"bathroom-sink-clog":["Bathroom sink","Slow or Clogged Bathroom Sink","Hair, soap scum and toothpaste usually build up in the stopper or the curved pipe (P-trap) under the sink."],"clogged-toilet":["Toilet","Clogged Toilet","Usually too much paper, wipes or a small object. If other drains act up when you flush, the main line may be the problem."],"shower-tub-drain":["Shower or tub","Slow Shower or Bathtub Drain","Hair and soap build-up are the usual cause. If the tub fills when the toilet flushes, it is likely the main line."],"kitchen-sink-grease":["Kitchen sink","Kitchen Sink Clog and Grease Build-Up","Cooking grease, food scraps and garbage disposal debris coat the line over time. Repeat clogs often need hydro jetting."],"main-sewer-line-clog":["Several drains / main line","Several Drains Backing Up: Main Sewer Line Clog","When more than one drain is slow, or water comes up in the lowest drain, the blockage is usually in the main sewer line."],"sewage-backup-emergency":["Sewage coming up","Sewage Backup or Overflowing Cleanout","Sewage coming up means the main line is blocked. Stop using water and call right away."],"gurgling-drains":["Gurgling drains","Gurgling Drains or a Bubbling Toilet","Gurgling means air is being pulled through a drain, usually from a partial clog or a vent problem."],"sewer-smell":["Sewer smell","Sewer Smell in the House","Often a dry drain trap or a failing toilet seal. If it keeps coming back, a camera can check for a cracked sewer line."],"tree-roots-sewer":["Tree roots","Tree Roots in the Sewer Line","Roots slip into older pipe joints and cracks looking for water, causing main line clogs that keep coming back."],"laundry-drain-overflow":["Laundry / washer","Laundry or Washer Drain Overflowing","Lint build-up in the standpipe or laundry line is common. If other drains also back up, it is likely the main line."],"yard-area-drain":["Yard / area drain","Yard, Patio or Area Drain Flooding","Dirt, leaves and roots fill outdoor drain lines. We clear them with hydro jetting."],"sewer-pipe-repair-trenchless":["Broken pipe / trenchless","Broken or Old Sewer Pipe and Trenchless Repair","Older clay and cast iron pipe can crack, sag or separate. A camera shows the damage; trenchless lining can fix many lines without digging."]};
  var BOOK = [
    ["drain", "Book a drain cleaning", "$55 + free camera inspection. We&rsquo;ll call to confirm a time.", true],
    ["camera", "Camera inspection / estimate", "Sewer camera, main lines, hydro jetting, roots, trenchless."],
    ["request", "Other plumbing request", "Water heaters, leaks, faucets and more. We'll call to schedule."]];
  var ICON = {
    logo: '<svg viewBox="0 0 512 512" aria-hidden="true"><rect width="512" height="512" rx="112" fill="#0A1220"/><path d="M232 92c-58 82-100 140-100 196a100 100 0 00200 0c0-56-42-114-100-196z" fill="#53A6DC"/><path d="M182 300a50 50 0 0050 50" stroke="#fff" stroke-width="20" fill="none" stroke-linecap="round" opacity=".9"/><g transform="translate(352 352) rotate(-45)"><rect x="-22" y="-10" width="44" height="150" rx="22" fill="#81B752"/><circle cx="0" cy="-30" r="58" fill="#81B752"/><rect x="-20" y="-112" width="40" height="78" rx="6" fill="#0A1220"/></g></svg>',
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c-3 4.3-5 7.3-5 10a5 5 0 0010 0c0-2.7-2-5.7-5-10z" fill="currentColor"/></svg>',
    phone: '<svg viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>',
    cal: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M8.5 15l2.5 2.5 4.5-5"/></svg>'
  };
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

  var CSS = ":root,:host{--ink:#0A1220;--navy:#274A6A;--blue:#53A6DC;--green:#81B752;--red:#B42318}.rcx{overflow-x:hidden;overflow-x:clip;color:var(--ink);font-family:'DM Sans',Arial,sans-serif}.rcx-top{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:40px}.rcx-back{background:none;border:0;font:600 16px/1 'DM Sans',Arial,sans-serif;color:var(--navy);padding:10px 6px;cursor:pointer;border-radius:6px}.rcx-back-sp{width:60px}.rcx-dots{display:flex;gap:8px;margin-left:auto}.rcx-dots span{width:10px;height:10px;border-radius:50%;background:#D5DCE3;transition:background .2s,transform .2s}.rcx-dots span.done{background:var(--blue)}.rcx-dots span.on{background:var(--green);transform:scale(1.3)}.rcx-n{margin:18px 0 4px;font:700 13px/1.2 'Barlow Condensed','Arial Narrow',Arial,sans-serif;text-transform:uppercase;letter-spacing:.06em;color:var(--navy)}.rcx-q{margin:0 0 16px;font:800 clamp(22px,5.5vw,28px)/1.2 'Barlow Condensed','Arial Narrow',Arial,sans-serif;color:var(--ink);outline:none}.rcx-opts{display:grid;gap:10px}@media (min-width:640px){.rcx-opts{grid-template-columns:1fr 1fr}}.rcx-opt{display:flex;align-items:center;min-height:56px;width:100%;text-align:left;padding:14px 18px;background:#fff;border:2px solid #D5DCE3;border-radius:12px;font:600 17px/1.25 'DM Sans',Arial,sans-serif;color:var(--ink);cursor:pointer;transition:border-color .15s,background .15s,transform .1s}.rcx-opt:hover{border-color:var(--blue);background:#F2F8FC}.rcx-opt:active{transform:scale(.98)}.rcx-opt-warn{border-color:#F3B4AE}.rcx-opt:focus-visible,.rcx-back:focus-visible,.rcx-btn:focus-visible,.rcx-link:focus-visible,.rcx-restart:focus-visible{outline:3px solid var(--blue);outline-offset:2px}.rcx-sum{margin:0 0 16px;font-size:17px;line-height:1.55;color:rgba(10,18,32,.8)}.rcx-btn{display:flex;align-items:center;justify-content:center;gap:8px;min-height:54px;width:100%;box-sizing:border-box;padding:12px 18px;margin-top:10px;border-radius:10px;font:800 17px/1.2 'Barlow Condensed','Arial Narrow',Arial,sans-serif;text-decoration:none;text-align:center;border:2px solid transparent;cursor:pointer}.rcx-btn-book{background:var(--green);color:var(--ink)}.rcx-btn-call{background:var(--green);color:var(--ink)}.rcx-btn-dark{background:var(--ink);color:#fff}.rcx-btn-ghost{background:#fff;color:var(--ink);border-color:var(--ink)}.rcx-btn-big{min-height:64px;font-size:20px}.rcx-acts{margin-top:18px;padding-top:14px;border-top:1px dashed #C9D2DB}.rcx-tip{margin:0;font-weight:600;color:var(--red)}.rcx-link{display:inline-block;margin-top:14px;font-weight:600;color:var(--navy);text-decoration:underline;text-underline-offset:3px}.rcx-restart{display:block;margin:18px auto 0;background:none;border:0;color:var(--navy);font:600 15px 'DM Sans',Arial,sans-serif;text-decoration:underline;cursor:pointer;padding:8px}.rcx-urgent{background:#FEF3F2;border:2px solid #F3B4AE;border-radius:14px;padding:18px;margin-top:14px}.rcx-urgent-h{margin:0;font:800 clamp(22px,6vw,28px)/1.2 'Barlow Condensed','Arial Narrow',Arial,sans-serif;color:var(--red);outline:none}.rcx-list{margin:14px 0 0;padding-left:22px;line-height:1.55;list-style:disc}.rcx-list li{margin:4px 0}.rcx-fwd{animation:rcx-in .28s cubic-bezier(.2,.8,.2,1) both}.rcx-bwd{animation:rcx-back .28s cubic-bezier(.2,.8,.2,1) both}@keyframes rcx-in{from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:none}}@keyframes rcx-back{from{opacity:0;transform:translateX(-28px)}to{opacity:1;transform:none}}@media (prefers-reduced-motion:reduce){.rcx-fwd,.rcx-bwd{animation:none}}:host{all:initial}*,*::before,*::after{box-sizing:border-box}.fab{position:fixed;__SIDE__:16px;bottom:__B__;display:flex;align-items:center;gap:8px;height:56px;padding:0 20px 0 14px;border:0;border-radius:999px;background:#81B752;color:#0A1220;font:800 16px/1 'Barlow Condensed','Arial Narrow',Arial,sans-serif;box-shadow:0 10px 26px -6px rgba(10,18,32,.55),0 0 0 3px #fff;cursor:pointer;transition:transform .2s,opacity .2s;-webkit-tap-highlight-color:transparent}.fab:hover{transform:translateY(-2px)}.fab:focus-visible{outline:3px solid #53A6DC;outline-offset:3px}.fab.hide{opacity:0;transform:scale(.8);pointer-events:none}.fab-i{width:32px;height:32px;border-radius:50%;background:#0A1220;color:#53A6DC;display:flex;align-items:center;justify-content:center}.fab-i svg{width:18px;height:18px}@media (max-width:639px){.fab{bottom:__BM__;height:52px;font-size:15px}}.ov{position:fixed;inset:0;background:rgba(10,18,32,.5);opacity:0;transition:opacity .25s}.ov.o{opacity:1}.pn{position:fixed;left:0;right:0;bottom:0;height:88vh;height:88dvh;background:#fff;color:#0A1220;border-radius:20px 20px 0 0;display:flex;flex-direction:column;font:16px/1.5 'DM Sans',Arial,sans-serif;box-shadow:0 -12px 40px rgba(0,0,0,.3);transform:translateY(100%);transition:transform .32s cubic-bezier(.2,.8,.2,1);padding-bottom:env(safe-area-inset-bottom)}.pn.o{transform:none}@media (min-width:640px){.pn{left:auto;right:auto;__SIDE__:20px;bottom:20px;width:400px;height:min(680px,calc(100vh - 40px));border-radius:18px;transform:translateY(24px);opacity:0;transition:transform .25s,opacity .25s}.pn.o{transform:none;opacity:1}.grab{display:none}}[hidden]{display:none!important}.grab{width:44px;height:5px;border-radius:3px;background:#C9D2DB;margin:8px auto 0;flex-shrink:0}.hd{display:flex;align-items:center;gap:10px;padding:10px 14px 10px 16px;flex-shrink:0}.lg svg{width:40px;height:40px;display:block}.ht{flex:1;min-width:0}.ht b{display:block;font:800 17px/1.2 'Barlow Condensed','Arial Narrow',Arial,sans-serif}.ht span{display:block;font-size:12.5px;color:rgba(10,18,32,.65);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.x{width:40px;height:40px;border-radius:50%;border:0;background:#EFF0F1;color:#0A1220;font-size:26px;line-height:1;cursor:pointer;flex-shrink:0}.tabs{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:4px;margin:0 14px;padding:4px;background:#EFF0F1;border-radius:12px;flex-shrink:0}.tabs button{border:0;background:none;border-radius:9px;padding:10px 4px;font:700 13.5px/1.1 'Barlow Condensed','Arial Narrow',Arial,sans-serif;color:#274A6A;cursor:pointer}.tabs button[aria-selected=true]{background:#fff;color:#0A1220;box-shadow:0 1px 4px rgba(10,18,32,.18)}.x:focus-visible,.tabs button:focus-visible,.bk:focus-visible,a:focus-visible{outline:3px solid #53A6DC;outline-offset:2px}.bd{position:relative;flex:1;overflow:auto;padding:6px 16px 18px;-webkit-overflow-scrolling:touch}.bd.frm{padding:0;display:flex;flex-direction:column}.ft{flex-shrink:0;border-top:1px solid #E4E8EC;padding:8px 16px;font-size:12px;color:rgba(10,18,32,.6);text-align:center}.ft a{color:#274A6A}.lead{margin:12px 0;color:rgba(10,18,32,.8)}.bk{display:flex;align-items:center;gap:12px;min-height:84px;margin:10px 0;padding:14px;border:2px solid #D5DCE3;border-radius:14px;text-decoration:none;color:#0A1220;background:#fff}.bk:hover{border-color:#53A6DC}.bk.pri{background:#81B752;border-color:#81B752}.bi{width:44px;height:44px;border-radius:11px;background:#0A1220;color:#81B752;display:flex;align-items:center;justify-content:center;flex-shrink:0}.bi svg{width:24px;height:24px}.bk b{display:block;font:800 16px/1.2 'Barlow Condensed','Arial Narrow',Arial,sans-serif}.bk small{display:block;font-size:13.5px;line-height:1.35;color:rgba(10,18,32,.75);margin-top:3px}.go{margin-left:auto;font-size:28px;color:#274A6A}.urg{margin:14px 0 0;padding:12px 14px;background:#FEF3F2;border:1px solid #F3B4AE;border-radius:12px;font-size:14.5px;color:#7A271A}.urg a{color:#B42318;font-weight:800}.cl{padding-top:6px}.cl .rcx-btn svg{width:20px;height:20px}.sm{font-size:14px;color:rgba(10,18,32,.7);margin:12px 0 0}.fh{display:flex;align-items:center;gap:10px;padding:8px 12px;border-bottom:1px solid #E4E8EC;flex-shrink:0}.fh b{flex:1;font:800 15px 'Barlow Condensed','Arial Narrow',Arial,sans-serif}.fh a{font-size:13px;color:#274A6A;font-weight:600}.bk-back{border:0;background:none;color:#274A6A;font:600 15px 'DM Sans',Arial,sans-serif;cursor:pointer;padding:8px 4px}.fw{position:relative;flex:1}.fw iframe{position:absolute;inset:0;width:100%;height:100%;border:0}.ld{padding:24px;text-align:center;color:#274A6A;margin:0}.fb{position:absolute;left:12px;right:12px;bottom:12px;z-index:2;background:#F3F5F7;border-radius:10px;padding:12px;margin:0;font-size:14px}.pv{margin:16px;padding:14px;background:#FFF3C4;color:#5C3B00;border-radius:10px;font-weight:600;line-height:1.5}.pv a{color:#274A6A}@media (prefers-reduced-motion:reduce){.pn,.ov,.fab{transition:none}}.zip,.fz{font-size:13.5px;line-height:1.45;color:rgba(10,18,32,.75)}.zip{margin:12px 0 0;padding:10px 12px;background:#EAF2F8;border-radius:10px}.zip a,.fz a{color:#274A6A;font-weight:700}.fz{flex-shrink:0;margin:0;padding:6px 12px;border-top:1px solid #E4E8EC;text-align:center;background:#F7F9FA}.ht b{font-size:19px;text-transform:uppercase;letter-spacing:.02em}.fab{text-transform:uppercase;letter-spacing:.03em;font-size:17px}.tabs button{font-size:15px;text-transform:uppercase;letter-spacing:.03em}.bk b{font-size:18px}.rcx-q{text-transform:none}:root,:host{--ink:#EFF0F1;--navy:#B2D1E6}.rcx-dots span{background:#274A6A}.rcx-opt{background:#0F1E36;border-color:rgba(83,166,220,.3);color:#EFF0F1}.rcx-opt:hover{background:#16293c;border-color:#53A6DC}.rcx-sum{color:#B2D1E6}.rcx-n{color:#53A6DC}.rcx-btn-book,.rcx-btn-call{color:#0A1220}.rcx-btn-book:hover,.rcx-btn-call:hover{background:#72a247}.rcx-btn-dark{background:#274A6A;color:#EFF0F1}.rcx-btn-ghost{background:transparent;color:#EFF0F1;border-color:#53A6DC}.rcx-acts{border-top-color:rgba(83,166,220,.3)}.rcx-tip{color:#FF9C92}.rcx-link,.rcx-restart{color:#53A6DC}.rcx-urgent{background:rgba(180,35,24,.16);border-color:rgba(243,180,174,.55);color:#F7D4D0}.rcx-urgent-h{color:#FF9C92}:host{--rc-bg:#0A1628;--rc-bg2:#0A1220;--rc-card:#0F1E36;--rc-navy:#274A6A;--rc-blue:#53A6DC;--rc-green:#81B752;--rc-green-h:#72a247;--rc-text:#EFF0F1;--rc-muted:#B2D1E6;--rc-line:rgba(83,166,220,.3)}.fab{background:var(--rc-green);color:var(--rc-bg2);box-shadow:0 10px 26px -6px rgba(0,0,0,.6),0 0 0 3px var(--rc-bg2)}.fab:hover{background:var(--rc-green-h)}.fab-i{background:var(--rc-bg2);color:var(--rc-blue)}.ov{background:rgba(10,18,32,.7)}.pn{background:var(--rc-bg);color:var(--rc-text);border:1px solid var(--rc-line)}.grab{background:var(--rc-navy)}.ht span,.lead,.sm,.ft,.bk small{color:var(--rc-muted)}.x{background:var(--rc-navy);color:var(--rc-text)}.tabs{background:var(--rc-bg2);border:1px solid var(--rc-line)}.tabs button{color:var(--rc-muted)}.tabs button[aria-selected=true]{background:var(--rc-navy);color:var(--rc-text);box-shadow:none}.ft,.fh,.fz{border-color:var(--rc-line)}.ft a,.fh a,.bk-back,.ld,.zip a,.fz a,.pv a,.go{color:var(--rc-blue)}.bk{background:var(--rc-card);color:var(--rc-text);border-color:var(--rc-line)}.bk:hover{border-color:var(--rc-blue)}.bk.pri{background:var(--rc-green);border-color:var(--rc-green);color:var(--rc-bg2)}.bk.pri small,.bk.pri .go{color:rgba(10,18,32,.85)}.bi{background:var(--rc-navy);color:var(--rc-green)}.bk.pri .bi{background:var(--rc-bg2)}.urg{background:rgba(180,35,24,.16);border-color:rgba(243,180,174,.55);color:#F7D4D0}.urg a{color:#FF9C92}.zip,.fz{color:var(--rc-muted)}.zip{background:rgba(83,166,220,.1);border:1px solid var(--rc-line)}.fz{background:var(--rc-bg2)}.fb{background:var(--rc-card);color:var(--rc-text)}.lgi{display:block;height:38px;width:auto;max-width:100%;margin-bottom:2px}.tabs button{transition:background .15s,color .15s}.tabs button:hover,.tabs button[aria-selected=true]:hover{background:#81B752;color:#0A1220}";
  CSS += ".fab{height:64px;padding:0 22px 0 8px;font-size:19px;background:#81B752;color:#0A1220;box-shadow:0 12px 30px -6px rgba(0,0,0,.7),0 0 0 3px #0A1220,0 0 0 5px #fff;animation:rcpulse 2.4s ease-out infinite}.fab .fab-b{width:50px;height:50px;flex:none;display:block;margin:-6px 0 -6px -4px;filter:drop-shadow(0 3px 6px rgba(0,0,0,.45))}.fab .fab-i{display:none}@media(max-width:639px){.fab{height:58px;font-size:17px;padding:0 18px 0 6px}.fab .fab-b{width:46px;height:46px}}@keyframes rcpulse{0%{box-shadow:0 12px 30px -6px rgba(0,0,0,.7),0 0 0 3px #0A1220,0 0 0 5px #fff,0 0 0 5px rgba(129,183,82,.7)}70%{box-shadow:0 12px 30px -6px rgba(0,0,0,.7),0 0 0 3px #0A1220,0 0 0 5px #fff,0 0 0 18px rgba(129,183,82,0)}100%{box-shadow:0 12px 30px -6px rgba(0,0,0,.7),0 0 0 3px #0A1220,0 0 0 5px #fff,0 0 0 18px rgba(129,183,82,0)}}@media(prefers-reduced-motion:reduce){.fab{animation:none}}"
    + ".tz{position:fixed;__SIDE__:16px;width:300px;max-width:calc(100vw - 32px);border-radius:16px;overflow:hidden;background:rgba(4,8,16,.98);border:1px solid rgba(83,166,220,.35);box-shadow:0 24px 60px rgba(0,0,0,.55);font-family:'DM Sans',Arial,sans-serif;color:#fff;opacity:0;transform:translateY(16px) scale(.97);transition:opacity .3s,transform .35s cubic-bezier(.16,1,.3,1);pointer-events:none}.tz.o{opacity:1;transform:none;pointer-events:auto}.tz-h{position:relative;display:flex;flex-direction:column;align-items:center;text-align:center;padding:18px 16px 14px;background:linear-gradient(160deg,#2d5577 0%,#16293c 100%)}.tz-h img{width:112px;height:112px;filter:drop-shadow(0 8px 18px rgba(0,0,0,.5))}.tz-t{font:900 24px/1 'Barlow Condensed','Arial Narrow',Arial,sans-serif;letter-spacing:.02em;margin-top:6px;text-transform:uppercase}.tz-t b{color:#81B752}.tz-s{font-size:13px;color:#B2D1E6;margin-top:4px}.tz-line{height:3px;background:linear-gradient(90deg,rgba(129,183,82,.95),rgba(83,166,220,.95))}.tz-a{display:flex;gap:10px;padding:14px}.tz-a a,.tz-a button{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:46px;border-radius:10px;font:800 16px/1 'Barlow Condensed','Arial Narrow',Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase;text-decoration:none;cursor:pointer;border:0}.tz-bk{background:#81B752;color:#0A1220;box-shadow:0 6px 20px rgba(129,183,82,.4)}.tz-bk:hover{background:#72a247}.tz-cl{background:transparent;color:#fff;border:1px solid rgba(83,166,220,.6)!important}.tz-cl:hover{background:rgba(83,166,220,.15)}.tz-cl svg{width:16px;height:16px}.tz-x{position:absolute;top:8px;right:8px;width:36px;height:36px;border:0;border-radius:50%;background:rgba(0,0,0,.35);color:#fff;font:400 24px/1 Arial,sans-serif;cursor:pointer}.tz-x:hover{background:rgba(0,0,0,.6)}.tz a:focus-visible,.tz button:focus-visible{outline:3px solid #53A6DC;outline-offset:2px}@media(prefers-reduced-motion:reduce){.tz{transition:none}}";

  function track(n, p) { if (typeof window.gtag === "function") { try { p = p || {}; p.source = p.source || "widget"; window.gtag("event", n, p); } catch (e) {} } }
  function tel() {
    var links = document.querySelectorAll('a[href^="tel:"]');
    for (var i = 0; i < links.length; i++) { if (!host.contains(links[i])) return links[i].getAttribute("href"); }
    return "tel:" + PHONE.replace(/\D/g, "");
  }
  function fmt(h) { var d = h.replace(/\D/g, "").slice(-10); return d.length === 10 ? d.slice(0, 3) + "-" + d.slice(3, 6) + "-" + d.slice(6) : PHONE; }
  function ph(u) { return !u || /^JOBBER_LINK_/.test(u); }

  var host = document.createElement("div");
  host.id = "rc-widget"; host.style.cssText = "all:initial;position:fixed;z-index:" + Z + ";" + SIDE + ":0;bottom:0;";
  var root = host.attachShadow ? host.attachShadow({ mode: "open" }) : host;
  root.innerHTML = "<style>" + CSS.replace(/__SIDE__/g, SIDE).replace(/__B__/g, BOTTOM + "px").replace(/__BM__/g, BOTTOM_M + "px") + "</style>" +
    '<button type="button" class="fab" aria-haspopup="dialog" aria-expanded="false"><img class="fab-b" src="' + BASE + '/app/rc-55.png" alt="" width="50" height="50"><span class="fab-i">' + ICON.chat + '</span><span class="fab-t">' + LABEL + "</span></button>" +
    '<div class="tz" role="dialog" aria-label="$55 drain cleaning special" hidden><div class="tz-h"><button type="button" class="tz-x" aria-label="Close">&times;</button><img src="' + BASE + '/app/rc-55.png" alt="$55 Drain Cleaning with camera inspection" width="112" height="112"><div class="tz-t"><b>$55</b> Drain Cleaning</div><div class="tz-s">Camera inspection included</div></div><div class="tz-line"></div><div class="tz-a"><button type="button" class="tz-bk">Book now</button><a class="tz-cl" href="tel:7143059263">' + ICON.phone + ' Call</a></div></div>' +
    '<div class="ov" hidden></div>' +
    '<div class="pn" role="dialog" aria-modal="true" aria-label="Rooter Champion help and booking" hidden>' +
      '<div class="grab" aria-hidden="true"></div>' +
      '<div class="hd"><div class="ht"><img class="lgi" src="/app/rc-logo.png" alt="Rooter Champion" width="463" height="133"><span>Family-owned</span><span>Open 7 days, 8am&ndash;5pm</span></div><button type="button" class="x" aria-label="Close">&times;</button></div>' +
      '<div class="tabs" role="tablist"><button role="tab" data-tab="check">Check my problem</button><button role="tab" data-tab="book">Book</button><button role="tab" data-tab="call">Call</button></div>' +
      '<div class="bd"></div>' +
      '<div class="ft">CA Lic. #1063585 &middot; <a href="' + BASE + '/help/">All drain guides</a></div>' +
    "</div>";
  var fab = root.querySelector(".fab"), ov = root.querySelector(".ov"), pn = root.querySelector(".pn"), bd = root.querySelector(".bd");
  var tab = "check", checker = null, prevOverflow = "", lastFocus = null;

  function show(t) {
    tab = t;
    root.querySelectorAll("[data-tab]").forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-tab") === t ? "true" : "false"); });
    if (t === "check") {
      bd.innerHTML = '<div class="rcx"></div>';
      checker = rcChecker(bd.firstChild, {
        guides: GUIDES, guideUrl: function (s) { return BASE + "/help/" + s + "/"; },
        bookHref: function (k) { return ph(JOBBER[k]) ? BASE + "/book/#" + k : JOBBER[k]; },
        phoneHref: tel, phoneText: function () { return fmt(tel()); }, track: track,
        onBook: function (k, e) { e.preventDefault(); frame(k); }
      });
    } else if (t === "book") {
      var h = '<p class="lead">Pick what you need and send a request. We&rsquo;ll call to confirm a time, usually within 1 hour.</p>';
      BOOK.forEach(function (b) { h += '<a class="bk' + (b[3] ? " pri" : "") + '" href="' + (ph(JOBBER[b[0]]) ? BASE + "/book/#" + b[0] : JOBBER[b[0]]) + '" data-k="' + b[0] + '"><span class="bi">' + ICON.cal + "</span><span><b>" + b[1] + "</b><small>" + b[2] + '</small></span><span class="go" aria-hidden="true">&rsaquo;</span></a>'; });
      h += '<p class="zip"><b>Online booking covers about 8 miles around our La Habra shop.</b> ZIP not accepted? Call <a href="' + tel() + '" data-call>' + fmt(tel()) + '</a> and we&rsquo;ll still come out.</p>';
      h += '<p class="urg"><b>Sewage coming up?</b> Don&rsquo;t book online. Stop using water and call <a href="' + tel() + '" data-call>' + fmt(tel()) + "</a> now.</p>";
      bd.innerHTML = h;
    } else {
      bd.innerHTML = '<div class="cl"><p class="lead">Talk to our team about your drain or sewer problem.</p><a class="rcx-btn rcx-btn-call rcx-btn-big" href="' + tel() + '" data-call>' + ICON.phone + " Call " + fmt(tel()) + '</a><p class="sm">For urgent problems like sewage coming up, call now and stop using water.</p><p class="sm">Open 7 days, 8am&ndash;5pm. We respond within 1 hour.</p><p class="sm">1401 S Beach Blvd Unit A, La Habra, CA 90631<br>Serving La Habra, Fullerton, La Mirada, Whittier and surrounding cities.</p></div>';
    }
    bd.scrollTop = 0;
  }
  function frame(k) {
    var u = JOBBER[k], lab = { drain: "Book a drain cleaning", camera: "Camera inspection / estimate", request: "Other plumbing request" }[k];
    track("book_click", { book_type: k, page: location.pathname });
    var h = '<div class="fh"><button type="button" class="bk-back" data-back>&#8249; Back</button><b>' + lab + "</b>" + (ph(u) ? "" : '<a href="' + u + '" target="_blank" rel="noopener">Open in new tab</a>') + "</div>";
    if (ph(u)) h += '<div class="pv">PREVIEW: the Jobber form for &ldquo;' + lab + '&rdquo; opens here once its link is added (' + u + ').<br><br>Until then, call <a href="' + tel() + '" data-call>' + fmt(tel()) + "</a>.</div>";
    else h += '<div class="fw"><p class="ld">Loading the booking form&hellip;</p><iframe title="' + lab + '" src="' + u + '"></iframe><p class="fb" hidden>Taking a while? <a href="' + u + '" target="_blank" rel="noopener">Open booking in a new tab</a></p></div>' +
      '<p class="fz">ZIP not accepted online? Call <a href="' + tel() + '" data-call>' + fmt(tel()) + '</a> and we&rsquo;ll still come out.</p>';
    bd.innerHTML = h; bd.classList.add("frm");
    var f = bd.querySelector("iframe");
    if (f) { var to = setTimeout(function () { var fb = bd.querySelector(".fb"); if (fb) fb.hidden = false; }, 8000); f.addEventListener("load", function () { clearTimeout(to); var l = bd.querySelector(".ld"); if (l) l.hidden = true; }); }
  }
  function open(t) {
    if (!pn.hidden) { show(t || tab); return; }
    lastFocus = document.activeElement;
    ov.hidden = false; pn.hidden = false; fab.setAttribute("aria-expanded", "true");
    show(t || tab);
    if (matchMedia("(max-width:639px)").matches) { prevOverflow = document.documentElement.style.overflow; document.documentElement.style.overflow = "hidden"; }
    host.style.zIndex = "2147483000";
    requestAnimationFrame(function () { requestAnimationFrame(function () { host.classList.add("o"); pn.classList.add("o"); ov.classList.add("o"); fab.classList.add("hide"); }); });
    root.querySelector(".x").focus();
    track("widget_open", { tab: t || tab });
  }
  function close() {
    if (pn.hidden) return;
    pn.classList.remove("o"); ov.classList.remove("o"); fab.classList.remove("hide"); fab.setAttribute("aria-expanded", "false");
    document.documentElement.style.overflow = prevOverflow;
    setTimeout(function () { if (!pn.classList.contains("o")) { pn.hidden = true; ov.hidden = true; bd.innerHTML = ""; bd.classList.remove("frm"); host.style.zIndex = String(Z); } }, 300);
    if (lastFocus && lastFocus.focus) lastFocus.focus(); else fab.focus();
  }
  // $55 attention teaser. Same timing as the site's Quick Quote panel (opens ~1s after load).
  // If the site's own Quick Quote panel (#quote-panel) is open, wait until it closes so the two never show together.
  // Closing it (X, Book now, Call, or opening the widget) hides it for the rest of the browser session.
  var tz = root.querySelector(".tz"), TZK = "rc_tz_off", tzShown = false;
  function tzOff() { try { return sessionStorage.getItem(TZK) === "1"; } catch (e) { return false; } }
  function tzSet() { try { sessionStorage.setItem(TZK, "1"); } catch (e) {} }
  function siteQuoteOpen() {
    var q = document.getElementById("quote-panel"); if (!q) return false;
    var r = q.getBoundingClientRect();
    return q.dataset.open === "true" && r.width > 40 && getComputedStyle(q).display !== "none" && q.offsetParent !== null;
  }
  function tzPlace() { tz.style.bottom = (parseInt(fab.style.bottom, 10) || BOTTOM) + (matchMedia("(max-width:639px)").matches ? 70 : 76) + "px"; }
  function tzShow() {
    if (tzShown || tzOff() || !pn.hidden) return;
    if (siteQuoteOpen()) { setTimeout(tzShow, 1000); return; }
    tzShown = true; tzPlace(); tz.hidden = false;
    requestAnimationFrame(function () { requestAnimationFrame(function () { tz.classList.add("o"); }); });
    track("promo_teaser_show", { page: location.pathname });
  }
  function tzHide(rem) {
    if (rem) tzSet();
    tz.classList.remove("o"); setTimeout(function () { if (!tz.classList.contains("o")) tz.hidden = true; }, 350);
  }
  setInterval(function () { if (!tz.hidden && tz.classList.contains("o") && siteQuoteOpen()) { tzHide(false); tzShown = false; setTimeout(tzShow, 1000); } }, 700);
  tz.querySelector(".tz-x").addEventListener("click", function () { tzHide(true); track("promo_teaser_close", {}); });
  tz.querySelector(".tz-bk").addEventListener("click", function () { tzHide(true); open("book"); track("promo_teaser_book", {}); });
  tz.querySelector(".tz-cl").addEventListener("click", function () { tzHide(true); track("phone_call_click", { event_category: "engagement", event_label: "tel:7143059263", source: "promo_teaser" }); });
  fab.addEventListener("click", function () { if (!tz.hidden) tzHide(true); });
  // Retract once the visitor starts scrolling so the card never blocks the page.
  // Not remembered: it still shows on the next page they open (same as the old Quick Quote).
  (function () {
    var done = false;
    window.addEventListener("scroll", function () {
      if (done || tz.hidden) return;
      if ((window.scrollY || window.pageYOffset) > 80) { done = true; tzHide(false); }
    }, { passive: true });
  })();
  if (/[?&]promo=preview/.test(location.search)) { try { sessionStorage.removeItem(TZK); } catch (e) {} }
  fab.addEventListener("click", function () { open(); });
  ov.addEventListener("click", close);
  root.querySelector(".x").addEventListener("click", close);
  root.querySelector(".tabs").addEventListener("click", function (e) { var b = e.target.closest("[data-tab]"); if (b) { bd.classList.remove("frm"); show(b.getAttribute("data-tab")); track("widget_tab", { tab: b.getAttribute("data-tab") }); } });
  bd.addEventListener("click", function (e) {
    var a = e.target.closest("a,button"); if (!a) return;
    if (a.hasAttribute("data-k")) { e.preventDefault(); frame(a.getAttribute("data-k")); }
    else if (a.hasAttribute("data-back")) { bd.classList.remove("frm"); show(tab); }
    else if (a.hasAttribute("data-call")) track("phone_call_click", { event_category: "engagement", event_label: a.getAttribute("href") });
  });
  root.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
    if (e.key === "Tab" && !pn.hidden) {
      var f = pn.querySelectorAll("a[href],button:not([disabled]),iframe"); if (!f.length) return;
      var first = f[0], last = f[f.length - 1], act = root.activeElement;
      if (e.shiftKey && act === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && act === last) { e.preventDefault(); first.focus(); }
    }
  });
  // Keep the button clear of fixed bars along the bottom of the page (e.g. the site's Call Now / Get Free Quote bar on phones).
  function obstacle() {
    var max = 0, vh = window.innerHeight, vw = window.innerWidth;
    var els = document.querySelectorAll("body > *, body > * > *");
    for (var i = 0; i < els.length; i++) {
      var el = els[i]; if (el === host || host.contains(el)) continue;
      var cs = getComputedStyle(el);
      if ((cs.position !== "fixed" && cs.position !== "sticky") || cs.display === "none" || cs.visibility === "hidden" || +cs.opacity === 0) continue;
      var r = el.getBoundingClientRect();
      if (r.height <= 0 || r.width < vw * 0.5 || r.height > vh * 0.4 || Math.abs(r.bottom - vh) > 3) continue;
      if (r.height > max) max = r.height;
    }
    return max;
  }
  function place() {
    if (typeof tz !== "undefined" && tz && !tz.hidden) setTimeout(tzPlace, 0);
    var mobile = matchMedia("(max-width:639px)").matches, base = mobile ? BOTTOM_M : BOTTOM;
    var ob = AVOID ? obstacle() : 0;
    fab.style.bottom = (ob ? Math.max(base, Math.ceil(ob) + 12) : base) + "px";
  }
  var placeT; function placeSoon() { clearTimeout(placeT); placeT = setTimeout(place, 120); }
  function mount() {
    document.body.appendChild(host); place();
    window.addEventListener("resize", placeSoon); window.addEventListener("orientationchange", placeSoon); window.addEventListener("load", place);
    setTimeout(place, 1200); setTimeout(place, 3000); setTimeout(tzShow, 1000);
  }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
  window.RCWidget = { open: open, close: close, version: "4.1.0", place: place };
})();
