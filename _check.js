const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

    const errors = [];
    page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });

    await page.goto('https://brew-beans-one.vercel.app/?t=' + Date.now(), { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);

    // Dismiss location modal so we can see the actual page
    try { await page.click('#denyLocation', { timeout: 2000 }); } catch(e) {}
    await page.waitForTimeout(1000);

    // Check AOS is loaded and working
    const aosState = await page.evaluate(() => {
        const els = document.querySelectorAll('[data-aos]');
        const animated = document.querySelectorAll('[data-aos].aos-animate');
        return {
            hasAOS: typeof window.AOS,
            totalAOS: els.length,
            animatedNow: animated.length
        };
    });
    console.log('AOS STATE:', aosState);

    // Screenshot top
    await page.screenshot({ path: 'C:/tmp/live-top.png', fullPage: false });

    // Scroll to categories/about
    await page.evaluate(() => window.scrollTo(0, 900));
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'C:/tmp/live-categories.png', fullPage: false });

    // Scroll to menu
    await page.evaluate(() => window.scrollTo(0, 1800));
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'C:/tmp/live-menu.png', fullPage: false });

    // Scroll to gallery
    await page.evaluate(() => window.scrollTo(0, 3400));
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'C:/tmp/live-gallery.png', fullPage: false });

    // Final AOS state
    const finalState = await page.evaluate(() => {
        const animated = document.querySelectorAll('[data-aos].aos-animate');
        return { totalAnimatedNow: animated.length };
    });
    console.log('AFTER SCROLLING:', finalState);
    console.log('ERRORS:', errors);

    await browser.close();
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
