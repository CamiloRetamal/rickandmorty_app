import { NgClass } from '@angular/common'
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'
import { Eye, LucideAngularModule } from 'lucide-angular'
import { TABLE_COLUMN_KIND } from '../../core/constants/table-column-kind.constants'
import { SORT_ASC } from '../../core/constants/sort-direction.constants'
import { nextSortDirectionForColumnClick } from '../../core/utils/sort-direction.utils'
import {
  DATA_TABLE_DEFAULT_EMPTY_MESSAGE,
  DATA_TABLE_DEFAULT_HEADER_COLOR,
  DATA_TABLE_UI,
} from './data-table.constants'
import { DataTablePaginatorComponent } from './data-table-paginator.component'
import type { ColumnSortEvent, DataTableRow, SortDirection, TableColumn } from './data-table.types'

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [NgClass, DataTablePaginatorComponent, LucideAngularModule],
  templateUrl: './data-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent {
  protected readonly columnKind = TABLE_COLUMN_KIND

  readonly data = input.required<readonly DataTableRow[]>()
  readonly columns = input.required<readonly TableColumn[]>()

  readonly headerColor = input<string>(DATA_TABLE_DEFAULT_HEADER_COLOR)
  readonly emptyMessage = input<string>(DATA_TABLE_DEFAULT_EMPTY_MESSAGE)
  readonly compact = input(false)
  readonly viewActionLabel = input<string>(DATA_TABLE_UI.viewActionLabel)

  protected readonly viewActionIcon = Eye

  readonly rowKey = input<string>('id')

  readonly showPagination = input(false)
  readonly totalRecords = input(0)
  readonly recordsPerPage = input(20)
  readonly currentPage = input(1)
  readonly showRecordsPerPage = input(false)
  readonly recordsPerPageReadonly = input(false)
  readonly showVisiblePages = input(true)

  readonly activeSortColumnKey = input<string | null>(null)
  readonly activeSortDirection = input<SortDirection>(SORT_ASC)

  readonly getRowClass = input<(row: DataTableRow) => string | undefined>()

  readonly rowClick = output<DataTableRow>()
  readonly cellClick = output<{ row: DataTableRow; columnKey: string }>()
  readonly columnSort = output<ColumnSortEvent>()
  readonly currentPageChange = output<number>()
  readonly recordsPerPageChange = output<number>()

  protected onSortClick(column: TableColumn, ev: Event): void {
    ev.stopPropagation()
    if (!column.sortable) return
    const key = column.key
    const direction = nextSortDirectionForColumnClick(
      this.activeSortColumnKey(),
      key,
      this.activeSortDirection(),
    )
    this.columnSort.emit({ columnKey: key, direction })
  }

  protected onRowClick(row: DataTableRow): void {
    this.rowClick.emit(row)
  }

  protected onViewClick(row: DataTableRow, ev: Event): void {
    ev.stopPropagation()
    this.rowClick.emit(row)
  }

  protected onCellClick(row: DataTableRow, column: TableColumn, ev: Event): void {
    if (!column.clickable) return
    ev.stopPropagation()
    this.cellClick.emit({ row, columnKey: column.key })
  }

  protected getCellValue(row: DataTableRow, key: string): unknown {
    return row[key]
  }

  protected asString(value: unknown): string {
    if (value === null || value === undefined) return ''
    return String(value)
  }

  protected cellTitle(row: DataTableRow, column: TableColumn): string | null {
    if (column.type === TABLE_COLUMN_KIND.ACTIONS) return null
    const s = this.asString(this.getCellValue(row, column.key))
    return s.length > 28 ? s : null
  }

  protected rowTrackValue(row: DataTableRow): string | number {
    const k = this.rowKey()
    const v = row[k]
    if (typeof v === 'number' || typeof v === 'string') return v
    return JSON.stringify(row)
  }

  protected rowClass(row: DataTableRow): string {
    return this.getRowClass()?.(row) ?? 'hover:bg-gray-50 dark:hover:bg-slate-700/60'
  }

  protected rowClassesCombined(row: DataTableRow): string {
    return `cursor-pointer transition-colors ${this.rowClass(row)}`
  }

  protected headerCellClass(column: TableColumn): string[] {
    const pad = this.compact() ? 'px-1.5 py-2 sm:px-2' : 'px-2 py-3 sm:px-3'
    const align = column.type === TABLE_COLUMN_KIND.ACTIONS ? 'text-center' : 'text-left'
    const shrink = column.type === TABLE_COLUMN_KIND.ACTIONS ? '' : 'min-w-0'
    const base = `${align} text-xs font-medium uppercase tracking-wider text-nowrap text-white`
    return [base, pad, shrink, column.hidden ?? ''].filter(Boolean)
  }

  protected bodyCellClass(column: TableColumn): string[] {
    const pad = this.compact() ? 'px-1.5 py-1.5 text-xs sm:px-2' : 'px-2 py-2 text-sm sm:px-3'
    const textShrink = column.type === TABLE_COLUMN_KIND.ACTIONS ? '' : 'min-w-0 align-middle'
    const align = column.type === TABLE_COLUMN_KIND.ACTIONS ? 'text-center align-middle' : ''
    const textTone = column.textColor ?? 'text-gray-600 dark:text-slate-300'
    return [pad, column.hidden ?? '', textTone, textShrink, align].filter(Boolean)
  }

  protected onPageChange(page: number): void {
    this.currentPageChange.emit(page)
  }

  protected onRecordsPerPageChange(n: number): void {
    this.recordsPerPageChange.emit(n)
  }
}
