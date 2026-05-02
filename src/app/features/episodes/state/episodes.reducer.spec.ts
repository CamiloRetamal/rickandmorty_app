import { buildEpisodesCacheKey } from '../utils/episodes-cache.utils'
import { EpisodesActions } from './episodes.actions'
import { episodesReducer } from './episodes.reducer'
import { episodesInitialState } from './episodes.state'

describe('episodesReducer', () => {
  it('should set loading=true and clear error on loadEpisodes', () => {
    const state = episodesReducer(
      { ...episodesInitialState, error: 'prev error' },
      EpisodesActions.loadEpisodes({ page: 2 }),
    )
    expect(state.loading).toBeTrue()
    expect(state.error).toBeNull()
    expect(state.currentPage).toBe(2)
  })

  it('should NOT mutate searchName on loadEpisodes (owned by changeSearch)', () => {
    const withSearch = episodesReducer(
      episodesInitialState,
      EpisodesActions.changeSearch({ name: 'rick' }),
    )
    const afterLoad = episodesReducer(withSearch, EpisodesActions.loadEpisodes({ page: 1 }))
    expect(afterLoad.searchName).toBe('rick')
  })

  it('should update searchName only via changeSearch', () => {
    const state = episodesReducer(
      episodesInitialState,
      EpisodesActions.changeSearch({ name: 'morty' }),
    )
    expect(state.searchName).toBe('morty')
  })

  it('should store episodes and metadata on success', () => {
    const loading = episodesReducer(episodesInitialState, EpisodesActions.loadEpisodes({ page: 1 }))
    const state = episodesReducer(
      loading,
      EpisodesActions.loadEpisodesSuccess({
        episodes: [
          {
            id: 1,
            name: 'Pilot',
            air_date: 'December 2, 2013',
            episode: 'S01E01',
            characters: [],
            url: '',
            created: '',
          },
        ],
        page: 1,
        totalPages: 3,
        totalCount: 41,
      }),
    )
    expect(state.loading).toBeFalse()
    expect(state.episodes.length).toBe(1)
    expect(state.totalPages).toBe(3)
    expect(state.totalCount).toBe(41)
  })

  it('should set error and clear loading on failure', () => {
    const loading = episodesReducer(episodesInitialState, EpisodesActions.loadEpisodes({ page: 1 }))
    const state = episodesReducer(
      loading,
      EpisodesActions.loadEpisodesFailure({ error: 'Network error' }),
    )
    expect(state.loading).toBeFalse()
    expect(state.error).toBe('Network error')
  })

  it('should merge pageCache on loadEpisodesSuccess', () => {
    const pilot = {
      id: 1,
      name: 'Pilot',
      air_date: 'December 2, 2013',
      episode: 'S01E01',
      characters: [] as string[],
      url: '',
      created: '',
    }
    const afterP1 = episodesReducer(
      episodesReducer(episodesInitialState, EpisodesActions.loadEpisodes({ page: 1 })),
      EpisodesActions.loadEpisodesSuccess({
        episodes: [pilot],
        page: 1,
        totalPages: 3,
        totalCount: 41,
      }),
    )
    const key1 = buildEpisodesCacheKey(1, '', null)
    expect(afterP1.pageCache[key1].episodes.length).toBe(1)

    const afterP2 = episodesReducer(
      episodesReducer(afterP1, EpisodesActions.loadEpisodes({ page: 2 })),
      EpisodesActions.loadEpisodesSuccess({
        episodes: [{ ...pilot, id: 2, name: 'Lawnmower Dog', episode: 'S01E02' }],
        page: 2,
        totalPages: 3,
        totalCount: 41,
      }),
    )
    const key2 = buildEpisodesCacheKey(2, '', null)
    expect(afterP2.pageCache[key1].episodes[0].name).toBe('Pilot')
    expect(afterP2.pageCache[key2].episodes[0].name).toBe('Lawnmower Dog')
  })

  it('should apply cache on loadEpisodes without loading when entry exists', () => {
    const pilot = {
      id: 1,
      name: 'Pilot',
      air_date: 'December 2, 2013',
      episode: 'S01E01',
      characters: [] as string[],
      url: '',
      created: '',
    }
    const withCache = episodesReducer(
      episodesReducer(episodesInitialState, EpisodesActions.loadEpisodes({ page: 1 })),
      EpisodesActions.loadEpisodesSuccess({
        episodes: [pilot],
        page: 1,
        totalPages: 3,
        totalCount: 41,
      }),
    )
    const fromCache = episodesReducer(withCache, EpisodesActions.loadEpisodes({ page: 1 }))
    expect(fromCache.loading).toBeFalse()
    expect(fromCache.episodes[0].name).toBe('Pilot')
    expect(fromCache.totalPages).toBe(3)
  })

  it('should clear pageCache on changeSearch', () => {
    const pilot = {
      id: 1,
      name: 'Pilot',
      air_date: 'December 2, 2013',
      episode: 'S01E01',
      characters: [] as string[],
      url: '',
      created: '',
    }
    const withCache = episodesReducer(
      episodesReducer(episodesInitialState, EpisodesActions.loadEpisodes({ page: 1 })),
      EpisodesActions.loadEpisodesSuccess({
        episodes: [pilot],
        page: 1,
        totalPages: 3,
        totalCount: 41,
      }),
    )
    expect(Object.keys(withCache.pageCache).length).toBeGreaterThan(0)
    const cleared = episodesReducer(withCache, EpisodesActions.changeSearch({ name: 'x' }))
    expect(cleared.pageCache).toEqual({})
    expect(cleared.pageCacheOrder).toEqual([])
  })

  it('should clear pageCache on changeSeason', () => {
    const pilot = {
      id: 1,
      name: 'Pilot',
      air_date: 'December 2, 2013',
      episode: 'S01E01',
      characters: [] as string[],
      url: '',
      created: '',
    }
    const withCache = episodesReducer(
      episodesReducer(episodesInitialState, EpisodesActions.loadEpisodes({ page: 1 })),
      EpisodesActions.loadEpisodesSuccess({
        episodes: [pilot],
        page: 1,
        totalPages: 3,
        totalCount: 41,
      }),
    )
    const cleared = episodesReducer(
      withCache,
      EpisodesActions.changeSeason({ seasonPrefix: 'S01' }),
    )
    expect(cleared.pageCache).toEqual({})
    expect(cleared.pageCacheOrder).toEqual([])
  })

  it('should bump pageCacheOrder on cache hit (LRU touch)', () => {
    const pilot = {
      id: 1,
      name: 'Pilot',
      air_date: 'December 2, 2013',
      episode: 'S01E01',
      characters: [] as string[],
      url: '',
      created: '',
    }
    const key1 = buildEpisodesCacheKey(1, '', null)
    const key2 = buildEpisodesCacheKey(2, '', null)
    const afterTwo = episodesReducer(
      episodesReducer(
        episodesReducer(episodesInitialState, EpisodesActions.loadEpisodes({ page: 1 })),
        EpisodesActions.loadEpisodesSuccess({
          episodes: [pilot],
          page: 1,
          totalPages: 3,
          totalCount: 41,
        }),
      ),
      EpisodesActions.loadEpisodesSuccess({
        episodes: [{ ...pilot, id: 2, name: 'B', episode: 'S01E02' }],
        page: 2,
        totalPages: 3,
        totalCount: 41,
      }),
    )
    expect(afterTwo.pageCacheOrder).toEqual([key1, key2])
    const hitP1 = episodesReducer(afterTwo, EpisodesActions.loadEpisodes({ page: 1 }))
    expect(hitP1.pageCacheOrder).toEqual([key2, key1])
  })
})
