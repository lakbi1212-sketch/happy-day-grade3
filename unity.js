/* هوية موحدة لمواقع «خطوة نحو الإتقان» — unified nav + identity bar.
   One identical file on every grade site. Config picked by hostname.
   v2: Itqan unified visual identity (dark blue + turquoise brand bar, Cairo/Poppins). */
(function () {
  'use strict';
  var PORTAL = 'https://itqan-gate.pages.dev/';
  var SITES = {
    'grade1-phonics-2026':      { g: 'الصف الأول',       icon: '🔤', c1: '#ff6b6b', c2: '#ee5253', big: true },
    'grade2-english-2026':      { g: 'الصف الثاني',      icon: '🎈', c1: '#ffa502', c2: '#ff7f50', big: true },
    'happy-day-grade3':         { g: 'الصف الثالث',      icon: '☀️', c1: '#fdb93e', c2: '#f39c12' },
    'my-school-day-grade4':     { g: 'الصف الرابع',      icon: '🎒', c1: '#1dd1a1', c2: '#10ac84' },
    'talent-studio-grade5':     { g: 'الصف الخامس',      icon: '🎨', c1: '#16a0a0', c2: '#0e8383' },
    'hobby-club-grade6':        { g: 'الصف السادس',      icon: '⚽', c1: '#48dbfb', c2: '#0abde3' },
    'entertainment-city-grade7':{ g: 'الصف السابع',      icon: '🎡', c1: '#0abde3', c2: '#2e86de' },
    'planet-protectors-grade8': { g: 'الصف الثامن',      icon: '🌍', c1: '#3d6fd8', c2: '#2b54a8' },
    'lost-identity-grade9':     { g: 'الصف التاسع',      icon: '🕵️', c1: '#8a7bd8', c2: '#6f5fc0' },
    'grade10-english-2026':     { g: 'الصف العاشر',      icon: '🌡️', c1: '#c9649b', c2: '#a94e82' },
    'grade11-engage-2026':      { g: 'الصف الحادي عشر',  icon: '🚀', c1: '#5f6fd4', c2: '#4853b4' },
    'grade12-engage-2026':      { g: 'الصف الثاني عشر',  icon: '🎓', c1: '#c96f52', c2: '#ac5839' }
  };
  if (document.getElementById('unity-bar')) return;
  var host = location.hostname, cfg = null;
  for (var k in SITES) { if (host.indexOf(k) === 0) { cfg = SITES[k]; break; } }
  if (!cfg) cfg = { g: '', icon: '☀️', c1: '#f9ca24', c2: '#f0932b' };
  var isHome = /\/(index\.html)?$/.test(location.pathname) || location.pathname === '';
  var fs = cfg.big ? 20 : 16;

  /* Unified identity fonts (Cairo + Poppins); keep legacy families pages already use */
  var hasFont = false;
  for (var i = 0; i < document.styleSheets.length; i++) { try { if (document.styleSheets[i].href && document.styleSheets[i].href.indexOf('family=Cairo') >= 0) { hasFont = true; break; } } catch (e) {} }
  if (!hasFont && !document.querySelector('link[href*="family=Cairo"]')) {
    var fl = document.createElement('link');
    fl.rel = 'stylesheet';
    fl.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;800&family=Fredoka:wght@500;700&family=Noto+Naskh+Arabic:wght@400;600;700;800&family=Poppins:wght@400;600;700&display=swap';
    document.head.appendChild(fl);
  }

  var css =
    '#unity-bar,#unity-bar *,.unity-nav,.unity-nav *{box-sizing:border-box}'+
    '#shm-launch{position:relative!important;bottom:auto!important;right:auto!important;left:auto!important;display:block!important;width:max-content;max-width:calc(100% - 32px);margin:24px auto!important}'+
    'html{-webkit-text-size-adjust:100%;text-size-adjust:100%}' +
    'body{padding-top:' + (cfg.big ? 66 : 58) + 'px!important}' +
    '#unity-bar{position:fixed;top:0;right:0;left:0;z-index:25;display:flex;align-items:center;gap:8px;' +
      'padding:6px 10px;background:linear-gradient(135deg,#122A4F,#1B3A6B);border-bottom:3px solid #12B5A5;' +
      'box-shadow:0 3px 10px rgba(18,42,79,.35);direction:rtl;' +
      'font-family:\'Cairo\',\'Noto Naskh Arabic\',Tahoma,Arial,sans-serif}' +
    '#unity-bar a.ub-brand{display:inline-flex;align-items:baseline;gap:7px;text-decoration:none;color:#fff;' +
      'font-weight:800;font-size:' + fs + 'px;text-shadow:0 2px 3px rgba(0,0,0,.3);line-height:1.5;white-space:nowrap}' +
    '#unity-bar a.ub-brand small{font-family:\'Poppins\',\'Cairo\',Tahoma,sans-serif;font-size:9px;font-weight:600;' +
      'letter-spacing:2px;color:#7FE3D8}' +
    '#unity-bar a.ub{display:inline-flex;align-items:center;gap:6px;text-decoration:none;color:#fff;' +
      'font-weight:800;font-size:' + fs + 'px;text-shadow:0 2px 3px rgba(0,0,0,.3);' +
      'background:rgba(255,255,255,.16);border:2px solid rgba(255,255,255,.55);border-radius:999px;' +
      'padding:' + (cfg.big ? '8px 18px' : '5px 14px') + ';line-height:1.5;white-space:nowrap}' +
    '#unity-bar a.ub:active{transform:scale(.96)}' +
    '#unity-bar .ub-title{flex:1;text-align:center;color:#fff;font-weight:800;font-size:' + (fs + 1) + 'px;' +
      'text-shadow:0 2px 3px rgba(0,0,0,.3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '#unity-bar .ub-title .chip{display:inline-block;background:linear-gradient(135deg,' + cfg.c1 + ',' + cfg.c2 + ');' +
      'border-radius:999px;padding:2px 14px;border:2px solid rgba(255,255,255,.45)}' +
    '.unity-nav{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;max-width:560px;' +
      'margin:34px auto 6px;padding:0 14px;direction:rtl;clear:both;' +
      'font-family:\'Cairo\',\'Noto Naskh Arabic\',Tahoma,Arial,sans-serif}' +
    '.unity-nav a{flex:1;min-width:140px;text-align:center;text-decoration:none;color:#fff;font-weight:800;' +
      'font-size:' + (cfg.big ? 26 : 21) + 'px;padding:' + (cfg.big ? '18px 12px' : '14px 12px') + ';border-radius:20px;' +
      'text-shadow:0 2px 3px rgba(0,0,0,.3);box-shadow:0 5px 0 rgba(18,42,79,.28);border:3px solid rgba(255,255,255,.5)}' +
    '.unity-nav a:active{transform:translateY(3px);box-shadow:0 2px 0 rgba(18,42,79,.28)}' +
    '.unity-nav .un-home{background:linear-gradient(135deg,' + cfg.c1 + ',' + cfg.c2 + ')}' +
    '.unity-nav .un-portal{background:linear-gradient(135deg,#1B3A6B,#12B5A5)}';
  var st = document.createElement('style');
  st.id = 'unity-bar-css';
  st.textContent = css;
  document.head.appendChild(st);

  function link(href, cls, html) { var a = document.createElement('a'); a.href = href; a.className = cls; a.innerHTML = html; return a; }

  var bar = document.createElement('div');
  bar.id = 'unity-bar';
  bar.appendChild(link(PORTAL, 'ub-brand', '🌞 بوابة الإتقان <small>ITQAN GATE</small>'));
  var t = document.createElement('span');
  t.className = 'ub-title';
  t.innerHTML = '<span class="chip">' + (cfg.icon + ' ' + cfg.g).trim() + '</span>';
  bar.appendChild(t);
  if (!isHome) bar.appendChild(link('index.html', 'ub', '🏠 الرئيسية / Home'));
  document.body.appendChild(bar);

  var nav = document.createElement('nav');
  nav.className = 'unity-nav';
  nav.setAttribute('aria-label', 'التنقل الرئيسي');
  if (!isHome) nav.appendChild(link('index.html', 'un-home', '🏠 الرئيسية / Home'));
  nav.appendChild(link(PORTAL, 'un-portal', '🌞 بوابة الإتقان'));
  document.body.appendChild(nav);
})();
