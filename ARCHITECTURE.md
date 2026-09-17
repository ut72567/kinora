# KINORA Architecture

## Frontend

The application is built using React + Vite and organized around route-based pages for:
- public product pages
- authentication flows
- dashboard and identity management
- contact request actions
- PDF and identity download experiences

## Firebase

Firebase is used for:
- authentication
- Firestore document storage
- identity and contact data
- storage for optional identity images
- App Check readiness for future deployment

## Firestore schema

Suggested collections:
- `users/{uid}`
- `identities/{identityId}`
- `contactRequests/{requestId}`
- `privateIdentityData/{identityId}`

The public data model keeps identity metadata separate from sensitive owner-only records.

## Storage

Storage is reserved for uploaded identity images and should only permit authenticated, owner-scoped writes.

## Authentication

Authentication is handled through Firebase Email/Password and should include email verification and forgot-password flows.

## EmailJS

EmailJS is used exclusively for notification delivery. It is not treated as the database.

## QR and PDF

QR generation and identity PDF generation are isolated service concerns and should not be mixed into component logic.

## Routing

Routing follows the public, auth, and authenticated sections required by the product specification.
