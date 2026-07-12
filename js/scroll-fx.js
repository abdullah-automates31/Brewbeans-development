// Shared scroll effects: AOS init + top scroll-progress bar.
// Loaded on order-tracking.html and staff.html. index.html initializes AOS
// inside main.js and still uses this file for the progress bar.
(function () {
    if (typeof AOS !== 'undefined' && !window.__aosInitialized) {
        AOS.init({
            duration: 600,
            easing: 'ease-out-cubic',
            once: true,
            offset: 40
        });
        window.__aosInitialized = true;
    }

    const bar = document.getElementById('scrollProgress');
    if (!bar) return;

    const update = () => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        const ratio = max > 0 ? h.scrollTop / max : 0;
        bar.style.transform = 'scaleX(' + Math.max(0, Math.min(1, ratio)) + ')';
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
})();
