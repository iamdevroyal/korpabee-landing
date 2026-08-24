# PWA Install Kit — Vue 3 + Vite (Laravel API backend)

Drop these files into your existing Vue SPA. Nothing here touches Laravel —
since you're running a separate SPA hitting Laravel as an API, the whole PWA
layer (manifest, service worker, install UI) lives entirely in the Vue project.

## 1. Install the plugin

```bash
npm install -D vite-plugin-pwa
```

## 2. File placement

```
your-vue-app/
├── vite.config.js              ← merge in vite.config.reference.js (don't overwrite)
├── index.html                  ← add the tags from index.html.snippet.html into <head>
├── public/
│   └── icons/                  ← copy the whole icons/ folder from this kit
├── src/
│   ├── utils/platform.js
│   ├── composables/useInstallPrompt.js
│   ├── components/InstallPrompt.vue
│   └── router/pwaStartupGuard.js
```

## 3. Mount the modal once, globally

In `App.vue`:

```vue
<template>
  <router-view />
  <InstallPrompt app-name="YourApp" icon="/icons/icon-192.png" />
</template>

<script setup>
import InstallPrompt from './components/InstallPrompt.vue';
</script>
```

## 4. Wire the router guard

In `src/router/index.js`:

```js
import { pwaStartupGuard } from './pwaStartupGuard';

router.beforeEach(pwaStartupGuard);
```

## 5. Wire the Register/Get Started button

This is the core flow you asked for — OS-detect, show the right install
experience, then continue:

```vue
<script setup>
import { useRouter } from 'vue-router';
import { useInstallPrompt } from '@/composables/useInstallPrompt';

const router = useRouter();
const { promptInstall } = useInstallPrompt();

async function onGetStarted() {
  await promptInstall(); // resolves whether installed, dismissed, or unsupported — never blocks the user
  router.push('/register');
}
</script>

<template>
  <button @click="onGetStarted">Get Started</button>
</template>
```

`promptInstall()` never throws and never blocks registration — if the user
dismisses the install card, or their browser can't install PWAs at all
(e.g. Firefox desktop), it just resolves and the user continues straight
into registration.

## 6. Why `/login` on launch

`start_url: '/login'` in the manifest (already set in `vite.config.reference.js`)
means tapping the installed home-screen icon opens directly to `/login`,
skipping the marketing landing page entirely. `pwaStartupGuard.js` is a
safety-net redirect for the rare case a cached/old `start_url` resolves to `/`.

---

## Testing checklist

**Local dev:** `localhost` counts as a secure context, so the service worker
registers fine with `npm run dev`. To test on a *real phone*, you need HTTPS —
either deploy, or tunnel your dev server (e.g. `npx cloudflared tunnel --url
http://localhost:5173`).

**iOS Safari (16, 17, 18):**
- Must be opened in actual Safari — Instagram/Facebook/TikTok in-app browsers
  and Chrome-on-iOS *cannot* install PWAs, only Safari can complete the "Add
  to Home Screen" step.
- There is no native install prompt on iOS at all — our modal's "Got it" step
  is purely instructional; the user still has to tap Share → Add to Home Screen
  themselves. This is an iOS platform limitation, not something fixable in code.
- After installing, relaunch from the home screen icon and confirm it opens to `/login`.

**Android Chrome:**
- `beforeinstallprompt` only fires after Chrome's own engagement heuristics
  are satisfied (a brief visit is usually enough, but a fresh emulator on the
  very first load may not fire it instantly — reload once if your modal shows
  the "unsupported" fallback during testing).
- Samsung Internet and Firefox for Android use different/no install APIs;
  this kit covers Chromium-based browsers, which covers the large majority
  of Android traffic.

**Desktop Chrome/Edge:**
- Works the same way as Android via `beforeinstallprompt`. The browser's own
  install icon in the address bar will still appear alongside our custom
  card — that's normal and harmless, not a conflict.

---

## Icons

`public/icons/` now contains icons generated from your actual logo (the
checkerboard "transparent" background in your upload was baked-in pixels,
not real alpha — it's been cleanly removed, including the chef-hat and
basket-slit cutouts, so edges are crisp with no white halo):

| File | Size | Background |
|---|---|---|
| `icon-192.png` / `icon-512.png` | 192² / 512² | transparent (`purpose: any`) |
| `icon-512-maskable.png` | 512² | opaque white, logo inside the safe zone |
| `apple-touch-icon-180.png` | 180² | opaque white (iOS doesn't support transparent icons) |
| `favicon-32.png` / `favicon-16.png` | 32² / 16² | transparent |

Still placeholder text: the app **name**, **short_name**, and
`apple-mobile-web-app-title` in `vite.config.reference.js` / `index.html.snippet.html`
— swap those for your real app name. If you later want iOS splash screens
(`apple-touch-startup-image`), regenerate from the same source logo with:

```bash
npx pwa-asset-generator path/to/logos.png ./public/icons --splash-only --background "#ffffff"
```

## Honest limitations worth knowing

- iOS has no `beforeinstallprompt` equivalent and no way to detect "is this
  installable" before the user installs — there's no shortcut around the
  manual Share → Add to Home Screen flow.
- Web Push on iOS only works *after* the app is installed to the home screen,
  and only from iOS 16.4 onward.
- None of this fabricates fake ratings, install counts, or store badges —
  the cards are styled to feel native, but only show real information.
