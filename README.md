# Neela Jewellery — Full Stack E-Commerce

Premium jewelry e-commerce platform.
**Stack:** React 19 + Vite + Tailwind (frontend) · Django + DRF (backend) · PostgreSQL · JWT · Razorpay · Cloudinary.

## Status: Module 1 — Project Setup & Architecture ✅

This commit sets up the skeleton for both apps. No business logic yet —
that begins in Module 2 (Database Models).

## Structure

```
neela-jewellery/
├── backend/
│   ├── config/          # settings, root urls, wsgi/asgi
│   ├── users/            products/       categories/
│   ├── cart/              wishlist/       orders/
│   ├── payments/          reviews/        coupons/
│   ├── notifications/
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── assets/{images,fonts}
    │   ├── components/{common,layout,home,shop,product,cart,wishlist,checkout,profile,admin}
    │   ├── pages/  services/  context/  hooks/  routes/  styles/  utils/
    │   ├── App.jsx  main.jsx
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── .env.example
```

## Local setup

See `backend/README` commands and `frontend` commands in Module 1 chat notes.
