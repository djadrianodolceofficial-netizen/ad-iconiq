# AD ICONIQ – Final Working Web App (PWA)

This is a **static, mobile-first shopping app** (multi-page HTML + JS) with:
- Catalog browsing + filters
- Product modal + variant selection
- Cart + promo codes
- Checkout flow that **creates saved orders**
- Account page that **shows real orders**
- Wishlist (♥) saved in localStorage
- PWA support (manifest + service worker + offline page)

## Run locally (fastest)
Open `index.html` in a browser.

> If you want PWA install + service worker to work correctly, run via a local server:

### Option A: Python
```bash
python3 -m http.server 5173
```
Open: http://localhost:5173

### Option B: Node
```bash
npx serve .
```

## Publish (you do the clicky part)
I can’t publish to your accounts directly from here (no keys, no access, no magic).
But you can publish this in **3 minutes**:

### Netlify (drag & drop)
1. Create a Netlify account
2. Go to Sites → **Add new site** → **Deploy manually**
3. Drag this folder (or the zip contents) into Netlify
4. Done. You get a live URL.

### Vercel
1. Create a Vercel account
2. New Project → Import → Upload
3. Framework: “Other”
4. Output: static
5. Deploy.

### GitHub Pages
1. Create a repo, upload these files
2. Repo Settings → Pages
3. Deploy from `main` branch, `/root`
4. Your site goes live.

## Data storage (demo)
This build uses localStorage keys:
- `adiconiq-cart`
- `adiconiq-wishlist`
- `adiconiq-orders`

So it behaves like an app on a single device/browser.

## Next step if you want a REAL app
If you want:
- real payments (Stripe),
- real orders across devices,
- login/accounts,
- inventory, admin, shipping,
you’ll need a backend (or Shopify storefront API).
