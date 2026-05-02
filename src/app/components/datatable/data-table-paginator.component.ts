import { NgTemplateOutlet } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core'
import { DATA_TABLE_UI } from './data-table.constants'
import { getVisiblePages } from './data-table-paginator.utils'

@Component({
  selector: 'app-data-table-paginator',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './data-table-paginator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTablePaginatorComponent {
  readonly totalRecords = input.required<number>()
  readonly recordsPerPage = input(20)
  readonly currentPage = input.required<number>()
  readonly showRecordsPerPage = input(false)
  readonly recordsPerPageReadonly = input(false)
  readonly showVisiblePages = input(true)

  readonly currentPageChange = output<number>()
  readonly recordsPerPageChange = output<number>()

  protected readonly recordsPerPageOptions = [5, 10, 20, 50] as const

  protected readonly localRecordsPerPage = signal(this.recordsPerPage())

  protected readonly effectiveRecordsPerPage = computed<number>(() =>
    this.recordsPerPageReadonly() || !this.showRecordsPerPage()
      ? this.recordsPerPage()
      : this.localRecordsPerPage(),
  )

  protected readonly showRecordsPerPageControl = computed<boolean>(
    () => this.showRecordsPerPage() || this.recordsPerPageReadonly(),
  )

  protected readonly recordsPerPageSelectDisabled = computed<boolean>(
    () => this.recordsPerPageReadonly() || !this.showRecordsPerPage(),
  )

  protected readonly totalPages = computed(() => {
    const total = this.totalRecords()
    const per = this.effectiveRecordsPerPage()
    if (total <= 0) return 0
    return Math.ceil(total / per)
  })

  protected readonly visiblePages = computed(() =>
    getVisiblePages(this.currentPage(), this.totalPages()),
  )

  protected readonly recordsLabel = computed(() =>
    this.totalRecords() !== 1 ? DATA_TABLE_UI.recordPlural : DATA_TABLE_UI.recordSingular,
  )

  constructor() {
    effect(() => {
      this.localRecordsPerPage.set(this.recordsPerPage())
    })
  }

  protected onRecordsPerPageSelectChange(ev: Event): void {
    if (this.recordsPerPageSelectDisabled()) return
    const v = Number((ev.target as HTMLSelectElement).value)
    this.localRecordsPerPage.set(v)
    this.recordsPerPageChange.emit(v)
    this.currentPageChange.emit(1)
  }

  protected goFirst(): void {
    if (this.currentPage() !== 1) this.currentPageChange.emit(1)
  }

  protected goLast(): void {
    const last = this.totalPages()
    if (last > 0 && this.currentPage() !== last) this.currentPageChange.emit(last)
  }

  protected goPrev(): void {
    if (this.currentPage() > 1) this.currentPageChange.emit(this.currentPage() - 1)
  }

  protected goNext(): void {
    const last = this.totalPages()
    if (last > 0 && this.currentPage() < last) {
      this.currentPageChange.emit(this.currentPage() + 1)
    }
  }

  protected goPage(page: number): void {
    this.currentPageChange.emit(page)
  }
}
