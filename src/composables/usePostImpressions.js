/**
 * usePostImpressions — scroll-based impression tracker
 *
 * Usage: call trackPost(el, uuid) when a PostCard mounts.
 * The composable batches UUIDs and flushes to /posts/impressions every 30s
 * or on page hide/unload — whichever comes first.
 *
 * Dedup per browser session: each UUID is flushed at most once while the
 * tab is open. Reopening the app counts again (acceptable for social metrics).
 */
import { onUnmounted } from 'vue'
import client from '@/api/client'

// ── Module-level singletons so all PostCard instances share one observer ──────
let observer = null
const pending = new Set()   // UUIDs that have qualified (50% visible ≥ 500ms)
const seen    = new Set()   // Per-session dedup — loaded from sessionStorage once

// Restore previously-seen set across hot reloads
try {
  const stored = sessionStorage.getItem('kb_seen_posts')
  if (stored) JSON.parse(stored).forEach(uuid => seen.add(uuid))
} catch { /* ignore */ }

const dwellTimers = new Map()  // element → timeout handle

let flushTimer = null

function startFlushTimer() {
  if (flushTimer) return
  flushTimer = setInterval(flush, 30_000)
}

async function flush() {
  const uuids = [...pending]
  if (!uuids.length) return
  pending.clear()

  // Persist seen set so page hide + reopen doesn't re-fire same UUIDs
  try {
    sessionStorage.setItem('kb_seen_posts', JSON.stringify([...seen]))
  } catch { /* ignore quota errors */ }

  try {
    await client.post('/posts/impressions', { uuids })
  } catch { /* silent — offline guard in client.js handles gracefully */ }
}

function onIntersect(entries) {
  entries.forEach(entry => {
    const uuid = entry.target.dataset.postUuid
    if (!uuid || seen.has(uuid)) return

    if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
      // Start dwell timer — only count if visible for ≥ 500ms
      if (!dwellTimers.has(entry.target)) {
        const handle = setTimeout(() => {
          if (!seen.has(uuid)) {
            seen.add(uuid)
            pending.add(uuid)
          }
          dwellTimers.delete(entry.target)
        }, 500)
        dwellTimers.set(entry.target, handle)
      }
    } else {
      // Scrolled away before dwell — cancel timer
      const handle = dwellTimers.get(entry.target)
      if (handle) {
        clearTimeout(handle)
        dwellTimers.delete(entry.target)
      }
    }
  })
}

function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(onIntersect, {
      threshold: [0.5],
    })
    startFlushTimer()

    // Flush on page hide (tab switch, minimize, navigation) and unload
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flush()
    })
    window.addEventListener('beforeunload', flush, { once: false })
  }
  return observer
}

// ── Public composable ─────────────────────────────────────────────────────────

/**
 * Call inside a PostCard setup() to register the card's root element.
 *
 * @param {Ref<HTMLElement|null>} elRef  - template ref to the card root
 * @param {string}               uuid   - post uuid
 */
export function usePostImpressions(elRef, uuid) {
  let observed = null

  function register() {
    if (!elRef.value || !uuid) return
    const el = elRef.value
    el.dataset.postUuid = uuid
    getObserver().observe(el)
    observed = el
  }

  function unregister() {
    if (observed) {
      getObserver().unobserve(observed)
      const handle = dwellTimers.get(observed)
      if (handle) {
        clearTimeout(handle)
        dwellTimers.delete(observed)
      }
      observed = null
    }
  }

  onUnmounted(unregister)

  return { register, unregister }
}
