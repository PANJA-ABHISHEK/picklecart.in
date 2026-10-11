# Phase 2: Firebase and Administration Implementation Plan

This document outlines the step-by-step technical implementation plan for Phase 2 of the PickleCart project, transitioning the platform from a static mockup to a dynamic, database-driven application with full administrative control.

## Step 1: Firebase Project Setup & Foundation
- **Environment:** Fetch Firebase SDK configuration and save it securely to `.env.local`.
- **Initialization:** Create `src/lib/firebase/config.js` (for client) and `src/lib/firebase/admin.js` (for server).
- **Security:** Write and deploy initial Firestore Security Rules (e.g., public read access for products, but strict admin-only write access).

## Step 2: Authentication & Admin Authorization
- **Auth Setup:** Enable Firebase Authentication (Email/Password or Google).
- **Admin Verification:** Create an `admins` collection in Firestore to authorize specific user IDs.
- **Middleware:** Implement Next.js Middleware to protect all routes under `/admin/*` so only verified administrators can access them.
- **Login Page:** Build the `/admin/login` interface.

## Step 3: Admin Dashboard Shell
- **Layout:** Build the dedicated `/admin/layout.js` containing a responsive sidebar navigation (Dashboard, Products, Orders, Enquiries, Settings).
- **Overview:** Create a basic `/admin` landing page showing quick stats (Total Products, New Enquiries).

## Step 4: Cloudinary Integration
- **Credentials:** Add Cloudinary API keys to `.env.local`.
- **Server Actions:** Create secure Next.js Server Actions to generate signed upload signatures.
- **UI Component:** Build an `<ImageUploader />` component for the admin panel that uploads directly to Cloudinary and returns the optimized secure URLs.

## Step 5: Product Management (CRUD)
- **Data Model:** Define the exact Firestore schema for the `products` collection (ID, name, slug, prices, variants, weights, image URLs, categories, regions).
- **Add/Edit Form:** Build a comprehensive form in `/admin/products/new` to create products, handle variant pricing, and upload images.
- **Product Table:** Build the `/admin/products` view to list, search, edit, and safely delete products.

## Step 6: Categories & Regions Management
- **Data Models:** Define schemas for `categories` and `regions`.
- **Admin Interface:** Build simple CRUD interfaces allowing the store owner to add or modify product categories and regional banners dynamically without touching code.

## Step 7: Enquiries Module
- **Frontend Hookup:** Update the public "Contact Us" and "Corporate Bulk Orders" forms from Phase 1 to write their data directly to Firestore collections (`contactQueries` and `bulkEnquiries`).
- **Admin Visibility:** Build the `/admin/enquiries` page so the owner can read and respond to incoming customer messages.

## Step 8: Frontend Data Migration
- **Service Refactor:** Rewrite the mock functions in `src/services/products.js` to fetch live data from Firestore instead of the hardcoded `constants`.
- **UI Testing:** Verify that the Homepage, Regional Pages, and Product Detail pages render perfectly using the live database instead of mock data.
