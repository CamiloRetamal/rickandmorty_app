import type { DataTableRow } from '../../../components/datatable/data-table.types'
import type { Episode } from '../models/episode.model'

export function episodesToDataTableRows(episodes: readonly Episode[]): DataTableRow[] {
  return episodes as unknown as DataTableRow[]
}

export function dataTableRowToEpisode(row: DataTableRow): Episode {
  return row as unknown as Episode
}
