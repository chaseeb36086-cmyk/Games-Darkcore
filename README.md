# Dark Core

Premium 3D PC Gaming Website crafted with React, Vite, Tailwind CSS, Framer Motion, and Firebase.

## Features

- **Premium Design:** Glassmorphism, neon red lighting, horror aesthetics, 3D tilt effects, animated particles.
- **Hidden Admin Panel:** Complete CRUD capabilities protected by Firebase Authentication.
- **Client-Side Routing:** Fast transitions with Framer Motion.
- **Firebase Backend:** Entirely serverless utilizing Firestore.

## Firebase Setup Guide

1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Firestore**, and **Authentication (Email/Password)**.
3. In Authentication, manually create the admin user: `chaseeb.360.86@gmail.com` with a secure password.
4. Go to Project Settings and add a Web App. Copy the config variables.
5. In your local project, rename `.env.example` to `.env` and fill in:
   \`\`\`
   VITE_FIREBASE_API_KEY="..."
   VITE_FIREBASE_AUTH_DOMAIN="..."
   ...
   \`\`\`
6. Deploy the security rules using Firebase CLI:
   \`\`\`bash
   firebase deploy --only firestore
   \`\`\`

## Netlify Deployment Guide

1. Push your code to a GitHub repository.
2. Sign in to [Netlify](https://www.netlify.com/) and click "Add new site" -> "Import an existing project".
3. Select your GitHub repository.
4. Netlify will automatically detect the build settings (`npm run build`, publish directory `dist`).
5. Click **Show advanced** and add your Firebase Environment Variables (`VITE_FIREBASE_API_KEY`, etc.).
6. Click **Deploy Site**.
7. The included `netlify.toml` automatically handles SPA routing for React Router.

## Firebase Hosting Deployment Guide

1. Run `npm install -g firebase-tools`
2. Run `firebase login`
3. Run `firebase init hosting` (select your project, use `dist` as public directory, configure as single-page app = yes).
4. Run `npm run build`
5. Run `firebase deploy --only hosting`
