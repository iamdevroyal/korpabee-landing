import client from './client'

// ── Ad serving (user-facing) ──────────────────────────────────────────────────

/**
 * Fetch the next ad for the given context.
 * Returns { data: { ad, tracking_token, token_timestamp, expires_at } }
 * Returns 204 status for Pro users (ad-free).
 */
export const getNextAd = (context = 'feed') =>
  client.get('/ads/next', { params: { context } })

/**
 * Fetch a sidebar ad (desktop layout, independent of feed gap counter).
 */
export const getSidebarAd = () => client.get('/ads/sidebar')

/**
 * Report a validated impression to the server.
 * token + tokenTimestamp come from the getNextAd response.
 */
export const recordImpression = (payload) =>
  client.post('/ads/impression', payload)

/**
 * Record a CTA click on any non-carousel ad (image, video, sidebar).
 * @param {string} adUuid   UUID of the campaign that was clicked
 * @param {Object} payload  { tracking_token, token_timestamp, context }
 */
export const recordClick = (adUuid, payload) =>
  client.post(`/ads/${adUuid}/click`, payload)

/**
 * Record a carousel card click.
 * @param {string} adUuid
 * @param {Object} payload { carousel_item_id, tracking_token, token_timestamp }
 */
export const recordCarouselClick = (adUuid, payload) =>
  client.post(`/ads/${adUuid}/carousel-click`, payload)
