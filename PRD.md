# PICKLECART — PRODUCT REQUIREMENTS DOCUMENT (PRD)

**Project:** PickleCart E-Commerce Platform  
**Domain:** `picklecart.in`  
**Brand tagline:** Fill Your Cart with Tradition  
**Document type:** Complete Product Requirements Document  
**Target platform:** Responsive web application  
**Implementation tool:** Google Antigravity  
**Product category:** Direct-to-consumer Indian food and traditional products  
**Primary market:** India  
**Development methodology:** Incremental implementation with phase-wise validation

---

# 1. PRODUCT VISION

## 1.1 Vision Statement

Build PickleCart into a premium, trustworthy, production-ready Indian food e-commerce platform that brings authentic regional pickles, podis, powders, snacks, oils, groceries, millets, and other traditional food products to modern households.

The website must combine the cultural richness of traditional Indian food with the visual quality, usability, reliability, and shopping experience of a premium direct-to-consumer brand.

The final product must look and behave like a genuine commercial business website, not a college project, generic template, basic storefront, or AI-generated landing page.

## 1.2 Business Objectives

1. Establish a distinctive digital identity for PickleCart.
2. Showcase authentic regional Indian food products.
3. Help customers discover products by category, region, and preference.
4. Provide a smooth product discovery and purchasing experience.
5. Increase product engagement and conversion potential.
6. Support corporate gifting, wholesale, bulk orders, and custom enquiries.
7. Enable the business owner to manage products, stock, orders, customers, and enquiries.
8. Integrate secure online payments, transactional emails, and shipping services.
9. Establish a scalable architecture that can be deployed on the domain `picklecart.in`.
10. Build a maintainable platform that can evolve without unnecessary rewrites.

## 1.3 Success Criteria

The product will be considered successful when:

- Customers can navigate the website easily on mobile and desktop.
- The homepage immediately communicates the brand and its products.
- Exactly five distinct hero slides work correctly across supported screen sizes.
- Product data, variants, pricing, categories, and regions are managed centrally.
- Search, filtering, sorting, product details, and cart operations work correctly.
- The complete checkout workflow is reliable.
- Admin operations are securely authorized.
- Payment and order states are verified on the server.
- Emails and shipment updates are handled correctly.
- All required routes, integrations, and responsive layouts pass testing.
- No critical security, accessibility, or functional defects remain before launch.

# 2. USERS AND PERSONAS

## 2.1 Retail Customer

Wants to discover authentic Indian food products, compare variants and prices, add products to the cart, and complete a purchase conveniently.

## 2.2 Regional Food Enthusiast

Wants to explore products from Andhra Pradesh, Telangana, Karnataka, Tamil Nadu, and North India.

## 2.3 Returning Customer

Wants a familiar shopping experience, persistent cart contents, clear order confirmation, and shipment updates.

## 2.4 Corporate or Bulk Buyer

Wants to enquire about bulk quantities, wholesale requirements, corporate gifts, weddings, events, return gifts, or customized orders.

## 2.5 Store Administrator

Needs secure access to manage products, categories, regions, inventory, orders, customers, shipments, and enquiries without editing application code for routine operations.

# 3. SCOPE AND DEVELOPMENT PHASES

The project must be developed in exactly four major phases.

## Phase 1 — Complete Frontend and User Experience (COMPLETED)

Implemented:
- Design system and reusable UI components.
- Homepage and five-slide hero.
- Navigation and responsive mobile drawer.
- All public informational and regional pages.
- Mock product catalog and centralized product services.
- Product details, search, filters, and sorting.
- Local persistent cart.
- Checkout interface with mock payment flow.
- Contact and corporate enquiry forms.
- Responsive behavior, animations, accessibility, SEO foundations, and QA.

## Phase 2 — Firebase and Administration (UP NEXT)

To Implement:
- Firebase Authentication.
- Firestore data persistence.
- Firebase Security Rules.
- Customer and administrator authorization.
- Product, category, and region management.
- Inventory management.
- Customer, order, and enquiry management.
- Cloudinary product image management.
- Admin dashboard and protected routes.

## Phase 3 — Production E-Commerce Workflows

To Implement:
- Razorpay payment integration.
- Server-side payment verification.
- Webhooks and idempotent order processing.
- Resend transactional emails.
- Shiprocket shipment creation and tracking.
- Order lifecycle management.
- Stock validation and reservation strategy.
- Payment failures, cancellations, retries, and recovery.
- End-to-end order testing.

## Phase 4 — Production Launch

To Implement:
- Vercel deployment.
- Custom domain configuration for `picklecart.in`.
- HTTPS and production environment variables.
- Final security review.
- SEO, sitemap, robots.txt, and structured data.
- Google Search Console preparation.
- Performance and accessibility audits.
- Cross-device testing and production smoke tests.

# 4. MANDATORY TECHNOLOGY STACK

## Frontend
- React.js.
- Next.js App Router.
- JavaScript only (No TypeScript).
- Tailwind CSS.
- Next.js Server Components by default.
- Client Components only when interactivity requires them.
- Swiper.js for the required hero carousel.
- GSAP and AOS for restrained, purposeful animation.
- Lucide React for icons.

## Backend
- Next.js Route Handlers.
- Server Actions where appropriate.
- Server-side business logic and validation.
- A service layer that isolates data access from the UI.

## Data and integrations
- Firebase Authentication.
- Firebase Firestore.
- Cloudinary for image storage and delivery.
- Razorpay for payments.
- Resend for transactional email.
- Shiprocket for shipping and tracking.
- Vercel for deployment.

# 5. BRAND IDENTITY AND DESIGN SYSTEM
*(Refer to Phase 1 UI/UX Implementation)*

# 6. INFORMATION ARCHITECTURE AND ROUTES
*(Refer to Phase 1 UI/UX Implementation)*

# 7. HOMEPAGE REQUIREMENTS
*(Refer to Phase 1 UI/UX Implementation)*

# 8. PRODUCT CATALOG AND DISCOVERY
*(Refer to Phase 1 UI/UX Implementation)*

# 9. PRODUCT DETAIL PAGE
*(Refer to Phase 1 UI/UX Implementation)*

# 10. CART AND CHECKOUT
*(Refer to Phase 1 UI/UX Implementation)*

# 11. CORPORATE, BULK, ABOUT, AND CONTACT PAGES
*(Refer to Phase 1 UI/UX Implementation)*

# 12. PHASE 2 — FIREBASE AND ADMIN DASHBOARD (Detailed Specs)
## 12.1 Firebase services
Implement Firebase Authentication, Firestore, and appropriate Firebase Security Rules.
Suggested collections: `products`, `categories`, `regions`, `orders`, `customers`, `bulkEnquiries`, `contactQueries`, `admins`, `shipments`

## 12.2 Authentication and authorization
Create a protected admin login at `/admin/login` and an admin dashboard at `/admin`.
Authorization must be enforced on the server and through Firestore security rules.

## 12.3 Admin modules
Provide: Dashboard, Products, Categories, Regions, Orders, Customers, Bulk Enquiries, Contact Queries, Inventory, Shipments, Settings.

## 12.4 Product management
Administrators must be able to: Create, Edit, Delete products safely. Manage descriptions, slugs, images, prices, variants, weights, stock, categories, regions, tags, featured status, and best-seller status.

## 12.5 Cloudinary
Use Cloudinary for image uploads and delivery. Store image URLs and required public identifiers in Firestore.

# 13. PHASE 3 — PAYMENTS, EMAIL, SHIPPING, AND ORDERS (Detailed Specs)
*(Refer to PRD Documentation for Razorpay, Resend, Shiprocket rules)*

# 14. PHASE 4 — DEPLOYMENT AND PRODUCTION READINESS (Detailed Specs)
*(Refer to PRD Documentation for Vercel, Domains, SEO, Security Audits)*
