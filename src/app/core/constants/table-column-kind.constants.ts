export const TABLE_COLUMN_KIND = {
  TEXT: 'text',
  ACTIONS: 'actions',
} as const

export type TableColumnKind = (typeof TABLE_COLUMN_KIND)[keyof typeof TABLE_COLUMN_KIND]
