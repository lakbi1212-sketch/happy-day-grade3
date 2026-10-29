(function () {
  try {
    var OLD = "https://happy-day-grade3.onrender.com";
    var host = location.host;
    if (host === OLD.replace(/^https:\/\//, "")) return; // old origin: never import, never alter
    if (!/(^|\.)itqan-gate\.workers\.dev$/.test(host)) return; // only run on the new origin
    if (window.__itqanMigrateStarted) return;
    window.__itqanMigrateStarted = true;
    if (localStorage.getItem("__itqan_migrated")) return; // already carried over
    if (localStorage.length > 0) return; // student already has data here: never touch
    var tries = +(sessionStorage.getItem("__itqan_mig_try") || 0);
    if (tries >= 3) return; // offline-safe: limited silent retries per session
    sessionStorage.setItem("__itqan_mig_try", tries + 1);
    var ifr = document.createElement("iframe");
    ifr.style.display = "none";
    ifr.setAttribute("aria-hidden", "true");
    ifr.src = OLD + "/migrate.html#to=" + encodeURIComponent(location.origin);
    var timer = setTimeout(cleanup, 45000); // Render free tier cold-starts slowly
    function cleanup() {
      try { window.removeEventListener("message", onMsg); clearTimeout(timer); ifr.remove(); } catch (e) {}
    }
    function onMsg(e) {
      try {
        if (e.origin !== OLD) return;
        if (!e.data || e.data.type !== "itqan-migrate-v1" || !e.data.data) return;
        var d = e.data.data;
        for (var k in d) {
          if (!Object.prototype.hasOwnProperty.call(d, k)) continue;
          if (localStorage.getItem(k) === null) localStorage.setItem(k, d[k]); // merge: never overwrite
        }
        localStorage.setItem("__itqan_migrated", "1");
        cleanup();
      } catch (err) {}
    }
    window.addEventListener("message", onMsg);
    (document.body || document.documentElement).appendChild(ifr);
  } catch (e) {}
})();
