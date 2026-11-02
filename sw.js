/* شموسة - service worker للإشعارات */
var API = "https://shamousa-push.itqan-gate.workers.dev";
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener("push", function (e) {
  e.waitUntil((async function () {
    var d = { title: "شموسة ☀️", body: "في شيء جديد بانتظارك! افتح الموقع وشوف.", url: "/" };
    try {
      var r = await fetch(API + "/latest?site=" + encodeURIComponent(self.location.hostname.split(".")[0]), { cache: "no-store" });
      if (r.ok) d = Object.assign(d, await r.json());
    } catch (_) {}
    await self.registration.showNotification(d.title, {
      body: d.body, icon: "/push-icon.png", badge: "/push-icon.png", dir: "rtl", lang: "ar",
      data: { url: d.url || "/" }
    });
  })());
});
self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  var u = new URL((e.notification.data && e.notification.data.url) || "/", self.location.origin).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (cs) {
    for (var i = 0; i < cs.length; i++) { if ("focus" in cs[i]) { cs[i].navigate && cs[i].navigate(u); return cs[i].focus(); } }
    return self.clients.openWindow(u);
  }));
});
