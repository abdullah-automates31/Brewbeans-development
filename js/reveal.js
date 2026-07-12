// Custom scroll-reveal system. No AOS. Guaranteed to work.
// Any element with class="reveal reveal-left|reveal-right|reveal-up|reveal-down|reveal-zoom"
// slides into place when it enters the viewport. Optional data-reveal-delay="0..500" (ms).
(function () {
    function activate(el) {
        var delay = parseInt(el.getAttribute('data-reveal-delay'), 10) || 0;
        if (delay > 0) {
            setTimeout(function () { el.classList.add('is-visible'); }, delay);
        } else {
            el.classList.add('is-visible');
        }
    }

    function init() {
        var targets = document.querySelectorAll('.reveal');
        if (!targets.length) return;

        // Fallback: browsers without IntersectionObserver → show everything
        if (!('IntersectionObserver' in window)) {
            targets.forEach(function (el) { el.classList.add('is-visible'); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    activate(entry.target);
                    // Re-enable replay by removing this line if you want once-only
                } else if (entry.boundingClientRect.top > 0) {
                    // Only reset when the element scrolls BELOW the viewport,
                    // not when it scrolls above — so upward scroll replays cleanly.
                    entry.target.classList.remove('is-visible');
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -80px 0px'
        });

        targets.forEach(function (el) { observer.observe(el); });

        // Safety net: force-show anything still hidden after 3 seconds
        setTimeout(function () {
            targets.forEach(function (el) {
                var r = el.getBoundingClientRect();
                if (r.top < window.innerHeight && r.bottom > 0 && !el.classList.contains('is-visible')) {
                    el.classList.add('is-visible');
                }
            });
        }, 3000);
    }

    window.__initReveal = init;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
