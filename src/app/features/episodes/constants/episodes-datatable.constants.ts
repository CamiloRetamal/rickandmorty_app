import type { TableColumn } from '../../../components/datatable/data-table.types'
import { RICK_MORTY_API } from '../../../core/constants/api.constants'
import { EPISODES_UI } from '../../../core/constants/ui.constants'
import { TABLE_COLUMN_KIND } from '../../../core/constants/table-column-kind.constants'
import { EPISODES_LIST_COLUMN_KEY } from './episodes-sort.constants'

export const EPISODES_TABLE_PAGINATION = {
  showPagination: true,
  recordsPerPage: RICK_MORTY_API.pageSize,
  showRecordsPerPage: false,
  recordsPerPageReadonly: true,
  showVisiblePages: true,
} as const

export const EPISODES_TABLE_COLUMNS: readonly TableColumn[] = [
  {
    key: EPISODES_LIST_COLUMN_KEY.EPISODE,
    label: 'Código',
    sortable: true,
    width: '6.25rem',
    minWidth: '6.25rem',
  },
  {
    key: EPISODES_LIST_COLUMN_KEY.NAME,
    label: 'Nombre',
    sortable: true,
    minWidth: '0',
  },
  {
    key: EPISODES_LIST_COLUMN_KEY.AIR_DATE,
    label: 'Emisión',
    sortable: true,
    width: '9rem',
    minWidth: '9rem',
    hidden: 'hidden md:table-cell',
  },
  {
    key: '_actions',
    label: EPISODES_UI.table.actions,
    type: TABLE_COLUMN_KIND.ACTIONS,
    sortable: false,
    width: '7rem',
    minWidth: '7rem',
  },
]
