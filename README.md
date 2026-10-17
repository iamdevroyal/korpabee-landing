# KorpaBee Landing & Ecosystem Showcase

[![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-Edge_Hosting-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)

> **The official public-facing marketing, onboarding, and competitive landscape website for KorpaBee.**  
> Delivering blazing-fast first-load speeds, interactive animations (including animated Walking Corper sprites), feature showcases, dynamic FAQ, and SEO optimization.

---

## 🌐 Live Deployments & URLs

| Service | Environment | URL |
|---|---|---|
| **Marketing Landing** | Production | [https://korpabee.com](https://korpabee.com) |
| **User Application** | Production | [https://web.korpabee.com](https://web.korpabee.com) |
| **Business Portal** | Production | [https://business.korpabee.com](https://business.korpabee.com) |
| **Admin Panel** | Production | [https://admin.korpabee.com](https://admin.korpabee.com) |
| **Backend REST API** | Production | `https://api.korpabee.com/api/v1` |

---

## 🌟 Highlights & Features

- 🚶‍♂️ **Interactive Sprite Animations**: Custom animated NYSC corper walking sprite (`WalkingCorper.vue`) and dynamic scroll-triggered visual effects.
- ⚡ **Feature Showcases**:
  - **PPA Directory & Reviews**: Verified crowd-sourced compensation, accommodation, and safety reviews.
  - **Social Feed & Buzz**: Real-time posts, camp memories, and state CDS hive streams.
  - **Allawee & Gamified Savings**: Ajo peer escrow groups, daily missions, and badge leaderboards.
  - **Gigs & Marketplace**: Freelance micro-tasks rewarded in KorpaCoins or Naira.
  - **Career & AI Resume Builder**: Modern CV templates and AI-assisted cover letter generators.
- 📊 **Competitive Landscape**: Comprehensive head-to-head comparison against alternatives (`/competitors`) detailing the full feature ecosystem.
- 📋 **Onboarding & Waitlist**: Streamlined modal flow capturing prospective corps members by state, batch, and stream.
- ⚖️ **Legal & Compliance**: Complete legal policy pages (`/privacy`, `/terms`, `/disclaimer`).
- 🔍 **SEO & OpenGraph Architecture**: Dynamic page titles, meta descriptions, canonical links, and social card previews on route transitions.

---

## 🛠️ Technology Stack

- **Framework**: Vue 3 (Composition API + `<script setup>`)
- **Build Tool**: Vite 6 with ultra-fast production minification
- **Routing**: Vue Router 4 with scroll restoration & dynamic head meta injection
- **Styling**: TailwindCSS v3.4 + PostCSS with Autoprefixer
- **Icons**: `lucide-vue-next`
- **Image Processing**: Sharp (for optimized sprite assets)
- **HTTP Client**: Axios

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v20.x or higher)
- npm or pnpm

### 1. Clone & Install
```bash
git clone https://github.com/iamdevroyal/korpabee-landing.git
cd korpabee-landing
npm install
```

### 2. Run Locally
```bash
npm run dev
# Server running at http://localhost:5175
```

### 3. Build for Production
```bash
npm run build
# Outputs optimized static assets to dist/
```

### 4. Preview Build
```bash
npm run preview
```

---

## 📁 Directory Structure

```
korpabee-landing/
├── public/                 # Favicons, robots.txt, sitemaps, manifest
├── src/
│   ├── assets/             # Corper sprites, brand marks, illustration vectors
│   ├── components/
│   │   ├── common/         # WalkingCorper, SearchBar, Modals, Toast
│   │   ├── comparison/     # HeadToHeadFlow, AdvantageSection, LandscapeQuadrant
│   │   ├── finance/        # Savings challenge cards, leaderboards, VAS modals
│   │   ├── social/         # Feed previews, Buzz modals, story ads
│   │   └── ui/             # FAQ accordion, chat widget, scroll to top
│   ├── composables/        # Reactive hooks (useScrollReveal, useMouseSpotlight, etc.)
│   ├── data/               # Competitor intelligence dataset & market metrics
│   ├── router/             # Route configurations & SEO navigation guards
│   ├── views/
│   │   ├── LandingPage.vue # Main high-converting landing experience
│   │   ├── AboutPage.vue   # Mission, vision, and team story
│   │   ├── CompetitorPage.vue # Ecosystem matrix vs other platforms
│   │   └── legal/          # Terms, Privacy Policy, and Legal Disclaimers
│   ├── App.vue             # Root Vue component
│   └── main.js             # Client entry point
├── index.html              # HTML shell with meta tags
├── package.json            # Scripts & dependencies
└── vite.config.js          # Vite build config
```

---

## 🔗 Related Ecosystem Repositories

| Repository | Description |
|---|---|
| [`korpabee-api`](https://github.com/iamdevroyal/korpabee-api) | Laravel 13 Core REST API, Reverb WebSockets & Queue Daemons |
| [`korpabee-user`](https://github.com/iamdevroyal/korpabee-user) | Vue 3 Main Social, CDS, PPA & Marketplace App for Corpers |
| [`korpabee-admin`](https://github.com/iamdevroyal/korpabee-admin) | Vue 3 Superadmin & Operations Management Dashboard |
| [`korpabee-business`](https://github.com/iamdevroyal/korpabee-business) | Vue 3 Corporate & Business Management Portal |

---

## 📄 License

Private & Proprietary — © 2026 KorpaBee Technologies. All rights reserved.
