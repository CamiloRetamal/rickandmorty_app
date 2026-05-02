export const SORT_DIRECTION = {
  ASC: 'asc',
  DESC: 'desc',
} as const

export type SortDirection = (typeof SORT_DIRECTION)[keyof typeof SORT_DIRECTION]

export const SORT_ASC = SORT_DIRECTION.ASC
export const SORT_DESC = SORT_DIRECTION.DESC
