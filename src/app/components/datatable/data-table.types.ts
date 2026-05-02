import type { TableColumnKind } from '../../core/constants/table-column-kind.constants'
import type { SortDirection } from '../../core/constants/sort-direction.constants'

export type { SortDirection }
export type { TableColumnKind }

export type DataTableRow = Record<string, unknown>

export interface TableColumn {
  key: string
  label: string
  type?: TableColumnKind
  hidden?: string
  sortable?: boolean
  clickable?: boolean
  width?: string
  minWidth?: string
  maxWidth?: string
  textColor?: string
}

export interface ColumnSortEvent {
  columnKey: string
  direction: SortDirection
}
