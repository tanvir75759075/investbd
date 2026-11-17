/* branding.js
   সাইটের নাম, logo (tab icon সহ) ও মূল রঙ: Firestore এর settings/branding থেকে এসে সব পেজে বসে।
   Admin panel এর Branding section থেকে এগুলো বদলানো যায়। */
(function () {
  'use strict';

  var DEFAULT_NAME = 'InvestBD';
  var CACHE_KEY = 'brandingV1';
  var TTL = 10 * 60 * 1000;            // ১০ মিনিট পর্যন্ত browser এ মনে রাখবে (read খরচ বাঁচাতে)
  var FB_VER = '12.14.0';
  var CONFIG = {
    apiKey: "AIzaSyCu-UBa4vCRLByPkQqlb5JjVvuHqMFPYxM",
    authDomain: "investbd-783df.firebaseapp.com",
    projectId: "investbd-783df",
    storageBucket: "investbd-783df.firebasestorage.app",
    messagingSenderId: "1043148979663",
    appId: "1:1043148979663:web:20465ee152597ce101e6ba"
  };

  var path = location.pathname.toLowerCase();
  var isAdminPage = path.indexOf('admin') !== -1;        // admin এর নিজস্ব লাল থিম থাকবে
  var isAdminLogin = path.indexOf('admin-login') !== -1; // admin login এ 🔐 আইকন থাকবে

  // ---------- নতুন লোডিং অ্যানিমেশন (টাকা কুড়ানো কার্টুন) ----------
  // প্রতিটা পেজের পুরোনো ঘোরা রিং এর জায়গায় বসে। শুধু CSS দিয়ে, তাই পেজ খোলার সাথে সাথেই দেখা যায়।
  var LOADER_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 400 300\"><style>@keyframes f1{0%{transform:translate(36px,-30px);opacity:0}8%{opacity:1}35%{transform:translate(50px,85px)}70%{transform:translate(22px,175px)}93%{opacity:1}100%{transform:translate(36px,252px);opacity:0}}@keyframes r1{0%{transform:rotate(-35deg)}50%{transform:rotate(20deg)}100%{transform:rotate(-10deg)}}.f1{animation:f1 3.6s linear -0.54s infinite}.r1{animation:r1 3.6s ease-in-out -0.54s infinite}@keyframes f2{0%{transform:translate(74px,-30px);opacity:0}8%{opacity:1}35%{transform:translate(58px,85px)}70%{transform:translate(90px,175px)}93%{opacity:1}100%{transform:translate(74px,252px);opacity:0}}@keyframes r2{0%{transform:rotate(25deg)}50%{transform:rotate(-30deg)}100%{transform:rotate(15deg)}}.f2{animation:f2 4.2s linear -2.94s infinite}.r2{animation:r2 4.2s ease-in-out -2.94s infinite}@keyframes f3{0%{transform:translate(118px,-30px);opacity:0}8%{opacity:1}35%{transform:translate(130px,85px)}70%{transform:translate(106px,175px)}93%{opacity:1}100%{transform:translate(118px,252px);opacity:0}}@keyframes r3{0%{transform:rotate(-20deg)}50%{transform:rotate(35deg)}100%{transform:rotate(-25deg)}}.f3{animation:f3 3.2s linear -1.28s infinite}.r3{animation:r3 3.2s ease-in-out -1.28s infinite}@keyframes f4{0%{transform:translate(164px,-30px);opacity:0}8%{opacity:1}35%{transform:translate(150px,85px)}70%{transform:translate(178px,175px)}93%{opacity:1}100%{transform:translate(164px,252px);opacity:0}}@keyframes r4{0%{transform:rotate(40deg)}50%{transform:rotate(-15deg)}100%{transform:rotate(30deg)}}.f4{animation:f4 4.6s linear -4.14s infinite}.r4{animation:r4 4.6s ease-in-out -4.14s infinite}@keyframes f5{0%{transform:translate(226px,-30px);opacity:0}8%{opacity:1}35%{transform:translate(242px,85px)}70%{transform:translate(210px,175px)}93%{opacity:1}100%{transform:translate(226px,252px);opacity:0}}@keyframes r5{0%{transform:rotate(-30deg)}50%{transform:rotate(25deg)}100%{transform:rotate(-35deg)}}.f5{animation:f5 3.8s linear -2.09s infinite}.r5{animation:r5 3.8s ease-in-out -2.09s infinite}@keyframes f6{0%{transform:translate(268px,-30px);opacity:0}8%{opacity:1}35%{transform:translate(256px,85px)}70%{transform:translate(280px,175px)}93%{opacity:1}100%{transform:translate(268px,252px);opacity:0}}@keyframes r6{0%{transform:rotate(15deg)}50%{transform:rotate(-40deg)}100%{transform:rotate(20deg)}}.f6{animation:f6 4.0s linear -1.0s infinite}.r6{animation:r6 4.0s ease-in-out -1.0s infinite}@keyframes f7{0%{transform:translate(312px,-30px);opacity:0}8%{opacity:1}35%{transform:translate(326px,85px)}70%{transform:translate(298px,175px)}93%{opacity:1}100%{transform:translate(312px,252px);opacity:0}}@keyframes r7{0%{transform:rotate(-45deg)}50%{transform:rotate(10deg)}100%{transform:rotate(-20deg)}}.f7{animation:f7 3.4s linear -2.72s infinite}.r7{animation:r7 3.4s ease-in-out -2.72s infinite}@keyframes f8{0%{transform:translate(352px,-30px);opacity:0}8%{opacity:1}35%{transform:translate(336px,85px)}70%{transform:translate(368px,175px)}93%{opacity:1}100%{transform:translate(352px,252px);opacity:0}}@keyframes r8{0%{transform:rotate(30deg)}50%{transform:rotate(-25deg)}100%{transform:rotate(40deg)}}.f8{animation:f8 4.4s linear -0.22s infinite}.r8{animation:r8 4.4s ease-in-out -0.22s infinite}@keyframes f9{0%{transform:translate(200px,-30px);opacity:0}8%{opacity:1}35%{transform:translate(212px,85px)}70%{transform:translate(188px,175px)}93%{opacity:1}100%{transform:translate(200px,252px);opacity:0}}@keyframes r9{0%{transform:rotate(-15deg)}50%{transform:rotate(30deg)}100%{transform:rotate(-30deg)}}.f9{animation:f9 5.0s linear -3.1s infinite}.r9{animation:r9 5.0s ease-in-out -3.1s infinite}.sp line{stroke:#fff;stroke-width:1.3;stroke-linecap:round;opacity:.55}.arm,.ctr,.hv,.squish,.peek,.bob{transform-origin:0 0}.arm{animation:reach 2.6s infinite}.ctr{animation:counter 2.6s infinite}.hv{animation:heldvis 2.6s infinite}.pk{animation:pickvis 2.6s infinite}.squish{animation:squish 2.6s infinite}.peek{animation:peek 2.6s infinite}.mk{animation:marks 2.6s infinite}.bob{animation:bob .65s ease-in-out infinite alternate}.ex{animation:blink .65s steps(1) infinite alternate}.d1,.d2,.d3{animation:dot 1.2s ease-in-out infinite}.d2{animation-delay:.2s}.d3{animation-delay:.4s}@keyframes reach{0%{transform:rotate(-10deg);animation-timing-function:cubic-bezier(.45,0,.25,1)}26%{transform:rotate(130deg)}34%{transform:rotate(130deg);animation-timing-function:cubic-bezier(.45,0,.25,1)}62%{transform:rotate(-10deg)}100%{transform:rotate(-10deg)}}@keyframes counter{0%{transform:rotate(10deg);animation-timing-function:cubic-bezier(.45,0,.25,1)}26%{transform:rotate(-130deg)}34%{transform:rotate(-130deg);animation-timing-function:cubic-bezier(.45,0,.25,1)}62%{transform:rotate(10deg)}100%{transform:rotate(10deg)}}@keyframes heldvis{0%{opacity:0}25.9%{opacity:0}26%{opacity:1;transform:scale(1)}61%{opacity:1;transform:scale(1)}72%{opacity:0;transform:scale(.35)}100%{opacity:0;transform:scale(.35)}}@keyframes pickvis{0%{opacity:1}25.9%{opacity:1}26%{opacity:0}92%{opacity:0}100%{opacity:1}}@keyframes squish{0%,62%{transform:scale(1,1)}66%{transform:scale(1.07,.9)}70%{transform:scale(.97,1.05)}74%{transform:scale(1.02,.98)}78%,100%{transform:scale(1,1)}}@keyframes peek{0%,62%{transform:translateY(0)}67%{transform:translateY(-6px)}74%,100%{transform:translateY(0)}}@keyframes marks{0%,63%{opacity:0}66%,72%{opacity:1}76%,100%{opacity:0}}@keyframes bob{from{transform:translateY(0) rotate(-3deg)}to{transform:translateY(-4px) rotate(3deg)}}@keyframes blink{from{opacity:1}to{opacity:.2}}@keyframes dot{0%,100%{opacity:.25}50%{opacity:1}}@media (prefers-reduced-motion:reduce){*{animation:none!important}}</style><defs><g id=\"note\"><rect x=\"-17\" y=\"-9\" width=\"34\" height=\"18\" rx=\"2.2\" fill=\"#fff\" stroke=\"#000\" stroke-width=\"1.4\"/><rect x=\"-14.2\" y=\"-6.4\" width=\"28.4\" height=\"12.8\" rx=\"1.6\" fill=\"none\" stroke=\"#9a9a9a\" stroke-width=\".7\"/><circle r=\"5.4\" fill=\"#e4e4e4\" stroke=\"#8a8a8a\" stroke-width=\".6\"/><text y=\"3.4\" font-size=\"9.5\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#111\" font-family=\"Arial,Helvetica,sans-serif\">$</text><circle cx=\"-11.4\" r=\"1.2\" fill=\"#777\"/><circle cx=\"11.4\" r=\"1.2\" fill=\"#777\"/></g></defs><g class=\"f1\" transform=\"translate(36 58)\"><g class=\"sp\"><line x1=\"-7\" y1=\"-44\" x2=\"-7\" y2=\"-22\"/><line x1=\"6\" y1=\"-52\" x2=\"6\" y2=\"-26\"/></g><g class=\"r1\" transform=\"rotate(20)\"><use xlink:href=\"#note\" transform=\"scale(1.12)\"/></g></g><g class=\"f2\" transform=\"translate(74 40)\"><g class=\"sp\"><line x1=\"-7\" y1=\"-44\" x2=\"-7\" y2=\"-22\"/><line x1=\"6\" y1=\"-52\" x2=\"6\" y2=\"-26\"/></g><g class=\"r2\" transform=\"rotate(-30)\"><use xlink:href=\"#note\" transform=\"scale(1.12)\"/></g></g><g class=\"f3\" transform=\"translate(118 70)\"><g class=\"sp\"><line x1=\"-7\" y1=\"-44\" x2=\"-7\" y2=\"-22\"/><line x1=\"6\" y1=\"-52\" x2=\"6\" y2=\"-26\"/></g><g class=\"r3\" transform=\"rotate(35)\"><use xlink:href=\"#note\" transform=\"scale(1.12)\"/></g></g><g class=\"f4\" transform=\"translate(164 25)\"><g class=\"sp\"><line x1=\"-7\" y1=\"-44\" x2=\"-7\" y2=\"-22\"/><line x1=\"6\" y1=\"-52\" x2=\"6\" y2=\"-26\"/></g><g class=\"r4\" transform=\"rotate(-15)\"><use xlink:href=\"#note\" transform=\"scale(1.12)\"/></g></g><g class=\"f5\" transform=\"translate(226 50)\"><g class=\"sp\"><line x1=\"-7\" y1=\"-44\" x2=\"-7\" y2=\"-22\"/><line x1=\"6\" y1=\"-52\" x2=\"6\" y2=\"-26\"/></g><g class=\"r5\" transform=\"rotate(25)\"><use xlink:href=\"#note\" transform=\"scale(1.12)\"/></g></g><g class=\"f6\" transform=\"translate(268 35)\"><g class=\"sp\"><line x1=\"-7\" y1=\"-44\" x2=\"-7\" y2=\"-22\"/><line x1=\"6\" y1=\"-52\" x2=\"6\" y2=\"-26\"/></g><g class=\"r6\" transform=\"rotate(-40)\"><use xlink:href=\"#note\" transform=\"scale(1.12)\"/></g></g><g class=\"f7\" transform=\"translate(312 62)\"><g class=\"sp\"><line x1=\"-7\" y1=\"-44\" x2=\"-7\" y2=\"-22\"/><line x1=\"6\" y1=\"-52\" x2=\"6\" y2=\"-26\"/></g><g class=\"r7\" transform=\"rotate(10)\"><use xlink:href=\"#note\" transform=\"scale(1.12)\"/></g></g><g class=\"f8\" transform=\"translate(352 30)\"><g class=\"sp\"><line x1=\"-7\" y1=\"-44\" x2=\"-7\" y2=\"-22\"/><line x1=\"6\" y1=\"-52\" x2=\"6\" y2=\"-26\"/></g><g class=\"r8\" transform=\"rotate(-25)\"><use xlink:href=\"#note\" transform=\"scale(1.12)\"/></g></g><g class=\"f9\" transform=\"translate(200 45)\"><g class=\"sp\"><line x1=\"-7\" y1=\"-44\" x2=\"-7\" y2=\"-22\"/><line x1=\"6\" y1=\"-52\" x2=\"6\" y2=\"-26\"/></g><g class=\"r9\" transform=\"rotate(30)\"><use xlink:href=\"#note\" transform=\"scale(1.12)\"/></g></g><ellipse cx=\"205\" cy=\"268\" rx=\"150\" ry=\"7\" fill=\"#fff\" opacity=\".07\"/><path d=\"M160 212 Q140 226 132 256\" fill=\"none\" stroke=\"#000\" stroke-width=\"18\" stroke-linecap=\"round\"/><path d=\"M160 212 Q140 226 132 256\" fill=\"none\" stroke=\"#fff\" stroke-width=\"13\" stroke-linecap=\"round\"/><circle cx=\"131\" cy=\"258\" r=\"8\" fill=\"#fff\" stroke=\"#000\" stroke-width=\"2.5\"/><path d=\"M138 264 C130 226 148 196 176 192 C206 188 218 222 212 264 Z\" fill=\"#fff\" stroke=\"#000\" stroke-width=\"3\"/><g transform=\"translate(172 200)\"><g class=\"bob\"><g transform=\"rotate(-6)\"><circle cy=\"-40\" r=\"36\" fill=\"#fff\" stroke=\"#000\" stroke-width=\"3\"/><polyline points=\"-22,-47 -10,-41 -22,-35\" fill=\"none\" stroke=\"#000\" stroke-width=\"4.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><polyline points=\"22,-47 10,-41 22,-35\" fill=\"none\" stroke=\"#000\" stroke-width=\"4.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M-13 -29 Q0 -27 13 -29 Q10 -8 0 -8 Q-10 -8 -13 -29Z\" fill=\"#000\"/><ellipse cy=\"-13.5\" rx=\"6\" ry=\"3.3\" fill=\"#cfcfcf\"/></g><g class=\"ex\" stroke=\"#fff\" stroke-width=\"3.2\" stroke-linecap=\"round\"><line x1=\"15.7\" y1=\"-83.2\" x2=\"19.2\" y2=\"-92.6\"/><line x1=\"32.5\" y1=\"-72.5\" x2=\"39.6\" y2=\"-79.6\"/><line x1=\"43.2\" y1=\"-55.7\" x2=\"52.6\" y2=\"-59.1\"/></g></g></g><use xlink:href=\"#note\" transform=\"translate(88 262) rotate(10) scale(1.12)\"/><use xlink:href=\"#note\" transform=\"translate(112 259) rotate(-18) scale(1.12)\"/><use xlink:href=\"#note\" transform=\"translate(178 265) rotate(-6) scale(1.12)\"/><use xlink:href=\"#note\" transform=\"translate(208 267) rotate(14) scale(1.12)\"/><use xlink:href=\"#note\" transform=\"translate(282 264) rotate(-10) scale(1.12)\"/><use xlink:href=\"#note\" transform=\"translate(300 267) rotate(8) scale(1.12)\"/><use xlink:href=\"#note\" transform=\"translate(322 260) rotate(20) scale(1.12)\"/><use xlink:href=\"#note\" transform=\"translate(344 263) rotate(-14) scale(1.12)\"/><g class=\"pk\" opacity=\"1\"><use xlink:href=\"#note\" transform=\"translate(146 252) rotate(-14) scale(1.12)\"/></g><g transform=\"translate(240 262)\"><g class=\"squish\"><g class=\"peek\"><use xlink:href=\"#note\" transform=\"translate(-7 -66) rotate(-14) scale(1.05)\"/><use xlink:href=\"#note\" transform=\"translate(9 -69) rotate(12) scale(1.05)\"/></g><path d=\"M-26 0 C-44 -4 -46 -32 -26 -50 C-20 -56 -17 -60 -15 -64 L15 -64 C17 -60 20 -56 26 -50 C46 -32 44 -4 26 0 C10 4 -10 4 -26 0 Z\" fill=\"#fff\" stroke=\"#000\" stroke-width=\"3\"/><path d=\"M-16 -58 Q0 -52 16 -58\" fill=\"none\" stroke=\"#000\" stroke-width=\"2.6\" stroke-linecap=\"round\"/><path d=\"M11 -62 C21 -74 35 -68 29 -59 C25 -54 16 -57 11 -62Z\" fill=\"#fff\" stroke=\"#000\" stroke-width=\"2.4\" stroke-linejoin=\"round\"/><text y=\"-17\" font-size=\"36\" font-weight=\"800\" text-anchor=\"middle\" fill=\"#000\" font-family=\"Arial,Helvetica,sans-serif\">$</text></g></g><g class=\"mk\" stroke=\"#fff\" stroke-width=\"2.6\" stroke-linecap=\"round\" fill=\"none\"><path d=\"M296 226 Q303 234 297 242\"/><path d=\"M304 220 Q314 232 306 246\"/><path d=\"M180 232 Q174 240 180 247\" transform=\"translate(40 -10)\" opacity=\"0\"/></g><use xlink:href=\"#note\" transform=\"translate(150 268) rotate(8) scale(1.12)\"/><use xlink:href=\"#note\" transform=\"translate(268 270) rotate(-12) scale(1.12)\"/><g transform=\"translate(182 208)\"><g class=\"arm\" transform=\"rotate(-10)\"><line x2=\"56\" stroke=\"#000\" stroke-width=\"19\" stroke-linecap=\"round\"/><line x2=\"56\" stroke=\"#fff\" stroke-width=\"13\" stroke-linecap=\"round\"/><circle r=\"8.5\" fill=\"#fff\" stroke=\"#000\" stroke-width=\"2.5\"/><circle cx=\"56\" r=\"8.5\" fill=\"#fff\" stroke=\"#000\" stroke-width=\"2.5\"/><g transform=\"translate(60 0)\"><g class=\"ctr\" transform=\"rotate(10)\"><g class=\"hv\" opacity=\"1\"><g transform=\"rotate(-20) scale(1.05)\"><use xlink:href=\"#note\"/></g></g></g></g></g></g><g fill=\"#fff\"><circle class=\"d1\" cx=\"188\" cy=\"289\" r=\"3\"/><circle class=\"d2\" cx=\"200\" cy=\"289\" r=\"3\"/><circle class=\"d3\" cx=\"212\" cy=\"289\" r=\"3\"/></g></svg>";
  (function injectLoader() {
    if (isAdminPage) return;
    var url = 'data:image/svg+xml,' + encodeURIComponent(LOADER_SVG);
    var st = document.createElement('style');
    st.id = 'brand-loader-css';
    st.textContent =
      '.loading-screen .spin,.loading-full .spin{width:min(86vw,400px);height:min(64.5vw,300px);' +
      'border:0;border-radius:0;animation:none;background:url("' + url + '") center/contain no-repeat;}' +
      '.loading-screen>div:not(.spin)[style*="2.5rem"]{display:none;}';
    document.head.appendChild(st);
  })();

  var origTitle = null;
  var textNodes = null;
  var logoEls = null;
  var applied;

  window.SITE_NAME = DEFAULT_NAME;

  // ---------- যাচাই ----------
  function clean(d) {
    if (!d || typeof d !== 'object') return null;
    var name = typeof d.siteName === 'string' ? d.siteName.trim().slice(0, 30) : '';
    var logo = (typeof d.logo === 'string' && d.logo.indexOf('data:image/') === 0 && d.logo.length < 400000) ? d.logo : '';
    var accent = (typeof d.accent === 'string' && /^#[0-9a-fA-F]{6}$/.test(d.accent)) ? d.accent.toLowerCase() : '';
    if (!name && !logo && !accent) return null;
    return { siteName: name, logo: logo, accent: accent };
  }

  // ---------- cache ----------
  function readCache() {
    try {
      var c = JSON.parse(localStorage.getItem(CACHE_KEY));
      return (c && typeof c.t === 'number') ? c : null;
    } catch (e) { return null; }
  }
  function writeCache(data) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), data: data })); } catch (e) {}
  }

  // ---------- রঙ ----------
  function hexToRgb(h) {
    return [parseInt(h.substr(1, 2), 16), parseInt(h.substr(3, 2), 16), parseInt(h.substr(5, 2), 16)];
  }
  function toHex(rgb) {
    return '#' + rgb.map(function (v) {
      v = Math.max(0, Math.min(255, Math.round(v)));
      return (v < 16 ? '0' : '') + v.toString(16);
    }).join('');
  }
  function mix(rgb, target, t) {
    return rgb.map(function (v, i) { return v + (target[i] - v) * t; });
  }
  function applyColors(accent) {
    if (isAdminPage) return;
    var s = document.documentElement.style;
    if (!accent) {
      ['--gold', '--gold-light', '--gold-dark', '--gold-rgb'].forEach(function (k) { s.removeProperty(k); });
      return;
    }
    var rgb = hexToRgb(accent);
    s.setProperty('--gold', accent);
    s.setProperty('--gold-light', toHex(mix(rgb, [255, 255, 255], 0.3)));
    s.setProperty('--gold-dark', toHex(mix(rgb, [0, 0, 0], 0.2)));
    s.setProperty('--gold-rgb', rgb.join(','));
  }

  // ---------- tab এর লেখা ও আইকন ----------
  function applyTitle(name) {
    if (origTitle === null) origTitle = document.title || '';
    if (origTitle) document.title = origTitle.split(DEFAULT_NAME).join(name);
  }
  function applyFavicon(logo) {
    var el = document.getElementById('brand-favicon');
    if (logo) {
      if (!el) {
        el = document.createElement('link');
        el.id = 'brand-favicon';
        el.rel = 'icon';
        document.head.appendChild(el);
      }
      el.type = logo.slice(5, logo.indexOf(';'));
      el.href = logo;
    } else if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }

  // ---------- পেজের লেখা ও logo ----------
  function collect() {
    if (textNodes) return;
    textNodes = [];
    logoEls = [];
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = walker.nextNode())) {
      var p = n.parentNode ? n.parentNode.nodeName : '';
      if (p === 'SCRIPT' || p === 'STYLE' || p === 'TEXTAREA' || p === 'NOSCRIPT') continue;
      if (n.nodeValue.indexOf(DEFAULT_NAME) !== -1) textNodes.push({ node: n, orig: n.nodeValue });
    }
    if (!isAdminLogin) {
      var els = document.querySelectorAll('.logo-icon, .footer-logo-icon');
      for (var i = 0; i < els.length; i++) {
        logoEls.push({ el: els[i], html: els[i].innerHTML, style: els[i].getAttribute('style') });
      }
    }
  }
  function applyDom(name, logo) {
    if (!document.body) return;
    collect();
    textNodes.forEach(function (t) {
      t.node.nodeValue = t.orig.split(DEFAULT_NAME).join(name);
    });
    logoEls.forEach(function (o) {
      var el = o.el;
      if (logo) {
        el.innerHTML = '';
        var img = document.createElement('img');
        img.src = logo;
        img.alt = name;
        img.style.cssText = 'width:100%;height:100%;object-fit:contain;display:block;';
        el.appendChild(img);
        el.style.background = 'transparent';
        el.style.boxShadow = 'none';
      } else {
        el.innerHTML = o.html;
        if (o.style === null) el.removeAttribute('style');
        else el.setAttribute('style', o.style);
      }
    });
  }

  function applyAll(c) {
    applied = c;
    var name = (c && c.siteName) || DEFAULT_NAME;
    var logo = (c && c.logo) || '';
    window.SITE_NAME = name;
    applyColors((c && c.accent) || '');
    applyTitle(name);
    applyFavicon(logo);
    applyDom(name, logo);
  }

  // ---------- Firestore থেকে আনা (login ছাড়াই, শুধু settings/branding) ----------
  function fetchRemote(cb) {
    Promise.all([
      import('https://www.gstatic.com/firebasejs/' + FB_VER + '/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/' + FB_VER + '/firebase-firestore.js')
    ]).then(function (m) {
      var app = m[0].getApps().filter(function (a) { return a.name === 'branding'; })[0]
                || m[0].initializeApp(CONFIG, 'branding');
      var db = m[1].getFirestore(app);
      return m[1].getDoc(m[1].doc(db, 'settings', 'branding'));
    }).then(function (snap) {
      cb(snap.exists() ? snap.data() : null);
    }).catch(function () {
      cb(undefined); // আনতে না পারলে যেমন আছে তেমনই থাকবে
    });
  }

  // ---------- চালু ----------
  var cache = readCache();
  if (cache) applyAll(clean(cache.data));

  document.addEventListener('DOMContentLoaded', function () {
    if (applied !== undefined) applyAll(applied);
  });

  if (!cache || Date.now() - cache.t > TTL) {
    fetchRemote(function (d) {
      if (d === undefined) {
        if (cache) writeCache(cache.data);
        return;
      }
      var c = clean(d);
      writeCache(c);
      applyAll(c);
    });
  }

  // admin panel থেকে সেভ করার সাথে সাথে নিজের browser এ দেখানোর জন্য
  window.__brandingRefresh = function (d) {
    var c = clean(d);
    writeCache(c);
    applyAll(c);
  };
})();