/* Rooter Champion app service worker (rooterchampion.net). Lives at /app/sw.js.
   Registered ONLY for the app folders: scope /help/ and scope /book/ (see /app/.htaccess).
   It never controls the main site pages (/, *.html) and never caches the main site's own files
   (/styles.css, /scripts.js, /brand_assets/...). It only caches: the app pages (/help/, /book/, /offline/),
   files under /app/, and the Tailwind/Google Fonts CDN files the app pages use. */
var VERSION = "rc-net-v4f-promo1";
var PRECACHE = [
  "/help/",
  "/help/check/",
  "/book/",
  "/offline/",
  "/help/bathroom-sink-clog/",
  "/help/clogged-toilet/",
  "/help/shower-tub-drain/",
  "/help/kitchen-sink-grease/",
  "/help/main-sewer-line-clog/",
  "/help/sewage-backup-emergency/",
  "/help/gurgling-drains/",
  "/help/sewer-smell/",
  "/help/tree-roots-sewer/",
  "/help/laundry-drain-overflow/",
  "/help/yard-area-drain/",
  "/help/sewer-pipe-repair-trenchless/",
  "/help/la-habra/",
  "/help/fullerton/",
  "/help/la-mirada/",
  "/help/whittier/",
  "/app/app.js?v=6",
  "/app/app.css?v=5",
  "/app/img/logo.webp",
  "/app/img/favicon-64.png",
  "/app/img/hero-800.webp",
  "/app/icons/icon-192.png",
  "/app/manifest.webmanifest"
];
var CDN = ["https://cdn.tailwindcss.com/"];
var CDN_HOSTS = ["cdn.tailwindcss.com", "fonts.googleapis.com", "fonts.gstatic.com"];
var APP_PAGES = /^\/(help|book|offline)\//;

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) {
    return c.addAll(PRECACHE).then(function () {
      return Promise.all(CDN.map(function (u) {
        return fetch(new Request(u, { mode: "no-cors" })).then(function (r) { return c.put(u, r); }).catch(function () {});
      }));
    });
  }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return /^rc-/.test(k) && k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
function swr(req) {
  return caches.open(VERSION).then(function (c) {
    return c.match(req, { ignoreVary: true }).then(function (hit) {
      var net = fetch(req).then(function (r) { if (r && (r.ok || r.type === "opaque")) c.put(req, r.clone()); return r; }).catch(function () { return hit; });
      return hit || net;
    });
  });
}
function networkFirst(req) {
  return caches.open(VERSION).then(function (c) {
    var timeout = new Promise(function (res) { setTimeout(res, 3500); });
    var net = fetch(req).then(function (r) {
      if (r && r.ok) { var u = new URL(req.url); c.put(u.origin + u.pathname, r.clone()); }
      return r;
    });
    return Promise.race([net, timeout.then(function () { return null; })]).then(function (r) {
      if (r) return r;
      return c.match(req, { ignoreSearch: true }).then(function (hit) { return hit || net; });
    }).catch(function () {
      return c.match(req, { ignoreSearch: true }).then(function (hit) { return hit || c.match("/offline/"); });
    });
  });
}
self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var u = new URL(req.url);
  if (u.origin === self.location.origin) {
    if (req.mode === "navigate" && APP_PAGES.test(u.pathname)) { e.respondWith(networkFirst(req)); return; }
    if (/^\/app\//.test(u.pathname) && !/\/app\/sw\.js$/.test(u.pathname)) { e.respondWith(swr(req)); return; }
    return; // everything else on rooterchampion.net goes straight to the network, untouched
  }
  if (CDN_HOSTS.indexOf(u.hostname) !== -1) e.respondWith(swr(req));
});
