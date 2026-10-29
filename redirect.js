(function () {
  try {
    var NEW = "https://happy-day-grade3.itqan-gate.workers.dev";
    if (location.host !== "happy-day-grade3.onrender.com") return; // only on the old origin
    if (window.top !== window.self) return; // never inside iframes (keeps carry-over iframe working)
    var data = {};
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        data[k] = localStorage.getItem(k); // read-only: never delete or alter old-site data
      }
    } catch (e) {}
    var hasData = Object.keys(data).length > 0;
    var target = NEW + location.pathname + location.search + location.hash; // keep deep links
    if (!hasData) { location.replace(target); return; } // nothing to carry: go straight away
    var done = false;
    function go() { if (done) return; done = true; location.replace(target); }
    var ifr = document.createElement("iframe");
    ifr.style.display = "none";
    ifr.setAttribute("aria-hidden", "true");
    ifr.src = NEW + "/migrate-receive.html#from=" + encodeURIComponent(location.origin);
    window.addEventListener("message", function (e) {
      try {
        if (e.origin !== NEW) return;
        if (!e.data || e.data.type !== "itqan-migrate-ack") return;
        go(); // receiver confirmed the write
      } catch (err) {}
    });
    ifr.addEventListener("load", function () {
      try {
        ifr.contentWindow.postMessage({ type: "itqan-migrate-push", data: data }, NEW);
        setTimeout(go, 2500); // receiver loaded and data sent: go even if the ACK is lost
      } catch (e) { go(); }
    });
    document.documentElement.appendChild(ifr);
    // no redirect if the receiver never loads (new origin unreachable): stay put, no data loss
  } catch (e) {}
})();
