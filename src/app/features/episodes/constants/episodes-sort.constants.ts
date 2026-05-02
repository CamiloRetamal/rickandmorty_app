export const EPISODES_SORT_FIELD = {
  CODE: 'code',
  NAME: 'name',
  DATE: 'date',
} as const

export type EpisodesSortField = (typeof EPISODES_SORT_FIELD)[keyof typeof EPISODES_SORT_FIELD]

export const EPISODES_LIST_COLUMN_KEY = {
  EPISODE: 'episode',
  NAME: 'name',
  AIR_DATE: 'air_date',
} as const

export type EpisodesListColumnKey =
  (typeof EPISODES_LIST_COLUMN_KEY)[keyof typeof EPISODES_LIST_COLUMN_KEY]

export const EPISODES_SORT_FIELD_TO_LIST_COLUMN: Record<EpisodesSortField, EpisodesListColumnKey> =
  {
    [EPISODES_SORT_FIELD.CODE]: EPISODES_LIST_COLUMN_KEY.EPISODE,
    [EPISODES_SORT_FIELD.NAME]: EPISODES_LIST_COLUMN_KEY.NAME,
    [EPISODES_SORT_FIELD.DATE]: EPISODES_LIST_COLUMN_KEY.AIR_DATE,
  }

export const EPISODES_LIST_COLUMN_TO_SORT_FIELD: Record<EpisodesListColumnKey, EpisodesSortField> =
  {
    [EPISODES_LIST_COLUMN_KEY.EPISODE]: EPISODES_SORT_FIELD.CODE,
    [EPISODES_LIST_COLUMN_KEY.NAME]: EPISODES_SORT_FIELD.NAME,
    [EPISODES_LIST_COLUMN_KEY.AIR_DATE]: EPISODES_SORT_FIELD.DATE,
  }

export function sortFieldToListColumnKey(sortBy: EpisodesSortField): EpisodesListColumnKey {
  return EPISODES_SORT_FIELD_TO_LIST_COLUMN[sortBy]
}

export function listColumnKeyToSortField(columnKey: string): EpisodesSortField {
  if (columnKey in EPISODES_LIST_COLUMN_TO_SORT_FIELD) {
    return EPISODES_LIST_COLUMN_TO_SORT_FIELD[columnKey as EpisodesListColumnKey]
  }
  return EPISODES_SORT_FIELD.CODE
}
