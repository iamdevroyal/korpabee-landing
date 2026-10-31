/**
 * Cloudflare Pages Middleware for KorpaBee Landing App (korpabee.com)
 * Dynamic OpenGraph & Twitter Card Injection for Social Crawlers (Facebook, LinkedIn, X, WhatsApp) & SEO
 */

const STATIC_EXTENSIONS = /\.(png|jpg|jpeg|gif|svg|ico|webp|avif|css|js|json|txt|xml|woff|woff2|ttf|eot|map|webmanifest)$/i;

const ROUTES_META = {
  '/': {
    title: 'KorpaBee - The All-in-One NYSC Social, Opportunity & Lifestyle Platform',
    description: 'KorpaBee helps Nigerian NYSC corps members connect with platoon & state groups, discover verified PPA reviews, find housing & roommates, access job opportunities, and save with Ajo wallet escrow.',
    image: 'https://korpabee.com/og-image.png',
    canonical: 'https://korpabee.com/'
  },
  '/about': {
    title: 'About KorpaBee — The All-in-One NYSC Platform',
    description: 'Learn how KorpaBee powers the Nigerian service year with community feeds, verified PPA reviews, housing & roommates, jobs, AI career tools, and gamified savings.',
    image: 'https://korpabee.com/og-image.png',
    canonical: 'https://korpabee.com/about'
  },
  '/competitors': {
    title: 'KorpaBee vs The Alternatives — Competitive Intelligence & Ecosystem Landscape',
    description: 'See how KorpaBee compares across social networking, jobs, marketplaces, housing, events, finance, and career development for Nigerian NYSC corps members.',
    image: 'https://korpabee.com/og-image.png',
    canonical: 'https://korpabee.com/competitors'
  },
  '/competitive-landscape': {
    title: 'KorpaBee vs The Alternatives — Competitive Intelligence & Ecosystem Landscape',
    description: 'See how KorpaBee compares across social networking, jobs, marketplaces, housing, events, finance, and career development for Nigerian NYSC corps members.',
    image: 'https://korpabee.com/og-image.png',
    canonical: 'https://korpabee.com/competitors'
  },
  '/privacy': {
    title: 'Privacy Policy | KorpaBee',
    description: 'Learn how KorpaBee collects, uses, protects, and handles your personal data across the KorpaBee platform and services.',
    image: 'https://korpabee.com/og-image.png',
    canonical: 'https://korpabee.com/privacy'
  },
  '/terms': {
    title: 'Terms of Service | KorpaBee',
    description: 'Review the terms, guidelines, user agreements, and service policies for using the KorpaBee platform and services.',
    image: 'https://korpabee.com/og-image.png',
    canonical: 'https://korpabee.com/terms'
  },
  '/disclaimer': {
    title: 'Legal Disclaimer | KorpaBee',
    description: 'Read the official financial, utility, and user-generated content disclaimer for KorpaBee platform.',
    image: 'https://korpabee.com/og-image.png',
    canonical: 'https://korpabee.com/disclaimer'
  },
  '/sos': {
    title: 'KorpaSOS Emergency Shield — Real-Time Distress Response for NYSC Corps Members',
    description: 'Discover KorpaSOS: 10-second safety countdown, live GPS telemetry, nationwide Police PRO directory, and instant mutual aid dispatch for Nigerian corps members.',
    image: 'https://korpabee.b-cdn.net/blog/media/67563a5b-8e11-4c62-a0a1-ba1e3ba2f3a1.jpg',
    canonical: 'https://korpabee.com/sos'
  }
};

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/+$/, '') || '/';

  // 1. Skip static assets immediately
  if (STATIC_EXTENSIONS.test(url.pathname)) {
    return context.next();
  }

  // Helper to fetch base HTML asset
  async function getBaseResponse() {
    let res;
    try {
      res = await context.next();
    } catch (e) {
      if (env?.ASSETS?.fetch) {
        res = await env.ASSETS.fetch(new URL('/', request.url));
      }
    }
    const contentType = res?.headers?.get('content-type') || '';
    if (!res || res.status === 404 || !contentType.includes('text/html')) {
      if (env?.ASSETS?.fetch) {
        res = await env.ASSETS.fetch(new URL('/', request.url));
      }
    }
    return res;
  }

  // Lookup route metadata (fallback to home)
  const meta = ROUTES_META[pathname] || ROUTES_META['/'];
  const userAgent = request.headers.get('user-agent') || '';
  const isSocialCrawler = /facebookexternalhit|Facebot|LinkedInBot|Twitterbot|WhatsApp|TelegramBot|Discordbot|Slackbot|SkypeUriPreview|Googlebot|bingbot|Applebot|DuckDuckBot|Baiduspider/i.test(userAgent);

  // 2. Return dedicated OpenGraph payload for crawlers
  if (isSocialCrawler) {
    const crawlerHtml = `<!DOCTYPE html>
<html lang="en" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(meta.title)}</title>
  <meta name="description" content="${escapeHtml(meta.description)}">
  <link rel="canonical" href="${meta.canonical}">

  <!-- OpenGraph Metadata for Facebook, LinkedIn, WhatsApp, Telegram, Discord -->
  <meta property="og:site_name" content="KorpaBee">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${meta.canonical}">
  <meta property="og:title" content="${escapeHtml(meta.title)}">
  <meta property="og:description" content="${escapeHtml(meta.description)}">
  <meta property="og:image" content="${meta.image}">
  <meta property="og:image:secure_url" content="${meta.image}">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="en_NG">

  <!-- Twitter / X Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@korpabee">
  <meta name="twitter:creator" content="@korpabee">
  <meta name="twitter:title" content="${escapeHtml(meta.title)}">
  <meta name="twitter:description" content="${escapeHtml(meta.description)}">
  <meta name="twitter:image" content="${meta.image}">

  <noscript>
    <meta http-equiv="refresh" content="0;url=${meta.canonical}">
  </noscript>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #070214; color: #fff; padding: 2rem; max-width: 800px; margin: 0 auto;">
  <main>
    <img src="${meta.image}" alt="${escapeHtml(meta.title)}" style="max-width: 100%; border-radius: 12px; margin-bottom: 1.5rem;" />
    <h1 style="font-size: 2rem; line-height: 1.3; margin: 0.5rem 0 1rem 0;">${escapeHtml(meta.title)}</h1>
    <p style="font-size: 1.1rem; line-height: 1.6; color: #b8afdc;">${escapeHtml(meta.description)}</p>
    <p style="margin-top: 2rem;"><a href="${meta.canonical}" style="color: #A38CEB; text-decoration: underline; font-weight: 600;">Visit KorpaBee &rarr;</a></p>
  </main>
</body>
</html>`;

    return new Response(crawlerHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=600, s-maxage=3600',
        'X-Robots-Tag': 'all'
      }
    });
  }

  // 3. For regular browsers, stream and update index.html with HTMLRewriter
  const baseResponse = await getBaseResponse();
  if (!baseResponse) return context.next();

  const rewriter = new HTMLRewriter()
    .on('title', {
      element(e) { e.setInnerContent(meta.title); }
    })
    .on('meta[name="description"]', {
      element(e) { e.setAttribute('content', meta.description); }
    })
    .on('meta[property="og:title"]', {
      element(e) { e.setAttribute('content', meta.title); }
    })
    .on('meta[property="og:description"]', {
      element(e) { e.setAttribute('content', meta.description); }
    })
    .on('meta[property="og:image"]', {
      element(e) { e.setAttribute('content', meta.image); }
    })
    .on('meta[property="og:url"]', {
      element(e) { e.setAttribute('content', meta.canonical); }
    })
    .on('meta[name="twitter:title"]', {
      element(e) { e.setAttribute('content', meta.title); }
    })
    .on('meta[name="twitter:description"]', {
      element(e) { e.setAttribute('content', meta.description); }
    })
    .on('meta[name="twitter:image"]', {
      element(e) { e.setAttribute('content', meta.image); }
    })
    .on('link[rel="canonical"]', {
      element(e) { e.setAttribute('href', meta.canonical); }
    });

  return rewriter.transform(baseResponse);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
