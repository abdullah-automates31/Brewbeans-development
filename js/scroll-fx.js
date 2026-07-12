// Shared scroll effects: AOS init (guarded) + top scroll-progress bar.
// Loaded on every page. Idempotent — main.js also inits AOS on index.html.
(function () {
    if (typeof AOS !== 'undefined' && !window.__aosInitialized) {
        try {
            AOS.init({
                duration: 600,
                easing: 'ease-out-cubic',
                once: true,
                offset: 40
            });
            window.__aosInitialized = true;
        } catch (e) { /* ignore */ }
    }

    // Safety fallback: if AOS failed to load or never marked elements as
    // animated, force them visible after 1.2s so the page is never blank.
    setTimeout(function () {
        document.querySelectorAll('[data-aos]').forEach(function (el) {
            if (!el.classList.contains('aos-animate')) {
                el.style.opacity = '1';
                el.style.transform = 'none';
            }
        });
    }, 1200);

    // Scroll progress bar
    var bar = document.getElementById('scrollProgress');
    if (!bar) return;

    var update = function () {
        var h = document.documentElement;
        var max = h.scrollHeight - h.clientHeight;
        var ratio = max > 0 ? h.scrollTop / max : 0;
        bar.style.transform = 'scaleX(' + Math.max(0, Math.min(1, ratio)) + ')';
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
})();
