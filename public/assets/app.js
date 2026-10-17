(function () {
  var C = window.NSTM || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- consent + TikTok pixel ---------- */
  function getConsent() { try { return localStorage.getItem("nstm_consent"); } catch (e) { return null; } }
  function setConsent(v) { try { localStorage.setItem("nstm_consent", v); } catch (e) {} }
  function loadPixel() {
    if (!C.tiktokPixel || window.ttq) return;
    !function (w, d, t) { w.TiktokAnalyticsObject = t; var ttq = w[t] = w[t] || []; ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"], ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))) } }; for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]); ttq.instance = function (t) { for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]); return e }, ttq.load = function (e, n) { var r = "https://analytics.tiktok.com/i18n/pixel/events.js"; ttq._i = ttq._i || {}, ttq._i[e] = [], ttq._i[e]._u = r, ttq._t = ttq._t || {}, ttq._t[e] = +new Date, ttq._o = ttq._o || {}, ttq._o[e] = n || {}; var o = d.createElement("script"); o.type = "text/javascript", o.async = !0, o.src = r + "?sdkid=" + e + "&lib=" + t; var a = d.getElementsByTagName("script")[0]; a.parentNode.insertBefore(o, a) }; ttq.load(C.tiktokPixel); ttq.page(); }(window, document, "ttq");
    var ev = document.body.getAttribute("data-event");
    if (ev) {
      var k = "nstm_ev_" + ev + location.search;
      var done = false; try { done = !!localStorage.getItem(k); localStorage.setItem(k, "1"); } catch (e) {}
      if (!done) window.ttq.track(ev, { value: C.price, currency: C.currency, content_name: "No soy tu madre" });
    }
  }
  window.nstmTrack = function (ev) { if (window.ttq) window.ttq.track(ev, { value: C.price, currency: C.currency, content_name: "No soy tu madre" }); };

  var ck = $("#cookie");
  if (C.tiktokPixel) {
    var c = getConsent();
    if (c === "yes") loadPixel();
    else if (!c && ck) ck.classList.add("show");
  }
  if (ck) {
    $("#ckYes").onclick = function () { setConsent("yes"); ck.classList.remove("show"); loadPixel(); };
    $("#ckNo").onclick = function () { setConsent("no"); ck.classList.remove("show"); };
  }
  window.nstmResetConsent = function () { try { localStorage.removeItem("nstm_consent"); } catch (e) {} location.reload(); };

  /* ---------- buy buttons ---------- */
  $$("a.buy").forEach(function (a) {
    if (C.paymentLink) { a.href = C.paymentLink; }
    a.addEventListener("click", function () { if (C.paymentLink) window.nstmTrack("InitiateCheckout"); });
  });

  /* ---------- reveal on scroll ---------- */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.15 }) : null;
  $$(".rv").forEach(function (el) { io ? io.observe(el) : el.classList.add("in"); });

  /* ---------- chat bubbles ---------- */
  var phone = $("#phone");
  if (phone) {
    var bubs = $$(".bub", phone);
    var play = function () { bubs.forEach(function (b, i) { setTimeout(function () { b.classList.add("in"); }, 350 * i); }); };
    if (io) {
      var pio = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { play(); pio.disconnect(); } }, { threshold: 0.3 });
      pio.observe(phone);
    } else play();
  }

  /* ---------- test ---------- */
  var box = $("#testBox");
  if (box) {
    var qs = $$(".q", box), T = $("#scoreT"), D = $("#scoreD"), M = $("#meter"), CTA = $("#scoreCta");
    var upd = function () {
      var n = qs.filter(function (q) { return q.getAttribute("aria-pressed") === "true"; }).length;
      M.style.width = Math.round(n / qs.length * 100) + "%";
      if (n === 0) { T.textContent = "Toca las frases que te pasan"; D.textContent = "Verás en qué punto estás."; CTA.style.display = "none"; return; }
      CTA.style.display = "block";
      if (n <= 2) { T.textContent = n + "/7 · Vas bien, pero ojo"; D.textContent = "Aún eres su pareja, pero el papel de madre se cuela. Es el mejor momento para cortarlo de raíz."; }
      else if (n <= 4) { T.textContent = n + "/7 · Jefa de proyecto"; D.textContent = "Llevas casi todo tú porque «así es más rápido». Lo estás pagando con tu energía y con vuestra chispa."; }
      else { T.textContent = n + "/7 · Madre a jornada completa"; D.textContent = "Se ha convertido en tu hijo mayor. No es culpa tuya, pero sí está en tu mano cambiarlo. Este plan es para ti."; }
    };
    qs.forEach(function (q) { q.addEventListener("click", function () { q.setAttribute("aria-pressed", q.getAttribute("aria-pressed") === "true" ? "false" : "true"); upd(); }); });
  }

  /* ---------- sticky CTA ---------- */
  var st = $("#sticky"), hero = $(".hero"), offer = $("#oferta");
  if (st && hero && io) {
    var heroOut = false, offerIn = false;
    var set = function () { st.classList.toggle("show", heroOut && !offerIn); };
    new IntersectionObserver(function (es) { heroOut = !es[0].isIntersecting; set(); }).observe(hero);
    if (offer) new IntersectionObserver(function (es) { offerIn = es[0].isIntersecting; set(); }, { threshold: 0.2 }).observe(offer);
  }

  var y = $("#y"); if (y) y.textContent = new Date().getFullYear();
})();
