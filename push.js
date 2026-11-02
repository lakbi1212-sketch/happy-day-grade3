/* شموسة - طلب السماح بالإشعارات (يظهر مرة واحدة بلطف) */
(function () {
  var API = "https://shamousa-push.itqan-gate.workers.dev";
  var KEY = "BF06E4JWnlqwMxO00hKvHUz8klFmJNSfyBZ5WK5-fBmxpdagLruJK5wyxGVkFl2lkk21GSaClaMGmWo5kXScpVs";
  var SITE = location.hostname.split(".")[0];
  var LS = "shm-push-state";
  var ua = navigator.userAgent || "";
  var isIOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var standalone = window.navigator.standalone === true || (window.matchMedia && matchMedia("(display-mode: standalone)").matches);
  var supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  function b64(s) { s = s.replace(/-/g, "+").replace(/_/g, "/"); var r = atob(s + "===".slice((s.length + 3) % 4)); var o = new Uint8Array(r.length); for (var i = 0; i < r.length; i++) o[i] = r.charCodeAt(i); return o; }
  function save(sub) {
    return fetch(API + "/subscribe", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ endpoint: sub.endpoint, site: SITE }) }).catch(function () {});
  }
  function subscribe() {
    return navigator.serviceWorker.register("/sw.js").then(function () { return navigator.serviceWorker.ready; }).then(function (reg) {
      return reg.pushManager.getSubscription().then(function (s) { return s || reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64(KEY) }); });
    }).then(save);
  }
  // Already allowed before: just keep the subscription fresh.
  if (supported && Notification.permission === "granted") { subscribe().catch(function () {}); return; }
  if (Notification.permission === "denied") return;
  var st = {}; try { st = JSON.parse(localStorage.getItem(LS) || "{}"); } catch (_) {}
  if (st.later && Date.now() - st.later < 3 * 864e5) return;
  if (!supported && !isIOS) return;
  if (document.getElementById("shm-push")) return;
  var needsInstall = isIOS && !standalone;
  var css = "#shm-push{position:fixed;top:12px;left:50%;transform:translateX(-50%);z-index:99;width:calc(100% - 24px);max-width:420px;background:#fffdf5;border:4px solid #fdcb6e;border-radius:24px;box-shadow:0 10px 30px rgba(0,0,0,.35);padding:14px 16px;font-family:'Noto Naskh Arabic',Tahoma,Arial,sans-serif;direction:rtl;text-align:center;animation:shmp .5s ease}" +
    "@keyframes shmp{from{transform:translate(-50%,-30px);opacity:0}to{transform:translate(-50%,0);opacity:1}}" +
    "#shm-push h3{margin:0 0 4px;color:#d35400;font-size:21px;line-height:1.5}#shm-push p{margin:0 0 10px;color:#6d4c1d;font-size:16px;line-height:1.7}" +
    "#shm-push button{font:800 17px 'Noto Naskh Arabic',Tahoma,Arial,sans-serif;border:0;border-radius:999px;padding:9px 20px;margin:3px;cursor:pointer;color:#fff}" +
    "#shm-push .y{background:linear-gradient(135deg,#00b894,#0984e3);box-shadow:0 4px 0 #067a6a}#shm-push .n{background:#b2bec3;box-shadow:0 4px 0 #8395a0}";
  var s = document.createElement("style"); s.textContent = css; document.head.appendChild(s);
  var box = document.createElement("div"); box.id = "shm-push";
  if (needsInstall) {
    box.innerHTML = "<h3>☀️ شموسة تقول لك: أهلاً!</h3><p>عشان يوصلك إشعار بكل جديد على الآيفون: اضغط زر المشاركة في سفاري، ثم «إضافة إلى الشاشة الرئيسية»، وافتح الموقع من الأيقونة.</p><button class='n'>تمام</button>";
    box.querySelector("button").onclick = function () { localStorage.setItem(LS, JSON.stringify({ later: Date.now() })); box.remove(); };
  } else {
    box.innerHTML = "<h3>☀️ شموسة تقول لك: أهلاً!</h3><p>تحب نرسل لك إشعاراً لطيفاً كل ما نضيف درساً أو لعبة جديدة؟ 🔔</p><button class='y'>نعم، أرسلوا لي</button><button class='n'>ليس الآن</button>";
    box.querySelector(".y").onclick = function () {
      box.remove();
      Notification.requestPermission().then(function (p) { if (p === "granted") subscribe().catch(function () {}); });
    };
    box.querySelector(".n").onclick = function () { localStorage.setItem(LS, JSON.stringify({ later: Date.now() })); box.remove(); };
  }
  setTimeout(function () { document.body.appendChild(box); }, 7000);
})();
