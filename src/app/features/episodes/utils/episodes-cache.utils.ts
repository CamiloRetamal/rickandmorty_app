import type { Episode } from '../models/episode.model'

export interface EpisodesPageCacheEntry {
  episodes: Episode[]
  totalPages: number
  totalCount: number
}

export const EPISODES_PAGE_CACHE_MAX_ENTRIES = 16

const KEY_SEP = '\u0000'

export function buildEpisodesCacheKey(
  page: number,
  searchName: string,
  seasonPrefix: string | null,
): string {
  return [String(page), searchName.trim(), seasonPrefix?.trim() ?? ''].join(KEY_SEP)
}

export function touchEpisodesCacheKeyOrder(order: readonly string[], key: string): string[] {
  const without = order.filter((k) => k !== key)
  return [...without, key]
}

export function applyPageCacheWithLruLimit(
  pageCache: Readonly<Record<string, EpisodesPageCacheEntry>>,
  order: readonly string[],
  key: string,
  entry: EpisodesPageCacheEntry,
  maxEntries: number,
): { pageCache: Record<string, EpisodesPageCacheEntry>; order: string[] } {
  let nextOrder = touchEpisodesCacheKeyOrder(order, key)
  let nextCache: Record<string, EpisodesPageCacheEntry> = { ...pageCache, [key]: entry }
  while (nextOrder.length > maxEntries) {
    const evict = nextOrder[0]
    if (evict === undefined) break
    nextOrder = nextOrder.slice(1)
    const rest = { ...nextCache }
    delete rest[evict]
    nextCache = rest
  }
  return { pageCache: nextCache, order: nextOrder }
}
