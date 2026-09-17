# KINORA Setup Guide

This document explains the required project configuration for Firebase, EmailJS, and local development.

## 1. Firebase project

Open the Firebase Console and select project `kinora-aecd5`.

### Required configuration
- Authentication: enable Email/Password
- Do not enable Phone Authentication / SMS OTP
- Configure email verification in the Firebase Authentication settings
- Create a Firestore database for the project
- Create Firebase Storage
- Deploy the `firestore.rules` and `storage.rules` files
- Add the web app configuration shown in `.env.example`

### Firebase web config
- apiKey: `AIzaSyArmDelh0xBXiwKuxgT6eqYmLqhDa61_Tk`
- authDomain: `kinora-aecd5.firebaseapp.com`
- projectId: `kinora-aecd5`
- storageBucket: `kinora-aecd5.firebasestorage.app`
- messagingSenderId: `447860951425`
- appId: `1:447860951425:web:7b359d6d4f0ee176f4c080`
- measurementId: `G-7WFJLJN2NV`

### Where values go
Copy these values into a local `.env` file at the project root. The app reads them through Vite environment variables.

## 2. EmailJS setup

Use the provided EmailJS account:
- Service ID: `service_wj4g247`
- Template ID: `template_y8ddxme`
- Public Key: `TGsWVqv_mbp5AGOF7`

### Required template variables
The EmailJS template must accept:
- `{{to_email}}`
- `{{owner_name}}`
- `{{identity_name}}`
- `{{kinora_id}}`
- `{{sender_name}}`
- `{{sender_email}}`
- `{{message}}`
- `{{identity_url}}`

## 3. Local development

1. Create `.env` from `.env.example`
2. Install dependencies with `npm install`
3. Run the app with `npm run dev`
4. For production build use `npm run build`

## 4. Firestore and Storage rules deployment

### Method A: Firebase Console
1. Open Firebase Console
2. Open Firestore Database → Rules
3. Paste `firestore.rules`
4. Publish
5. Open Storage → Rules
6. Paste `storage.rules`
7. Publish

### Method B: Firebase CLI
```bash
npm install -g firebase-tools
firebase login
firebase use kinora-aecd5
firebase init firestore
firebase init storage
firebase deploy --only firestore,storage
```

## 5. Security checklist

- [ ] Firebase project selected: kinora-aecd5
- [ ] Email/Password enabled
- [ ] Phone OTP NOT used
- [ ] Email verification configured
- [ ] Firestore created
- [ ] Firestore rules deployed
- [ ] Storage created
- [ ] Storage rules deployed
- [ ] EmailJS service connected
- [ ] EmailJS template configured
- [ ] {{to_email}} configured
- [ ] EmailJS public key configured
- [ ] Environment variables configured
- [ ] Contact email tested
- [ ] Lost/contact flow tested
- [ ] QR tested
- [ ] PDF tested
- [ ] Privacy tested
- [ ] Unauthorized access tested
- [ ] Mobile tested
- [ ] Desktop tested
- [ ] Production build tested
- [ ] Existing domain connected

## 6. Production notes

- Keep the rules in GitHub and not only inside the Firebase Console.
- Do not expose private email addresses in public identity pages.
- Keep public and private data separated.
- Use Firebase Authentication as the source of truth for authorized access.
