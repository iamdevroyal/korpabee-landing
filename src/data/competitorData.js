/**
 * KorpaBee Competitive Landscape Data
 * Derived from the official competitive analysis and positioning specification.
 */

export const MATRIX_COLUMNS = [
  { id: 'social', label: 'Social & Community', shortLabel: 'Social', category: 'community', tooltip: 'Group chats, state/platoon feeds, corper networking' },
  { id: 'jobs', label: 'Jobs & Gigs', shortLabel: 'Jobs & Gigs', category: 'career', tooltip: 'Full-time jobs, freelance gigs, PPA placements, internships' },
  { id: 'marketplace', label: 'Marketplace', shortLabel: 'Marketplace', category: 'commerce', tooltip: 'Peer-to-peer buy/sell, camp kits, appliances, escrow' },
  { id: 'housing', label: 'Housing & Accommodation', shortLabel: 'Housing', category: 'living', tooltip: 'Apartment listings near PPA, corper lodge finders, roommate matching' },
  { id: 'events', label: 'Events & Hangouts', shortLabel: 'Events', category: 'community', tooltip: 'Community gatherings, camp meetups, workshops, festivals' },
  { id: 'finance', label: 'Finance & Payments', shortLabel: 'Finance', category: 'finance', tooltip: 'Digital wallet, peer-to-peer escrow, cooperative ajo savings' },
  { id: 'profile', label: 'Professional Profile', shortLabel: 'Profile', category: 'career', tooltip: 'Verified digital CV, showcase portfolio, endorsements' },
  { id: 'business', label: 'Business & Employers', shortLabel: 'Employers', category: 'commerce', tooltip: 'Recruiter portals, business directory, verified merchant accounts' },
  { id: 'education', label: 'Education & Career', shortLabel: 'Education', category: 'career', tooltip: 'Upskilling courses, mentorship, CV builder, career prep' },
  { id: 'nysc', label: 'NYSC-Specific', shortLabel: 'NYSC Focus', category: 'nysc', tooltip: 'Dedicated verification, call-up integration, batch/platoon grouping' }
]

export const SYMBOL_LEGEND = {
  core: {
    symbol: '✅',
    badge: 'Core',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    label: 'Core Proposition',
    description: 'Central foundation of the platform’s daily user experience'
  },
  strong: {
    symbol: '✅',
    badge: 'Strong',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    label: 'Strong / Direct Overlap',
    description: 'Major active component in the public platform offering'
  },
  freelance: {
    symbol: '✅',
    badge: 'Freelance',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    label: 'Freelance Focus',
    description: 'Specifically focused on freelance and gig assignments'
  },
  partial: {
    symbol: '◐',
    badge: 'Partial',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    label: 'Partial / Adjacent',
    description: 'Adjacent, secondary, or limited functionality'
  },
  none: {
    symbol: '—',
    badge: 'Not Evident',
    badgeColor: 'bg-slate-50 text-slate-400 border-slate-200',
    label: 'Not Evident',
    description: 'No strong evidence of the feature being a core public offering'
  }
}

export const COMPETITORS = [
  {
    id: 'korpabee',
    name: 'KorpaBee',
    isHero: true,
    tagline: 'The All-in-One NYSC Social, Opportunity & Lifestyle Ecosystem',
    category: 'Full-Lifecycle NYSC Ecosystem',
    threatLevel: 'Platform Champion',
    threatBadge: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    summary: 'A unified digital ecosystem engineered specifically for corps members and young professionals before, during, and after NYSC service.',
    websiteUrl: 'https://korpabee.com',
    keyOverlap: ['NYSC Identity', 'Social Groups', 'Jobs & Gigs', 'PPA Reviews', 'Verified Housing', 'Marketplace', 'Ajo Wallet', 'Events', 'Career Prep'],
    scores: {
      social: 'core',
      jobs: 'core',
      marketplace: 'core',
      housing: 'core',
      events: 'core',
      finance: 'core',
      profile: 'core',
      business: 'core',
      education: 'core',
      nysc: 'core'
    },
    whyItMatters: 'KorpaBee unifies 10 fragmented services around a single verified NYSC identity, eliminating the need to jump between disconnected single-purpose platforms.',
    relevance: 'Benchmark platform delivering complete continuity from orientation camp to post-service corporate hiring.'
  },
  {
    id: 'kopaville',
    name: 'Kopaville',
    isHero: false,
    tagline: 'NYSC-focused social platform connecting corps members in Nigeria',
    category: 'Direct NYSC Social Competitor',
    threatLevel: 'Very High — Direct NYSC',
    threatBadge: 'bg-rose-50 text-rose-700 border-rose-200',
    summary: 'Public descriptions include social sharing, professional profiles, jobs, PPA opportunities, real-time chat, and an NYSC-oriented marketplace.',
    websiteUrl: 'https://play.google.com/store',
    keyOverlap: ['NYSC Social Feed', 'Professional Profiles', 'Jobs & PPA', 'Recruiters', 'Marketplace', 'Real-time Chat'],
    scores: {
      social: 'strong',
      jobs: 'strong',
      marketplace: 'strong',
      housing: 'none',
      events: 'none',
      finance: 'none',
      profile: 'strong',
      business: 'strong',
      education: 'partial',
      nysc: 'core'
    },
    whyItMatters: 'Kopaville is the most direct demographic competitor because it explicitly targets Nigerian corps members.',
    relevance: 'KorpaBee’s advantage lies in its comprehensive housing, escrowed payments, event discovery, and continuous post-NYSC career lifecycle rather than competing purely as another social forum.'
  },
  {
    id: 'workdone',
    name: 'WorkDone',
    isHero: false,
    tagline: 'Multi-purpose Nigerian platform combining social interaction, jobs, marketplace, housing and payments',
    category: 'Multi-Module Ecosystem Competitor',
    threatLevel: 'Very High — Ecosystem',
    threatBadge: 'bg-rose-50 text-rose-700 border-rose-200',
    summary: 'Public descriptions highlight jobs, marketplace listings, rooms/housing, social feed, verified profiles, and secure digital payments.',
    websiteUrl: 'https://workdone.ng',
    keyOverlap: ['Social Feed', 'Jobs', 'Marketplace', 'Rooms/Housing', 'Messaging', 'Verified Profiles', 'Payments'],
    scores: {
      social: 'strong',
      jobs: 'strong',
      marketplace: 'strong',
      housing: 'strong',
      events: 'none',
      finance: 'strong',
      profile: 'strong',
      business: 'partial',
      education: 'partial',
      nysc: 'none'
    },
    whyItMatters: 'WorkDone represents the closest architecture-level comparison where multiple functional modules coexist in a single ecosystem.',
    relevance: 'KorpaBee differs fundamentally through its dedicated NYSC State/Batch/Platoon grouping, verified PPA directory, and tailored corps member lifecycle context.'
  },
  {
    id: 'headstart',
    name: 'Headstart',
    isHero: false,
    tagline: 'Student-focused ecosystem bringing community, marketplace, housing, opportunities and financial utilities together',
    category: 'Young-User Ecosystem Competitor',
    threatLevel: 'Very High — Young-User Ecosystem',
    threatBadge: 'bg-rose-50 text-rose-700 border-rose-200',
    summary: 'Public offering features campus marketplace, housing search, community forums, scholarships, events, student wallet, and admissions tools.',
    websiteUrl: 'https://headstart.africa',
    keyOverlap: ['Campus Community', 'Marketplace', 'Housing', 'Scholarships & Gigs', 'Events', 'Digital Wallet'],
    scores: {
      social: 'strong',
      jobs: 'strong',
      marketplace: 'strong',
      housing: 'strong',
      events: 'strong',
      finance: 'strong',
      profile: 'strong',
      business: 'partial',
      education: 'strong',
      nysc: 'none'
    },
    whyItMatters: 'Validates that youth in Nigeria eagerly adopt unified platforms combining social engagement with daily life utilities.',
    relevance: 'KorpaBee centers around the graduation-to-NYSC-to-professional transition, capturing high-intent young adults moving into the formal workforce.'
  },
  {
    id: 'hafrik',
    name: 'Hafrik',
    isHero: false,
    tagline: 'Pan-African social and business ecosystem connecting people, trade, and opportunities',
    category: 'Broader Social & Business Competitor',
    threatLevel: 'High — Broader Social/Business',
    threatBadge: 'bg-amber-50 text-amber-700 border-amber-200',
    summary: 'Public descriptions include social reels, groups, events, jobs, marketplace trade, service bookings, business pages, and professional networking.',
    websiteUrl: 'https://hafrik.com',
    keyOverlap: ['Social Feed & Reels', 'Groups', 'Events', 'Jobs', 'Marketplace', 'Business Pages'],
    scores: {
      social: 'strong',
      jobs: 'strong',
      marketplace: 'strong',
      housing: 'partial',
      events: 'strong',
      finance: 'partial',
      profile: 'partial',
      business: 'strong',
      education: 'partial',
      nysc: 'none'
    },
    whyItMatters: 'Exemplifies the general trend of social networks incorporating commerce and opportunity discovery.',
    relevance: 'Less targeted towards corps logistics, whereas KorpaBee provides hyper-localized NYSC platoon matching and PPA employer reviews.'
  },
  {
    id: 'naijaconnect',
    name: 'NaijaConnect',
    isHero: false,
    tagline: 'Nigerian community and student platform combining social networking with freelance gigs and trade',
    category: 'Community & Gig Ecosystem',
    threatLevel: 'High — Community/Ecosystem',
    threatBadge: 'bg-amber-50 text-amber-700 border-amber-200',
    summary: 'Public features include student/community networking, freelance opportunities, marketplace, events directory, and escrow payment integrations.',
    websiteUrl: 'https://naijaconnect.ng',
    keyOverlap: ['Community Networking', 'Freelance Work', 'Marketplace', 'Events Directory', 'Payments/Escrow'],
    scores: {
      social: 'strong',
      jobs: 'freelance',
      marketplace: 'strong',
      housing: 'none',
      events: 'strong',
      finance: 'partial',
      profile: 'strong',
      business: 'strong',
      education: 'strong',
      nysc: 'none'
    },
    whyItMatters: 'Overlaps with KorpaBee’s community + freelance gig + marketplace strategy for young Nigerians.',
    relevance: 'Lacks specialized accommodation/lodge matchmaking and structured national youth service identity verification.'
  },
  {
    id: 'campora',
    name: 'Campora',
    isHero: false,
    tagline: 'Campus-focused platform combining student marketplace, tasks, gigs, events and payments',
    category: 'Campus Ecosystem Competitor',
    threatLevel: 'High — Campus Ecosystem',
    threatBadge: 'bg-amber-50 text-amber-700 border-amber-200',
    summary: 'Public product descriptions detail student marketplace items, services/tasks, gigs, study materials, events calendar, and verified users.',
    websiteUrl: 'https://campora.ng',
    keyOverlap: ['Campus Marketplace', 'Student Gigs/Tasks', 'Study Materials', 'Events', 'Payments'],
    scores: {
      social: 'partial',
      jobs: 'strong',
      marketplace: 'strong',
      housing: 'partial',
      events: 'strong',
      finance: 'strong',
      profile: 'partial',
      business: 'strong',
      education: 'partial',
      nysc: 'none'
    },
    whyItMatters: 'Demonstrates high traction in micro-tasks, campus commerce, and verified student interactions.',
    relevance: 'Targeted primarily within undergraduate university walls; KorpaBee picks up the graduate journey when corps members disperse nationwide.'
  },
  {
    id: 'gaji',
    name: 'Gaji',
    isHero: false,
    tagline: 'Emerging Nigerian social and community platform with marketplace and gig functionality',
    category: 'Emerging Social/Utility Competitor',
    threatLevel: 'Medium–High — Emerging Ecosystem',
    threatBadge: 'bg-amber-50 text-amber-700 border-amber-200',
    summary: 'Public product includes chat rooms, community channels, marketplace listings, jobs/gigs, and social showcase feeds.',
    websiteUrl: 'https://gaji.ng',
    keyOverlap: ['Chat Rooms', 'Communities', 'Marketplace', 'Jobs/Gigs', 'Social Showcase'],
    scores: {
      social: 'strong',
      jobs: 'strong',
      marketplace: 'strong',
      housing: 'none',
      events: 'partial',
      finance: 'none',
      profile: 'partial',
      business: 'partial',
      education: 'partial',
      nysc: 'none'
    },
    whyItMatters: 'Represents the rising wave of domestic community-driven utility apps.',
    relevance: 'Lacks verified NYSC credentials, housing escrow, and structured PPA career matchmaking.'
  },
  {
    id: 'campuslink',
    name: 'CampusLink',
    isHero: false,
    tagline: 'Student ecosystem connecting social, academic, career and marketplace experiences',
    category: 'Student Ecosystem Competitor',
    threatLevel: 'Medium — Student Ecosystem',
    threatBadge: 'bg-blue-50 text-blue-700 border-blue-200',
    summary: 'Public features include student community, campus marketplace, internships, scholarships, and academic resource libraries.',
    websiteUrl: 'https://campuslink.ng',
    keyOverlap: ['Community', 'Marketplace', 'Internships', 'Scholarships', 'Academic Resources'],
    scores: {
      social: 'strong',
      jobs: 'strong',
      marketplace: 'strong',
      housing: 'partial',
      events: 'partial',
      finance: 'partial',
      profile: 'strong',
      business: 'partial',
      education: 'strong',
      nysc: 'none'
    },
    whyItMatters: 'Strong touchpoint for early academic life and internship discovery.',
    relevance: 'Pre-NYSC demographic with minimal post-graduation continuity or state-by-state corps logistical tools.'
  },
  {
    id: 'fuzu',
    name: 'Fuzu',
    isHero: false,
    tagline: 'Major African career, CV development, and talent matching platform',
    category: 'Vertical Career & Employment Competitor',
    threatLevel: 'Medium–High Vertical — Career',
    threatBadge: 'bg-blue-50 text-blue-700 border-blue-200',
    summary: 'Strong focus on AI job matching, professional profiles, CV/resume diagnostics, career development courses, and employer talent acquisition.',
    websiteUrl: 'https://fuzu.com',
    keyOverlap: ['Jobs & Careers', 'CV/Resume Tools', 'Learning & Upskilling', 'Recruiter Portal', 'Professional Profiles'],
    scores: {
      social: 'partial',
      jobs: 'strong',
      marketplace: 'none',
      housing: 'none',
      events: 'none',
      finance: 'none',
      profile: 'strong',
      business: 'strong',
      education: 'strong',
      nysc: 'none'
    },
    whyItMatters: 'Vertical competitor for KorpaBee’s Jobs → CV → Career → Professional Identity module layer.',
    relevance: 'Not a community, housing, or lifestyle competitor. KorpaBee integrates career tools natively alongside daily social and financial life.'
  }
]

export const ECOSYSTEM_JOURNEY = [
  {
    step: 1,
    id: 'nysc-identity',
    name: 'NYSC Identity',
    tagline: 'Verified Credentials',
    description: 'Structure verified identity around State Code, Call-Up Number, Batch (A/B/C), Platoon, and Orientation Camp.',
    competitorContrast: 'Generic platforms rely on unverified phone numbers or basic email signups with zero corps legitimacy.'
  },
  {
    step: 2,
    id: 'community',
    name: 'Community',
    tagline: 'Platoon & State Groups',
    description: 'Instant automatic grouping into your exact platoon, camp cohort, and state association channels with spam protection.',
    competitorContrast: 'Corps members are currently forced into noisy, unmoderated WhatsApp and Telegram groups.'
  },
  {
    step: 3,
    id: 'ppa',
    name: 'PPA Insights',
    tagline: 'Verified Directory & Reviews',
    description: 'Search, review, and evaluate Places of Primary Assignment (PPAs) based on genuine corper stipends, workload, and accommodation.',
    competitorContrast: 'PPA information is completely fragmented, leading thousands of corpers to blind rejections and exploitation.'
  },
  {
    step: 4,
    id: 'jobs-gigs',
    name: 'Jobs & Gigs',
    tagline: 'Corper-Tailored Opportunities',
    description: 'Access weekend gigs, tutoring gigs, remote freelance assignments, and entry-level career tracks suited to corps schedules.',
    competitorContrast: 'Traditional job boards demand 3-5 years experience or ignore the legal and logistical realities of the service year.'
  },
  {
    step: 5,
    id: 'marketplace',
    name: 'Marketplace',
    tagline: 'Escrowed Camp & Lodge Trade',
    description: 'Safely buy and sell mattress pads, kitchenettes, uniform accessories, and electronics with integrated buyer protection.',
    competitorContrast: 'Unmoderated social marketplaces suffer high rates of advance-fee payment scams.'
  },
  {
    step: 6,
    id: 'housing',
    name: 'Housing',
    tagline: 'Apartments & Roommates',
    description: 'Browse verified lodges near your PPA and connect with compatible, verified fellow corpers to split rent safely.',
    competitorContrast: 'Corpers fall prey to predatory local agents demanding exorbitant illegal inspection fees.'
  },
  {
    step: 7,
    id: 'events',
    name: 'Events',
    tagline: 'CDS, Sports & Socials',
    description: 'Discover Community Development Service (CDS) projects, inter-platoon sports, and weekend networking hangouts.',
    competitorContrast: 'Event updates are scattered across disparate social media stories and word-of-mouth.'
  },
  {
    step: 8,
    id: 'finance',
    name: 'Finance',
    tagline: 'Ajo Savings & Escrow',
    description: 'CBN-licensed partner-backed wallet, structured group Ajo contributions, and seamless peer-to-peer corper remittances.',
    competitorContrast: 'Fintech apps lack communal peer-bonding mechanisms tailored to the monthly allawee cycle.'
  },
  {
    step: 9,
    id: 'career',
    name: 'Professional Life',
    tagline: 'Post-POP Acceleration',
    description: 'Seamlessly graduate your profile from corps member status into an alumni professional talent directory for top employers.',
    competitorContrast: 'Camp-only apps die upon Passing Out Parade (POP); users are abandoned just as career search begins.'
  }
]

export const ADVANTAGES = [
  {
    icon: 'ShieldCheck',
    number: '01',
    title: 'Built Around NYSC Identity',
    subtitle: 'State • Batch • Platoon • Camp • PPA',
    description: 'Unlike generic social networks, every interaction on KorpaBee is rooted in your real-world service journey. Platoon channels and local opportunities automatically adapt to your assigned geopolitical zone and deployment timeline.'
  },
  {
    icon: 'Boxes',
    number: '02',
    title: 'Beyond Social Networking',
    subtitle: 'Social proof paired with essential utilities',
    description: 'We connect social interaction directly to life essentials: housing near your PPA, roommate matchmaking, vetted marketplace trade, gig assignments, and financial utilities. You never have to juggle 6 different unverified apps.'
  },
  {
    icon: 'Award',
    number: '03',
    title: 'Trust & KorpaVerified',
    subtitle: 'Transparent Trust Score & verified badge',
    description: 'Safety is the foundation of corps life. KorpaVerified badges and dynamic Trust Scores authenticate students, corpers, landlords, and employers, eliminating ghost accounts and advance-fee scam risks.'
  },
  {
    icon: 'TrendingUp',
    number: '04',
    title: 'Corps Member → Professional',
    subtitle: 'Multi-year user continuity, not a 12-month cutoff',
    description: 'Campus apps become irrelevant at convocation, and camp apps die at POP. KorpaBee powers your post-service transition with CV builders, employer talent matching, corporate jobs, and young professional networking.'
  },
  {
    icon: 'Briefcase',
    number: '05',
    title: 'Two-Sided Business Ecosystem',
    subtitle: 'People ↔ Businesses in symbiotic harmony',
    description: 'Businesses are active ecosystem partners rather than banner ads. Companies recruit top graduate talent, PPAs publish authenticated opportunities, and local merchants offer verified services directly to corps members.'
  }
]

export const STRATEGIC_RANKINGS = [
  { rank: 1, name: 'Kopaville', category: 'Direct NYSC Platform', threat: 'Very High', note: 'Closest direct demographic overlap (corps members). KorpaBee wins on multi-utility depth.' },
  { rank: 2, name: 'WorkDone', category: 'Multi-Module Platform', threat: 'Very High', note: 'Strong architecture overlap (social, jobs, housing, payments). KorpaBee wins on NYSC specialization.' },
  { rank: 3, name: 'Headstart', category: 'Student Ecosystem', threat: 'Very High', note: 'Validates multi-utility young-user platforms. KorpaBee wins on post-grad career focus.' },
  { rank: 4, name: 'Hafrik', category: 'Social / Commerce', threat: 'High', note: 'Broad African social & trade network. KorpaBee provides hyper-localized service context.' },
  { rank: 5, name: 'NaijaConnect', category: 'Community & Gigs', threat: 'High', note: 'Student/freelance ecosystem. KorpaBee leads with accommodation & verified PPA ratings.' },
  { rank: 6, name: 'Campora', category: 'Campus Ecosystem', threat: 'High', note: 'Undergraduate commerce & tasks. KorpaBee captures graduate migration nationwide.' },
  { rank: 7, name: 'Gaji', category: 'Social / Utility', threat: 'Medium–High', note: 'Emerging Nigerian community app. KorpaBee offers verified identity & financial escrow.' },
  { rank: 8, name: 'CampusLink', category: 'Student Network', threat: 'Medium', note: 'Undergraduate academic & internships. KorpaBee expands into full professional workforce.' },
  { rank: 9, name: 'Fuzu', category: 'Vertical Career', threat: 'Medium–High', note: 'Pure-play career/CV engine. KorpaBee embeds career utilities within daily social life.' }
]

export const DATA_SOURCES = [
  { name: 'Kopaville', platform: 'Android / Google Play & Public Product Pages', status: 'Active Verified' },
  { name: 'WorkDone', platform: 'Official Web Platform & Public Marketing', status: 'Active Verified' },
  { name: 'Headstart', platform: 'Official Web App & Public Product Announcements', status: 'Active Verified' },
  { name: 'Hafrik', platform: 'Official Mobile App & Web Ecosystem', status: 'Active Verified' },
  { name: 'NaijaConnect', platform: 'Official Community Portal & Marketplace', status: 'Active Verified' },
  { name: 'Campora', platform: 'Official Campus Services & Company Channels', status: 'Active Verified' },
  { name: 'Gaji', platform: 'Official Community Platform & Public Channels', status: 'Active Verified' },
  { name: 'CampusLink', platform: 'Official Student Directory & Opportunities', status: 'Active Verified' },
  { name: 'Fuzu', platform: 'Official Career Portal & Talent Platform', status: 'Active Verified' }
]
