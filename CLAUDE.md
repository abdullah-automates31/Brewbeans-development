# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Brew Beans is a static coffee shop website with a Supabase backend. There is no build step — open `index.html` directly in a browser or use a local server (e.g., `npx serve .` or VS Code Live Server). Deployment target is **Netlify** (security headers are configured in `_headers`).

## Architecture

Three pages, each with a corresponding JS file:

| Page | JS | Purpose |
|---|---|---|
| `index.html` | `js/main.js` | Customer-facing: menu, cart, ordering, geolocation |
| `order-tracking.html` | `js/order-tracking.js` | Real-time order status with polling and browser notifications |
| `staff.html` | `js/staff.js` | PIN-protected staff dashboard for order management |

**Shared**: `js/supabase-config.js` initializes the Supabase client (URL + anon key) and is loaded by all pages.

## Key Patterns

**Menu data** lives in `js/main.js` as a hardcoded `menuItems` array (16 products with id, name, category, description, price, image). Changes to the menu require editing this array.

**Cart state** is persisted in `localStorage` with sanitization on read. The cart object stores items keyed by product id.

**Order persistence** goes through Supabase. Order tracking uses an RPC function `get_order_status`. Staff orders use direct Supabase table queries with real-time polling (not Supabase Realtime subscriptions).

**Delivery charge** is calculated client-side using the Haversine formula against hardcoded shop coordinates (`24.9180°N, 67.0971°E`). Geolocation permission is requested via a modal on page load.

**Staff authentication** is PIN-based, stored in `sessionStorage`. The page is noindex/nofollow.

## CSS

All styles are in `css/style.css`. Design tokens are CSS custom properties defined at `:root` (e.g., `--primary`, `--secondary`, `--text-*`). Bootstrap 5.3.2 handles the responsive grid; custom CSS overrides and extends it.

## Security Headers

`_headers` configures Netlify's response headers including a strict CSP that whitelists specific CDN origins and inline script hashes. **When adding new external scripts or inline `<script>` blocks**, update the CSP in `_headers` accordingly — otherwise they will be blocked in production.

## External Dependencies (CDN)

All loaded via CDN, no local `node_modules`:
- Bootstrap 5.3.2 + Bootstrap Icons 1.11.1
- jQuery (implied by usage patterns in main.js)
- AOS (Animate On Scroll)
- Google Fonts: Poppins, Playfair Display
- Supabase JS client

## Payment Gateways

JazzCash and EasyPaisa are integrated. Their domains are explicitly whitelisted in the CSP `form-action` directive in `_headers`.
