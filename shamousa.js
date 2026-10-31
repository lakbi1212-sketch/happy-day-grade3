/* \u2600\ufe0f \u0634\u0645\u0648\u0633\u0629 \u2014 Shamousa shorts launcher. New shorts: add one line to SHORTS below. */
(function () {
  var CHANNEL = "https://www.youtube.com/@Shamousa.2learn.english";
  var SHORTS = [
  {
    "id": "gzhniD7cuc8",
    "ar": "am / is / are",
    "en": "am - is - are"
  }
];
  var PALETTE = ["#e84393", "#e17055", "#00b894", "#0984e3", "#6c5ce7", "#d63031", "#00cec9", "#fd79a8"];
  if (document.getElementById("shm-launch")) return;
  var css =
    "#shm-launch{position:fixed;bottom:14px;right:14px;z-index:90;background:linear-gradient(135deg,#e84393,#e17055);color:#fff;font:800 15px/1.5 'Noto Naskh Arabic',Tahoma,Arial,sans-serif;padding:9px 20px;border-radius:999px;box-shadow:0 4px 0 #b03060,0 6px 14px rgba(0,0,0,.3);border:3px solid #fff;cursor:pointer;text-align:center}" +
    "#shm-launch small{display:block;font-size:12px;font-weight:700}" +
    "#shm-overlay{position:fixed;inset:0;z-index:95;background:rgba(40,20,60,.55);display:flex;align-items:center;justify-content:center;padding:18px}" +
    "#shm-panel{background:#fffdf5;border-radius:26px;border:4px solid #fdcb6e;box-shadow:0 12px 40px rgba(0,0,0,.35);max-width:430px;width:100%;max-height:82vh;overflow-y:auto;padding:18px 16px;font-family:'Noto Naskh Arabic',Tahoma,Arial,sans-serif}" +
    "#shm-panel h2{margin:0 0 4px;text-align:center;color:#d35400;font-size:24px}" +
    "#shm-panel .shm-sub{text-align:center;color:#8a6d3b;font-size:13px;margin-bottom:12px}" +
    "#shm-panel a.shm-row{display:block;text-decoration:none;color:#fff;border-radius:16px;padding:10px 14px;margin:8px 0;font-weight:800;font-size:17px;line-height:1.5;box-shadow:0 3px 0 rgba(0,0,0,.18);border:2px solid #fff}" +
    "#shm-panel a.shm-row small{display:block;font-size:12.5px;font-weight:700;opacity:.95}" +
    "#shm-panel a.shm-sub-btn{display:block;text-align:center;background:#ff0000;color:#fff;text-decoration:none;border-radius:999px;padding:10px 14px;margin-top:14px;font-weight:800;font-size:16px;border:3px solid #fff;box-shadow:0 4px 0 #a00,0 6px 12px rgba(0,0,0,.25)}" +
    "#shm-panel a.shm-sub-btn small{display:block;font-size:12px;font-weight:700}" +
    "#shm-close{position:absolute;top:10px;left:12px;background:#ffeaa7;border:2px solid #e17055;color:#c0392b;border-radius:999px;width:34px;height:34px;font-size:17px;font-weight:900;cursor:pointer;line-height:1}";
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
  var btn = document.createElement("button");
  btn.id = "shm-launch";
  btn.setAttribute("aria-label", "Shamousa shorts");
  btn.innerHTML = "\u2600\ufe0f \u0634\u0627\u0647\u062f \u0634\u0645\u0648\u0633\u0629<small dir=\"ltr\">Shamousa Shorts \ud83c\udfac</small>";
  var overlay = document.createElement("div");
  overlay.id = "shm-overlay";
  overlay.style.display = "none";
  var rows = SHORTS.map(function (s, i) {
    return '<a class="shm-row" style="background:' + PALETTE[i % PALETTE.length] + '" href="https://youtube.com/shorts/' + s.id + '" target="_blank" rel="noopener">\ud83c\udfac ' + s.ar + '<small dir="ltr">' + s.en + "</small></a>";
  }).join("");
  overlay.innerHTML = '<div id="shm-panel" dir="rtl" style="position:relative"><button id="shm-close" aria-label="close">\u2715</button><h2>\u2600\ufe0f \u0634\u0645\u0648\u0633\u0629</h2><div class="shm-sub" dir="ltr">Shamousa Shorts</div>' + rows +
    '<a class="shm-sub-btn" href="' + CHANNEL + '" target="_blank" rel="noopener">\u0645\u0646 \u0641\u0636\u0644\u0643 \u0627\u0634\u062a\u0631\u0643 \u0641\u064a \u0642\u0646\u0627\u0629 \u0634\u0645\u0648\u0633\u0629 \ud83d\udd14<small dir="ltr">Subscribe to Shamousa</small></a></div>';
  btn.addEventListener("click", function () { overlay.style.display = "flex"; });
  overlay.addEventListener("click", function (e) { if (e.target === overlay || e.target.id === "shm-close") overlay.style.display = "none"; });
  document.body.appendChild(btn);
  document.body.appendChild(overlay);
})();
