import {
  type EpisodesPageCacheEntry,
  applyPageCacheWithLruLimit,
  touchEpisodesCacheKeyOrder,
} from './episodes-cache.utils'

const emptyEntry: EpisodesPageCacheEntry = { episodes: [], totalPages: 1, totalCount: 0 }

describe('touchEpisodesCacheKeyOrder', () => {
  it('moves key to the end (MRU)', () => {
    expect(touchEpisodesCacheKeyOrder(['a', 'b', 'c'], 'a')).toEqual(['b', 'c', 'a'])
  })

  it('appends new key', () => {
    expect(touchEpisodesCacheKeyOrder(['a'], 'b')).toEqual(['a', 'b'])
  })
})

describe('applyPageCacheWithLruLimit', () => {
  it('evicts least-recently-used when over maxEntries', () => {
    const k1 = '1\x00\x00'
    const k2 = '2\x00\x00'
    const k3 = '3\x00\x00'
    const k4 = '4\x00\x00'
    let cache: Record<string, EpisodesPageCacheEntry> = {}
    let order: string[] = []

    const step = (key: string) => {
      const r = applyPageCacheWithLruLimit(cache, order, key, emptyEntry, 3)
      cache = r.pageCache
      order = r.order
    }

    step(k1)
    step(k2)
    step(k3)
    expect(Object.keys(cache).sort()).toEqual([k1, k2, k3].sort())

    step(k4)
    expect(cache[k1]).toBeUndefined()
    expect(cache[k2]).toBeDefined()
    expect(cache[k3]).toBeDefined()
    expect(cache[k4]).toBeDefined()
    expect(order).toEqual([k2, k3, k4])
  })

  it('refreshing an existing key does not grow count', () => {
    const k1 = '1\x00\x00'
    const k2 = '2\x00\x00'
    let r = applyPageCacheWithLruLimit({}, [], k1, emptyEntry, 3)
    r = applyPageCacheWithLruLimit(r.pageCache, r.order, k2, emptyEntry, 3)
    r = applyPageCacheWithLruLimit(r.pageCache, r.order, k1, { ...emptyEntry, totalCount: 99 }, 3)
    expect(Object.keys(r.pageCache).length).toBe(2)
    expect(r.pageCache[k1].totalCount).toBe(99)
    expect(r.order).toEqual([k2, k1])
  })
})
