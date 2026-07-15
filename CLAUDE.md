# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Brew Beans is a static coffee shop website with a Supabase backend. There is no build step — open `index.html` directly in a browser or use a local server (`npx serve .` or VS Code Live Server). For accurate CSP behavior during development, use an HTTP server rather than `file://`. Deployment target is **Vercel** (security headers are configured in `vercel.json` at the repo root). The `_headers` file is a legacy Netlify artifact — keep `vercel.json` in sync with it if either changes.

## Architecture

Three pages, each with a corresponding JS file:

| Page | JS | Purpose |
|---|---|---|
| `index.html` | `js/main.js` | Customer-facing: menu, cart, ordering, geolocation |
| `order-tracking.html` | `js/order-tracking.js` | Real-time order status with polling and browser notifications |
| `staff.html` | `js/staff.js` | PIN-protected staff dashboard for order management |

**Shared across all pages**: `js/supabase-config.js` (initializes global `supabaseClient`) and `js/scroll-fx.js` (AOS init + scroll progress bar).

**Script load order within each page** (order matters — no bundler):
Bootstrap JS → jQuery 3.7.1 → AOS → Supabase JS client → `supabase-config.js` → page-specific JS → `scroll-fx.js`

**Ignore the nested `Brew-Beans/` subdirectory** — it is an outdated backup copy of the project. Always edit files at the repo root.

## Key Patterns

**Menu data** lives in `js/main.js` as a hardcoded `menuItems` array (16 products with id, name, category, description, price, image). Changes to the menu require editing this array.

**Cart state** is persisted in `localStorage` (`brewBeansCart` key) with sanitization on read. The cart object stores items keyed by product id.

**All database access goes through Supabase RPC functions** — no direct table queries from the browser:
- `get_order_status(p_order_number, p_phone)` — customer-facing order lookup
- `staff_list_orders(p_pin)` — returns orders for the staff dashboard
- `staff_update_order_status(p_pin, p_order_number, p_new_status)` — staff status update

**Polling intervals**: staff dashboard polls every 15 s; order tracking polls every 10 s. Neither uses Supabase Realtime subscriptions.

**Delivery charge** is calculated client-side using the Haversine formula against hardcoded shop coordinates (`24.9180°N, 67.0971°E`). ETA is estimated as 15 min prep + 25 min delivery (or 8 min for pickup when delivery charge = 0). Geolocation permission is requested via a modal shown 3 s after page load.

**Staff authentication** is PIN-based, verified server-side via RPC, and the PIN is cached in `sessionStorage`. The page is served with `X-Robots-Tag: noindex, nofollow`.

**Phone number privacy**: the customer's phone is stored in `sessionStorage` under the key `bb_phone_${orderNumber}` so it never appears in the browser history URL when returning from a payment gateway redirect.

## CSS

All styles are in `css/style.css`. Design tokens are CSS custom properties defined at `:root` (e.g., `--primary`, `--secondary`, `--text-*`). Bootstrap 5.3.2 handles the responsive grid; custom CSS overrides and extends it.

## Security Headers

`vercel.json` at the repo root configures response headers including a strict CSP that whitelists specific CDN origins and inline script hashes. **When adding new external scripts or inline `<script>` blocks**, update the CSP in `vercel.json` accordingly — otherwise they will be blocked in production. All user-generated content rendered into the DOM uses `escapeHtml()` or `innerText` assignment to prevent XSS.

## External Dependencies (CDN)

All loaded via CDN, no local `node_modules`:
- Bootstrap 5.3.2 + Bootstrap Icons 1.11.1
- jQuery 3.7.1
- AOS 2.3.4 (Animate On Scroll)
- Google Fonts: Poppins, Playfair Display
- Supabase JS client v2

## Payment Gateways

JazzCash and EasyPaisa are integrated via form redirects to their payment pages. Both domains are whitelisted in the CSP `form-action` directive in `vercel.json`. The return URL lands on `order-tracking.html` with a `?payment=success|failed` query param.
