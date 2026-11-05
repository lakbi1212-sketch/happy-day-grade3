/* ============================================================================
   حماية النسخ · Copy Protection
   © 2026 Mohamed Mostafa Al Shorbagy — Shamousa · شموسة · منصة الإتقان
   All rights reserved. This site and its content are protected by copyright.
   Signature: SHM-2026-ITQAN-90f132  —  do not remove this file or this notice.
   ============================================================================ */
(function () {
  'use strict';
  var SIG = 'SHM-2026-ITQAN-90f132';
  /* Official domains only. The site must run ONLY on these hosts. */
  var ALLOWED_EXACT = [
    /* Cloudflare Pages portal */
    'itqan-gate.pages.dev',
    'itqan-gate.workers.dev',
    /* Original Render hosts (his own account; auto-redirect to Cloudflare) */
    'grade1-phonics-2026.onrender.com',
    'grade2-english-2026.onrender.com',
    'happy-day-grade3.onrender.com',
    'my-school-day-grade4.onrender.com',
    'talent-studio-grade5.onrender.com',
    'hobby-club-grade6.onrender.com',
    'entertainment-city-grade7.onrender.com',
    'planet-protectors-grade8.onrender.com',
    'lost-identity-grade9.onrender.com',
    'grade10-english-2026.onrender.com',
    'grade11-engage-2026.onrender.com',
    'grade12-engage-2026.onrender.com',
    'stage1-reading.onrender.com',
    'grade9-million-student.onrender.com',
    /* Local preview */
    'localhost',
    '127.0.0.1'
  ];
  /* His own Cloudflare account subdomains (every grade site + branch previews) */
  var ALLOWED_SUFFIX = [
    '.itqan-gate.workers.dev',
    '.itqan-gate.pages.dev'
  ];
  var h = (location.hostname || '').toLowerCase();
  var ok = ALLOWED_EXACT.indexOf(h) !== -1;
  for (var i = 0; !ok && i < ALLOWED_SUFFIX.length; i++) {
    if (h.length > ALLOWED_SUFFIX[i].length && h.slice(-ALLOWED_SUFFIX[i].length) === ALLOWED_SUFFIX[i]) ok = true;
  }
  if (ok) { window.__SHM_SIG = SIG; return; }
  /* Unofficial copy: stop loading, wipe the page, show a notice. */
  var blocked = false;
  function block() {
    if (blocked) return; blocked = true;
    try { window.stop(); } catch (e) {}
    try {
      document.documentElement.innerHTML =
        '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
        '<title>نسخة غير رسمية · Unofficial copy</title></head>' +
        '<body style="margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;' +
        'font-family:Tahoma,Arial,sans-serif;background:#fff7f0;text-align:center;direction:rtl">' +
        '<div style="max-width:540px;padding:32px">' +
        '<div style="font-size:52px">☀️</div>' +
        '<h1 style="color:#b97a0e;font-size:24px">هذه نسخة غير رسمية من هذا الموقع</h1>' +
        '<p style="color:#585254;line-height:2;font-size:16px">' +
        'المحتوى محمي بحقوق النشر © 2026 محمد مصطفى الشربجي — شموسة.<br>' +
        'الموقع الأصلي يعمل فقط على نطاقاته الرسمية المعتمدة.</p>' +
        '<p style="font-size:14px;color:#8a8486">This is an unofficial copy. The original site runs only on its official domains.<br>' +
        'Copyright © 2026 Mohamed Mostafa Al Shorbagy. All rights reserved.</p>' +
        '<p><a style="color:#0e9f8a;font-weight:700;font-size:16px" href="https://itqan-gate.pages.dev/">⬅ الانتقال إلى البوابة الرسمية</a></p>' +
        '<!-- ' + SIG + ' -->' +
        '</div></body>';
    } catch (e) {}
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', block);
    setTimeout(block, 700);
  } else {
    block();
  }
  throw new Error('[' + SIG + '] Unauthorized domain: ' + h);
})();
