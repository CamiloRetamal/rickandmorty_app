import { createFeatureSelector, createSelector } from '@ngrx/store'
import { EPISODES_SEASON_SELECT_OPTIONS } from '../../../core/constants/ui.constants'
import { SORT_ASC, type SortDirection } from '../../../core/constants/sort-direction.constants'
import { EPISODES_SORT_FIELD } from '../constants/episodes-sort.constants'
import type { Episode } from '../models/episode.model'
import { episodesFeatureKey } from './episodes.reducer'
import type { EpisodesSortField, EpisodesState } from './episodes.state'

export interface SeasonOption {
  value: string
  label: string
}

export const selectEpisodesState = createFeatureSelector<EpisodesState>(episodesFeatureKey)

export const selectEpisodesLoading = createSelector(selectEpisodesState, (s) => s.loading)

export const selectEpisodesError = createSelector(selectEpisodesState, (s) => s.error)

export const selectEpisodesRaw = createSelector(selectEpisodesState, (s) => s.episodes)

export const selectSeasonPrefix = createSelector(selectEpisodesState, (s) => s.seasonPrefix)

export const selectSearchName = createSelector(selectEpisodesState, (s) => s.searchName)

export const selectSort = createSelector(selectEpisodesState, (s) => ({
  sortBy: s.sortBy,
  sortDir: s.sortDir,
}))

export const selectPagination = createSelector(selectEpisodesState, (s) => ({
  page: s.currentPage,
  totalPages: s.totalPages,
  totalCount: s.totalCount,
}))

export function compareEpisodes(
  a: Episode,
  b: Episode,
  sortBy: EpisodesSortField,
  dir: SortDirection,
): number {
  const sign = dir === SORT_ASC ? 1 : -1
  if (sortBy === EPISODES_SORT_FIELD.NAME) {
    return a.name.localeCompare(b.name, 'es') * sign
  }
  if (sortBy === EPISODES_SORT_FIELD.DATE) {
    return (new Date(a.air_date).getTime() - new Date(b.air_date).getTime()) * sign
  }
  return a.episode.localeCompare(b.episode, undefined, { numeric: true }) * sign
}

export const selectEpisodesViewModel = createSelector(
  selectEpisodesRaw,
  selectSort,
  (episodes, { sortBy, sortDir }) =>
    episodes.slice().sort((a, b) => compareEpisodes(a, b, sortBy, sortDir)),
)

const selectEmptyFlags = createSelector(
  selectEpisodesRaw,
  selectEpisodesLoading,
  selectEpisodesError,
  (raw, loading, error) => ({
    emptyApi: !loading && !error && raw.length === 0,
  }),
)

const selectFilters = createSelector(
  selectSearchName,
  selectSeasonPrefix,
  (searchName, seasonPrefix) => ({
    searchName,
    seasonPrefix,
    seasonOptions: EPISODES_SEASON_SELECT_OPTIONS as SeasonOption[],
  }),
)

export const selectEpisodesPageVm = createSelector(
  selectEpisodesViewModel,
  selectEpisodesLoading,
  selectEpisodesError,
  selectPagination,
  selectEmptyFlags,
  selectFilters,
  (episodes, loading, error, pagination, { emptyApi }, filters) => ({
    episodes,
    loading,
    error,
    pagination,
    emptyApi,
    searchName: filters.searchName,
    seasonPrefix: filters.seasonPrefix,
    seasonOptions: filters.seasonOptions,
  }),
)
