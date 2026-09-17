# KINORA

KINORA is a private digital identity platform for meaningful things and pets. The product focuses on identity, belonging, privacy, and trust.

## Product overview

KINORA helps people give valuable pets, devices, belongings, and personal items a private identity that can be shared when needed.

The experience is intentionally minimal and serious, with KINORA as the primary product identity and XNEON Technologies as the parent technology brand.

## Features

- Public identity search by exact KINORA ID
- Identity profile pages
- Dashboard for personal identities
- Identity creation flow
- Lost and found status controls
- Contact request system with owner-only access
- Email verification and auth foundation
- PDF and QR-ready identity design
- Privacy-first architecture

## Tech stack

- React
- Vite
- React Router
- Firebase Auth / Firestore / Storage
- EmailJS
- QR code generation
- PDF generation

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Configuration

Copy `.env.example` to `.env` and fill in the required Firebase and EmailJS values.

## Notes

This project is a production foundation that aligns with the KINORA specification and prepares the app for production Firebase integration and deployment.
