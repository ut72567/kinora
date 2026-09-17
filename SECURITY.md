# KINORA Security

## Public vs private data

KINORA separates public identity information from private owner-only data.

Public data may include:
- name
- generic name
- relationship
- category
- breed or model
- KINORA ID
- lost status
- optional public photo

Private data includes:
- owner email
- phone number if collected
- private notes
- preferences
- authentication information

## Authentication

Use Firebase Authentication with Email/Password only. Do not implement phone OTP or SMS-based authentication.

Require email verification before a user can create a KINORA identity.

## Firestore rules

Firestore rules should enforce:
- authentication for protected reads/writes
- ownership checks for identity data
- public/private separation
- immutable KINORA ID and created metadata
- strict contact request access

## Storage rules

Storage rules should enforce:
- authenticated upload only
- ownership-restricted writes
- image-only file types
- file size limits
- no arbitrary user uploads

## Contact request handling

Visitors may create contact requests, but they cannot read or modify existing ones. Only the owner of a given identity should access its related requests.

## Threat considerations

- prevent direct owner-email exposure in public pages
- restrict file uploads to images and size-limited files
- validate all contact form inputs before sending notifications
- avoid putting private secrets in frontend source
- use Firebase security rules as the primary access control layer
