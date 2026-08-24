const LOCATION_PREFIX = '📍 Location: '
const MAPS_URL_PATTERN = /^https:\/\/www\.google\.com\/maps\?q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)$/

/**
 * Detects whether a chat message's text is a shared-location message
 * (produced by ChatInput's Location attachment button) and extracts its
 * coordinates for rendering a map preview instead of plain text.
 *
 * @param {string} text
 * @returns {null | { latitude: number, longitude: number, mapsUrl: string }}
 */
export function parseLocationMessage(text) {
  if (typeof text !== 'string' || !text.startsWith(LOCATION_PREFIX)) return null

  const url = text.slice(LOCATION_PREFIX.length).trim()
  const match = url.match(MAPS_URL_PATTERN)
  if (!match) return null

  return {
    latitude: parseFloat(match[1]),
    longitude: parseFloat(match[2]),
    mapsUrl: url,
  }
}
