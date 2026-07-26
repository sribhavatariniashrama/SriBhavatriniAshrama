# PRD — Sri Bhavatarini Ashrama Website

## Problem Statement
Modern, responsive, elegant website for the spiritual trust "Sri Bhavatarini Ashrama". Single-scroll home with tabs: About Us, Our Activities, Events, Gallery, Contact Us, Donate Now. Warm Indian spiritual palette (saffron, deep maroon, cream). Award-worthy motion/craft.

## Architecture
- Backend: FastAPI + MongoDB (motor). All routes under /api.
- Frontend: React 19, Tailwind, framer-motion (kinetic hero, scroll reveals, parallax), lenis (smooth scroll), react-fast-marquee, shadcn/ui.
- Auth: custom JWT admin (bcrypt), seeded from ADMIN_EMAIL/ADMIN_PASSWORD; token via httpOnly cookie + Bearer fallback (localStorage).
- Storage: Emergent object storage for gallery images.

## User Personas
- Visitor/devotee: reads about the ashram, sees events, gallery, donates, contacts.
- Admin: manages events + gallery images, views messages + donations.

## Core Requirements (static)
Home sections, admin CMS for events & gallery, contact email + DB store, Razorpay donations.

## Implemented (2026-07-26)
- Full home page: kinetic hero + parallax, editorial marquee, numbered About manifesto, bento Activities, Events (from API), masonry Gallery + lightbox, Donate (Razorpay), Contact (form + map).
- Admin: /admin/login + dashboard (Events CRUD, Gallery upload/delete, Messages, Donations).
- Backend endpoints: auth (login/logout/me), events CRUD, gallery upload/serve/delete, contact, donations order/verify/list, donate config.
- Seeded 3 sample events. Tested end-to-end (100% pass).

## Integration Status
- Razorpay: code complete; keys EMPTY (user skipped) → /api/donate/order returns 503 gracefully until keys added.
- Resend email: code complete; key EMPTY → contact messages stored in DB, email_sent=false until key added.
- Emergent object storage: active (uses EMERGENT_LLM_KEY).

## Backlog / Next Tasks
- P0: Add Razorpay keys (RAZORPAY_KEY_ID/SECRET) to enable live donations; add Resend key + verified domain for contact emails.
- P1: Server-side image size/type validation; contact-form rate limiting/captcha.
- P2: shadcn DatePicker in admin event form; donation receipts/80G; multi-admin roles.
