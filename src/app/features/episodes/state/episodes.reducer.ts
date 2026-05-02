import { createReducer, on } from '@ngrx/store'
import {
  EPISODES_PAGE_CACHE_MAX_ENTRIES,
  applyPageCacheWithLruLimit,
  buildEpisodesCacheKey,
  touchEpisodesCacheKeyOrder,
} from '../utils/episodes-cache.utils'
import { EpisodesActions } from './episodes.actions'
import { episodesInitialState, type EpisodesState } from './episodes.state'

export const episodesFeatureKey = 'episodes'

export const episodesReducer = createReducer(
  episodesInitialState,

  on(EpisodesActions.loadEpisodes, (state, { page }): EpisodesState => {
    const key = buildEpisodesCacheKey(page, state.searchName, state.seasonPrefix)
    const cached = state.pageCache[key]
    if (cached) {
      return {
        ...state,
        loading: false,
        error: null,
        currentPage: page,
        episodes: [...cached.episodes],
        totalPages: cached.totalPages,
        totalCount: cached.totalCount,
        pageCacheOrder: touchEpisodesCacheKeyOrder(state.pageCacheOrder, key),
      }
    }
    return {
      ...state,
      loading: true,
      error: null,
      currentPage: page,
    }
  }),

  on(
    EpisodesActions.loadEpisodesSuccess,
    (state, { episodes, page, totalPages, totalCount }): EpisodesState => {
      const key = buildEpisodesCacheKey(page, state.searchName, state.seasonPrefix)
      const entry = {
        episodes: [...episodes],
        totalPages,
        totalCount,
      }
      const { pageCache, order } = applyPageCacheWithLruLimit(
        state.pageCache,
        state.pageCacheOrder,
        key,
        entry,
        EPISODES_PAGE_CACHE_MAX_ENTRIES,
      )
      return {
        ...state,
        loading: false,
        error: null,
        episodes,
        currentPage: page,
        totalPages,
        totalCount,
        pageCache,
        pageCacheOrder: order,
      }
    },
  ),

  on(
    EpisodesActions.loadEpisodesFailure,
    (state, { error }): EpisodesState => ({
      ...state,
      loading: false,
      error,
    }),
  ),

  on(
    EpisodesActions.changePage,
    (state, { page }): EpisodesState => ({
      ...state,
      currentPage: page,
    }),
  ),

  on(
    EpisodesActions.changeSearch,
    (state, { name }): EpisodesState => ({
      ...state,
      searchName: name,
      pageCache: {},
      pageCacheOrder: [],
    }),
  ),

  on(
    EpisodesActions.changeSeason,
    (state, { seasonPrefix }): EpisodesState => ({
      ...state,
      seasonPrefix,
      pageCache: {},
      pageCacheOrder: [],
    }),
  ),

  on(
    EpisodesActions.changeSort,
    (state, { sortBy, sortDir }): EpisodesState => ({
      ...state,
      sortBy,
      sortDir,
    }),
  ),

  on(
    EpisodesActions.clearError,
    (state): EpisodesState => ({
      ...state,
      error: null,
    }),
  ),
)
