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