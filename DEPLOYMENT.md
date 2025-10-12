# Firebase Deployment Guide

Your project is currently configured for **Firebase Hosting** (static files).

## Current Setup: Firebase Hosting (Static)

✅ **What you have:**
- Next.js static export (`output: 'export'`)
- GitHub Actions workflow for Firebase Hosting
- Deploys to: `https://struxture-4b495.web.app`

✅ **How it works:**
1. Push to `main` branch
2. GitHub Actions builds static files (`npm run build` in `website/`)
3. Output goes to `website/out/`
4. Firebase Hosting serves the static files

---

## Firebase App Hosting Backend Error

You're seeing **App Hosting backend failures** because:

1. A Firebase App Hosting backend named "backend" was created in your Firebase Console
2. But your project is set up for **static hosting**, not App Hosting
3. App Hosting expects a **server-side Next.js app** (no `output: 'export'`)

### Option 1: Delete App Hosting Backend (Recommended)

If you **don't need server-side rendering**, delete the App Hosting backend:

1. Go to: https://console.firebase.google.com/project/struxture-4b495/apphosting
2. Find backend named "backend"
3. Click "Delete"

### Option 2: Switch to App Hosting (SSR)

If you **need server-side features**, switch to App Hosting:

1. Remove `output: 'export'` from `website/next.config.ts`
2. Update `apphosting.yaml` with proper config
3. Deploy via Firebase CLI: `firebase apphosting:backends:create`

---

## Current Deployment Status

✅ **Firebase Hosting**: Working (static site)
- Workflow: `.github/workflows/firebase-hosting-merge.yml`
- Output: `website/out/`
- URL: Check Firebase Console

❌ **Firebase App Hosting**: Failing (not configured for static export)
- Either delete it or switch to SSR

---

## Recommended Action

**Delete the App Hosting backend** since your site works great as a static site and doesn't need server-side rendering.

Your **Firebase Hosting** deployment should be working fine!

---

## ✅ Status: App Hosting Backend Deleted

CI/CD is now fully operational with Firebase Hosting only!

