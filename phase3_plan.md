# Phase 3: Production E-Commerce Workflows Implementation Plan

This document outlines the step-by-step technical implementation plan for Phase 3 of the PickleCart project. This phase focuses on transitioning the platform's checkout from a mock flow into a robust, production-ready e-commerce engine with payments, shipping, and transactional emails.

## Step 1: Foundation & Dependencies Setup
- **API Keys & Environment:** Gather API keys for Razorpay, Resend, and Shiprocket. Add them securely to `.env.local`.
- **NPM Packages:** Install necessary SDKs:
  - `npm install razorpay` (Server-side Razorpay SDK)
  - `npm install resend` (Transactional emails)
  - `npm install axios` or use native `fetch` for Shiprocket API.

## Step 2: Checkout Verification & Order Creation (Pre-Payment)
- **Stock Validation:** Before creating an order, verify the stock availability of items in the cart against Firestore.
- **Server Action (`createOrder`):** Update checkout logic so that when the user submits their address, a secure Server Action validates the cart amounts, shipping costs, and applies any promo codes securely on the backend.
- **Pending Order:** Save the order to the Firestore `orders` collection with a status of `pending_payment`.

## Step 3: Razorpay Payment Integration
- **Order Generation:** In the `createOrder` Server Action, call the Razorpay API to generate a `razorpay_order_id`.
- **Client-Side Integration:** Load the Razorpay checkout script on the client (`<script src="https://checkout.razorpay.com/v1/checkout.js">`).
- **Payment Modal:** Trigger the Razorpay UI with the `razorpay_order_id`, customer details, and total amount.

## Step 4: Payment Verification & Security
- **Signature Verification:** Create a new API Route (`src/app/api/verify-payment/route.js`) to securely verify the `razorpay_signature` using the Razorpay API secret. 
- **Order Fulfillment:** Upon successful verification, update the order status in Firestore to `paid` and decrease the stock levels in the `products` collection.
- **Webhooks (Optional but Recommended):** Set up a Next.js Route Handler to listen to Razorpay webhooks (`payment.captured`, `payment.failed`) to ensure idempotent order updates even if the user closes their browser during payment.

## Step 5: Resend Email Integration
- **Email Templates:** Create React email templates (or HTML strings) for:
  - Order Confirmation (sent to customer)
  - New Order Alert (sent to admin)
  - Payment Failed Alert (sent to customer)
- **Trigger Emails:** After successful payment verification (Step 4), trigger the `resend.emails.send()` function to dispatch the confirmation emails asynchronously.

## Step 6: Shiprocket Logistics Integration
- **Authentication:** Create a utility to generate and cache Shiprocket API tokens (`src/lib/shiprocket.js`).
- **Order Synchronization:** Once an order is paid and marked `processing` by the admin, add an admin button to "Push to Shiprocket." This triggers a Server Action that formats the Firestore order into Shiprocket's required payload and pushes it to their system.
- **Tracking Links:** Retrieve the AWB (tracking number) from Shiprocket and update the Firestore order. Expose this tracking number to the user on the `src/app/track` page.

## Step 7: Admin Order Lifecycle Management
- **Dashboard Updates:** Enhance the `src/app/admin/orders` page.
- **Order Actions:** Add functionalities for the admin to:
  - View full order details (items, address, payment ID).
  - Update order statuses (e.g., `processing`, `shipped`, `delivered`, `cancelled`).
  - Initiate refunds (via Razorpay API if cancelled).

## Step 8: End-to-End Testing
- **Test Mode:** Ensure Razorpay is in "Test Mode" and use mock cards to simulate successful and failed payments.
- **Edge Cases:** Test scenarios like network drops after payment, cart manipulation attempts, out-of-stock purchases, and invalid promo codes.
- **UI Polish:** Ensure loading states during payment processing are clear to prevent double-clicks.
