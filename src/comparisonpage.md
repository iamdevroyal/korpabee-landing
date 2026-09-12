from pathlib import Path

content = r"""# KorpaBee Competitive Landscape Page — Claude Code Build Specification

## 1. Objective

Build a new public-facing page on the existing KorpaBee website that presents KorpaBee's competitive landscape.

The page should explain how KorpaBee compares with existing Nigerian/African platforms that overlap with parts of its ecosystem, while clearly positioning KorpaBee as a dedicated ecosystem for corps members and young professionals before, during, and after NYSC.

This is a **competitive intelligence / positioning page**, not a negative review or attack page.

The page must feel native to the existing KorpaBee website. Do not redesign the whole website. First inspect the existing codebase, routing, page structure, design system, typography, colors, reusable components, responsive behavior, SEO setup, and content patterns. Then implement the page using existing conventions.

---

## 2. Working Page Concept

Suggested public route:

`/competitors`

Alternative route if the existing site uses another naming convention:

`/competitive-landscape`

Use the route convention already present in the codebase if one exists.

Suggested page title:

**KorpaBee vs. The Alternatives**

Suggested headline:

**See Where KorpaBee Fits**

Suggested subheadline:

**A new kind of ecosystem for corps members and young professionals — combining community, career, commerce, housing, events and financial utilities around a verified identity.**

---

# 3. Important Product Context

KorpaBee is not only a social network.

Its ecosystem includes:

- Social / Community
- Jobs & Gigs
- Marketplace
- Housing
- Events
- Finance
- Professional Profiles
- Business / Employer Accounts
- Career / CV tools
- NYSC-specific identity
- State / Batch / Platoon communities
- PPA directory
- KorpaVerified
- Trust Score

The competitive page must reflect that full scope.

Do **not** describe Marketplace, Housing, Events or Finance as merely future concepts. They are part of KorpaBee's product/module architecture and should be represented as such.

---

# 4. Competitive Set

Use the following competitors as the primary comparison set:

1. Kopaville
2. WorkDone
3. Headstart
4. Hafrik
5. NaijaConnect
6. Campora
7. Gaji
8. CampusLink
9. Fuzu

The table should also include KorpaBee as the first/featured row.

---

# 5. Main Comparison Table

Create a responsive comparison table with the following columns:

| Platform | Social / Community | Jobs & Gigs | Marketplace | Housing | Events | Finance / Payments | Professional Profile | Business / Employers | Education / Career | NYSC-specific |
|---|---|---|---|---|---|---|---|---|---|---|

Use these values:

| Platform | Social / Community | Jobs & Gigs | Marketplace | Housing | Events | Finance / Payments | Professional Profile | Business / Employers | Education / Career | NYSC-specific |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| KorpaBee | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **✅ Core** |
| Kopaville | ✅ | ✅ | ✅ | — | — | — | ✅ | ✅ | ◐ | **✅ Core** |
| WorkDone | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ◐ | ◐ | — |
| Headstart | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ◐ | **✅ Strong** | — |
| Hafrik | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ◐ | **✅ Strong** | ◐ | — |
| NaijaConnect | ✅ | **✅ Freelance** | ✅ | — | **✅** | ◐ | ✅ | ✅ | **✅ Strong** | — |
| Campora | ◐ | ✅ | **✅ Strong** | ◐ | ✅ | ✅ | ◐ | ✅ | ◐ | — |
| Gaji | **✅ Strong** | ✅ | ✅ | — | ◐ | — | ◐ | ◐ | ◐ | — |
| CampusLink | ✅ | ✅ | ✅ | ◐ | ◐ | ◐ | ✅ | ◐ | **✅ Strong** | — |
| Fuzu | ◐ | **✅ Strong** | — | — | — | — | **✅ Strong** | **✅ Strong** | **✅ Strong** | — |

### Legend

- `✅` = Strong/direct feature overlap
- `◐` = Partial, adjacent, or limited overlap
- `—` = No strong evidence of the feature being a core offering
- `Core` = Central to the platform proposition
- `Strong` = Major component of the platform

Do not make the symbols the only way users understand the table. Add accessible labels/tooltips such as:

- Strong/direct
- Partial/adjacent
- Not evident
- Core proposition

Ensure the table is accessible to screen readers.

---

# 6. Competitive Profiles

Below the comparison table, create a card/section for each platform.

Each profile should include:

- Platform name
- Short positioning statement
- What it overlaps with
- Competitive relevance
- Threat level
- Link to official/current platform where available
- Optional platform logo only if reliable/current assets are available

Do not fabricate features.

Use the following editorial content as the starting point.

---

## 6.1 Kopaville

### Positioning

**The closest direct NYSC-focused competitor to KorpaBee.**

Kopaville is an NYSC-focused social platform connecting corps members in Nigeria.

Its public product descriptions include social sharing, professional profiles, jobs and PPA opportunities, recruiter/company participation, real-time chat, dating/matching and an NYSC-oriented marketplace.

### Key overlap

- NYSC social network
- Social feed
- Professional profiles
- Jobs
- PPA opportunities
- Recruiters
- Business/company participation
- Marketplace
- Chat
- NYSC identity/community

### Competitive relevance

Kopaville is the most direct competitor because it explicitly targets the same core population: Nigerian corps members.

However, KorpaBee should not attempt to win purely by being “another NYSC social network.”

KorpaBee's stronger distinction is its broader ecosystem:

**NYSC Identity → Community → PPA → Jobs/Gigs → Marketplace → Housing → Events → Finance → Career**

### Threat level

**Very High — Direct NYSC competitor**

---

## 6.2 WorkDone

### Positioning

**A multi-purpose Nigerian platform combining social interaction, jobs, marketplace, housing and payments.**

WorkDone overlaps with KorpaBee's broader ecosystem architecture.

Public descriptions highlight:

- Jobs
- Marketplace
- Rooms / housing
- Social feed
- Messaging
- Verified profiles
- Secure payments

### Competitive relevance

WorkDone is one of the strongest feature-level comparisons because several KorpaBee modules exist together rather than being isolated verticals.

### Threat level

**Very High — Ecosystem competitor**

---

## 6.3 Headstart

### Positioning

**A student-focused ecosystem bringing community, marketplace, housing, opportunities and financial utilities together.**

Headstart's public product offering includes:

- Marketplace
- Housing
- Community
- Scholarships
- Events
- Wallet
- Admission-related tools
- Opportunities
- Career/student services

### Competitive relevance

Headstart is important because it validates the idea that a young-user platform can combine social/community features with practical daily-life utilities.

KorpaBee differs by centering the experience around the NYSC journey and the transition into professional life.

### Threat level

**Very High — Young-user ecosystem competitor**

---

## 6.4 Hafrik

### Positioning

**A broader African social and business ecosystem.**

Hafrik's public product descriptions include:

- Social feed
- Reels
- Groups
- Events
- Jobs
- Marketplace
- Services
- Business pages
- Messaging
- Networking

### Competitive relevance

Hafrik is less NYSC-specific but represents the broader direction of social platforms becoming commerce, business and opportunity ecosystems.

### Threat level

**High — Broader social/business competitor**

---

## 6.5 NaijaConnect

### Positioning

**A Nigerian community and student-oriented platform combining social interaction with opportunities, marketplace and services.**

Public descriptions include:

- Student/community networking
- Freelance work
- Marketplace
- Events
- Directory
- Messaging
- Academic resources
- Opportunities
- Payments/escrow-related functionality

### Competitive relevance

NaijaConnect overlaps with KorpaBee's community + opportunity + marketplace strategy.

### Threat level

**High — Community/ecosystem competitor**

---

## 6.6 Campora

### Positioning

**A campus-focused platform combining marketplace, services, events, communication and payments.**

Public descriptions include:

- Campus marketplace
- Services/tasks
- Gigs
- Study materials
- Events
- Chat
- Payments
- Verified users

### Competitive relevance

Campora demonstrates strong overlap with KorpaBee's commerce, gigs, events and community utilities.

### Threat level

**High — Campus ecosystem competitor**

---

## 6.7 Gaji

### Positioning

**An emerging Nigerian social/community platform with marketplace, jobs and community functionality.**

Public descriptions include:

- Chat rooms
- Communities
- Marketplace
- Jobs/gigs
- Social/showcase features

### Competitive relevance

Gaji represents the broader Nigerian “social + utility” platform category that KorpaBee operates within.

### Threat level

**Medium–High — Emerging ecosystem competitor**

---

## 6.8 CampusLink

### Positioning

**A student ecosystem connecting social, academic, career and marketplace experiences.**

Public descriptions include:

- Community
- Marketplace
- Jobs/internships
- Scholarships
- Academic resources
- Business/student interactions

### Competitive relevance

CampusLink overlaps with KorpaBee's education, opportunity, community and marketplace layers.

### Threat level

**Medium — Student ecosystem competitor**

---

## 6.9 Fuzu

### Positioning

**A major African career and employment platform.**

Fuzu focuses strongly on:

- Jobs
- AI job matching
- Professional profiles
- CV/resume tools
- Learning
- Career development
- Employer recruitment
- Talent matching

### Competitive relevance

Fuzu is not a direct social/community competitor to KorpaBee.

It is a vertical competitor for KorpaBee's:

**Jobs → CV → Career → Professional identity**

layer.

### Threat level

**Medium / High within career — Vertical competitor**

---

# 7. Competitive Positioning Section

After the competitor profiles, create a visually strong section explaining:

## “Where KorpaBee Is Different”

Use this core message:

KorpaBee should not be positioned as another generic social network.

The stronger positioning is:

> **KorpaBee is the digital ecosystem for corps members and young professionals — connecting the social, career, commercial, housing, events and financial parts of their journey in one place.**

Then present the ecosystem visually:

**NYSC Identity**
↓
**Community**
↓
**PPA**
↓
**Jobs & Gigs**
↓
**Marketplace**
↓
**Housing**
↓
**Events**
↓
**Finance**
↓
**Professional Life**

Make this a visual journey/flow rather than a plain bullet list.

---

# 8. Key Differentiators

Create a section titled:

## “The KorpaBee Advantage”

Use these differentiators:

### 1. Built Around NYSC Identity

KorpaBee can structure identity around:

- State
- Batch
- Platoon
- Camp
- PPA
- Service journey

This allows communities and opportunities to be relevant to the user's actual NYSC context.

### 2. Beyond Social Networking

KorpaBee connects social interaction to practical services:

- Jobs
- Gigs
- Marketplace
- Housing
- Events
- Finance

The user does not need to leave the ecosystem every time they need something related to corps life.

### 3. Trust & Verification

Highlight:

- KorpaVerified
- Trust Score
- Verified users
- PPA/business verification

Position this as a foundation for safer interactions and better-quality opportunities.

### 4. Corps Member → Professional

KorpaBee's long-term advantage is continuity.

A user can enter as a corps member and continue using KorpaBee for:

- Jobs
- Career development
- Professional networking
- Business opportunities
- Commerce
- Housing
- Financial services

This creates a longer user lifecycle than a camp-only or student-only platform.

### 5. Business Ecosystem

Businesses are not just advertisers.

They can participate through:

- Recruitment
- PPA opportunities
- Marketplace
- Services
- Business profiles
- Housing/property opportunities
- Events

This creates a two-sided ecosystem:

**People ↔ Businesses**

---

# 9. Competitive Ranking Section

Create a compact visual ranking:

| Competitor | Category | Threat |
|---|---|---|
| Kopaville | Direct NYSC | Very High |
| WorkDone | Multi-module ecosystem | Very High |
| Headstart | Student/young-user ecosystem | Very High |
| Hafrik | Social/business ecosystem | High |
| NaijaConnect | Community/ecosystem | High |
| Campora | Campus ecosystem | High |
| Gaji | Social/utility | Medium–High |
| CampusLink | Student ecosystem | Medium |
| Fuzu | Career/employment | Medium–High vertical |

Do not imply these are formal market-share rankings. They are **strategic relevance assessments** based on product overlap.

---

# 10. Important Editorial Guardrails

This page must be credible.

### Do:

- Say “public product descriptions indicate…”
- Say “overlaps with…”
- Say “competitive relevance”
- Clearly distinguish direct competitors from vertical competitors
- Use “not evident” instead of claiming a platform definitely does not have something
- Include an “Information based on publicly available product information” note

### Do not:

- Say KorpaBee is the “first” unless independently verified
- Claim competitors copied KorpaBee
- Make defamatory claims
- Claim competitors have shut down unless verified
- Claim exact market share without a source
- Claim a feature is absent merely because it was not found
- Present the threat levels as objective market rankings
- Invent company statistics, user counts or funding information

---

# 11. Source / Verification Section

Add a small section near the bottom:

## “How We Compare”

Suggested copy:

> This comparison is based on publicly available product information and is intended to provide a high-level view of the Nigerian and African platforms operating in adjacent categories. Product features change frequently, so individual capabilities may evolve over time.

For the live website, use official platform links where possible.

Current reference sources include:

- Kopaville — Google Play / App Store
- WorkDone — official website
- Headstart — official website
- Hafrik — Google Play / official website
- NaijaConnect — official website
- Campora — official/company presence
- Gaji — official website
- CampusLink — official website
- Fuzu — official website

Before publishing, Claude Code should verify the current official URLs and avoid linking to outdated or unofficial pages.

---

# 12. Design Direction

The page should look like a premium SaaS/product competitive-analysis page rather than a blog article.

Use KorpaBee's existing design system.

Do not introduce a new unrelated visual language.

Recommended structure:

1. Hero
2. Competitive overview
3. Comparison table
4. Competitor cards
5. “Where KorpaBee Is Different”
6. KorpaBee ecosystem journey
7. KorpaBee Advantage
8. Competitive positioning/ranking
9. Closing CTA

---

# 13. Hero Section

Suggested copy:

### Eyebrow

**THE KORPABEE ECOSYSTEM**

### H1

**More Than a Social Network.**

### Supporting text

**See how KorpaBee compares with platforms across social networking, jobs, marketplaces, housing, events, finance and career development — and why we're building around the complete corps-member journey.**

Primary CTA:

**Join KorpaBee**

Secondary CTA:

**Explore KorpaBee**

Use the existing CTA patterns in the codebase.

---

# 14. Comparison Table UX

The table will be wide on desktop.

Implement:

- Horizontal scrolling on mobile
- Sticky first column if compatible with existing design
- Sticky table header where appropriate
- Clear category headers
- Responsive typography
- Accessible labels
- Tooltips/legends for symbols
- Highlight KorpaBee row without making competitors look inferior
- Avoid excessive colors
- Do not use red/green competitor grading that could look hostile

On mobile, consider transforming each competitor row into a comparison card if that is more consistent with the existing site.

Do not allow the table to break the page width.

---

# 15. Competitor Cards

Each card should contain:

**Platform name**

**Category label**

Short description

**Key overlaps**

3–6 small tags such as:

`Social`
`Jobs`
`Marketplace`
`Housing`
`Events`
`Career`

Then:

**Why it matters**

and

**Competitive relevance**

Use a subtle threat indicator:

`Direct`
`High overlap`
`Adjacent`
`Vertical`

Avoid aggressive language such as “enemy”, “rival to destroy”, etc.

---

# 16. KorpaBee Ecosystem Visualization

Build a visual component showing:

```text
                    KORPABEE
                       │
                Verified Identity
                       │
        ┌──────────────┼──────────────┐
        │              │              │
    Community       Career        Commerce
        │              │              │
     Groups       Jobs & Gigs    Marketplace
        │              │              │
      Events       KorpaVerified    Housing
        │              │              │
        └──────────────┼──────────────┘
                       │
                    Finance
                       │
                Professional Life