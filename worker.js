export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (/\.(mp3|wav|ogg|png|jpe?g|webp|gif|svg|woff2?|ttf|json)$/i.test(url.pathname)) {
      const ref = request.headers.get('Referer');
      if (ref) {
        try {
          const rh = new URL(ref).hostname.toLowerCase();
          const h = url.hostname.toLowerCase();
          const ok = rh === h || rh.endsWith('.itqan-gate.workers.dev') || rh === 'itqan-gate.pages.dev'
            || rh.endsWith('.itqan-gate.pages.dev') || rh.endsWith('.onrender.com');
          if (!ok) return new Response('Forbidden', { status: 403 });
        } catch (e) {}
      }
    }
    const res = await env.ASSETS.fetch(request);
    const h = new Headers(res.headers);
    h.set('X-Content-Type-Options', 'nosniff');
    h.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    h.set('X-Frame-Options', 'SAMEORIGIN');
    h.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
  }
};
