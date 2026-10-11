# Phase 4: Production Launch & Hardening Plan

This document outlines the step-by-step technical implementation and deployment plan for **Phase 4** of the PickleCart project (`picklecart.in`). This final phase focuses on production deployment, domain verification, security lockdown, SEO readiness, and live performance optimization.

---

## Step 1: Domain Verification & Transactional Email Deliverability
- **Resend Custom Domain:** Add `picklecart.in` to the Resend dashboard.
- **DNS Records:** Configure the required DNS records at the domain registrar (Hostinger/GoDaddy/Cloudflare):
  - DKIM (TXT)
  - SPF / Mail from (MX & TXT)
- **Sender Address Update:** Update `src/lib/email.js` to send transactional emails from `orders@picklecart.in` (or `support@picklecart.in`) instead of `onboarding@resend.dev`.
- **Validation:** Send a test order confirmation to an external Gmail/Yahoo account to confirm inbox delivery (not spam).

---

## Step 2: Firebase Security Rules Lockdown
- **Firestore Security Rules:** Review `firestore.rules` to ensure strict role-based access:
  - `products`, `locations`, `storeSettings`: Public `read`, Admin-only `write`.
  - `orders`: Public/customer `create` (with valid schema), Admin-only `update` & `delete`.
  - `admin_users`: Only authenticated admins can read/write.
- **Deploy Rules:** Deploy rules to Firebase Console.

---

## Step 3: SEO, Sitemap, Robots & Structured Data
- **Dynamic Sitemap:** Create `src/app/sitemap.js` to automatically index all product categories, regional pages, and informational pages under `https://picklecart.in`.
- **Robots.txt:** Create `src/app/robots.js` allowing search engine crawlers to index public pages while disallowing `/admin/*`.
- **Structured Data (JSON-LD):** Add Schema.org structured data:
  - `Organization` / `LocalBusiness` for PickleCart.
  - `Product` schema with pricing and availability for product pages.
- **OpenGraph & Twitter Cards:** Verify social preview images and titles on all main routes.

---

## Step 4: Production Build & Asset Optimization
- **Image Optimization:** Resolve Next.js `<Image>` missing `sizes` warnings to maximize PageSpeed scores on mobile devices.
- **Local Production Build:** Run `npm run build` locally to verify 100% clean compilation without warnings or route errors.
- **Console Hygiene:** Ensure debug `console.log` statements with sensitive tokens are stripped or quieted in production mode.

---

## Step 5: Vercel Deployment & Environment Configuration
- **Git Push:** Ensure all files are cleanly committed to the GitHub repository.
- **Vercel Project Setup:** Import the repository into Vercel.
- **Environment Variables:** Configure all production variables in Vercel Project Settings:
  - `NEXT_PUBLIC_BASE_URL=https://picklecart.in`
  - Firebase Admin SDK credentials (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`)
  - Razorpay credentials (`NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`)
  - Shiprocket credentials (`SHIPROCKET_EMAIL`, `SHIPROCKET_PASSWORD`, `SHIPROCKET_PICKUP_LOCATION`)
  - Resend API key (`RESEND_API_KEY`)
- **Domain Mapping:** Point DNS A-record & CNAME for `picklecart.in` and `www.picklecart.in` to Vercel with automated SSL (HTTPS).

---

## Step 6: Production Smoke Testing & Handover
- **Live Smoke Test:** Test complete user journey on the live production URL:
  - Browse regional collections
  - Add to cart
  - Checkout & payment flow
  - Admin panel order reception & push to Shiprocket
  - Customer order tracking at `picklecart.in/track`
- **Razorpay Live Mode Switch:** When client is ready to accept real money, swap Razorpay Key ID & Secret to Live credentials.
