import { SORT_ASC, type SortDirection } from '../../../core/constants/sort-direction.constants'
import { EPISODES_SORT_FIELD, type EpisodesSortField } from '../constants/episodes-sort.constants'
import type { Episode } from '../models/episode.model'
import type { EpisodesPageCacheEntry } from '../utils/episodes-cache.utils'

export type { EpisodesSortField }

export interface EpisodesState {
  episodes: Episode[]
  loading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  totalCount: number
  searchName: string
  seasonPrefix: string | null
  sortBy: EpisodesSortField
  sortDir: SortDirection
  pageCache: Record<string, EpisodesPageCacheEntry>
  pageCacheOrder: string[]
}

export const episodesInitialState: EpisodesState = {
  episodes: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  searchName: '',
  seasonPrefix: null,
  sortBy: EPISODES_SORT_FIELD.CODE,
  sortDir: SORT_ASC,
  pageCache: {},
  pageCacheOrder: [],
}
