import { createActionGroup, emptyProps, props } from '@ngrx/store'
import type { Episode } from '../models/episode.model'
import type { SortDirection } from '../../../core/constants/sort-direction.constants'
import type { EpisodesSortField } from './episodes.state'

export const EpisodesActions = createActionGroup({
  source: 'Episodes',
  events: {
    'Load Episodes': props<{ page: number }>(),
    'Load Episodes Success': props<{
      episodes: Episode[]
      page: number
      totalPages: number
      totalCount: number
    }>(),
    'Load Episodes Failure': props<{ error: string }>(),
    'Change Page': props<{ page: number }>(),
    'Change Search': props<{ name: string }>(),
    'Change Season': props<{ seasonPrefix: string | null }>(),
    'Change Sort': props<{
      sortBy: EpisodesSortField
      sortDir: SortDirection
    }>(),
    'Clear Error': emptyProps(),
  },
})
