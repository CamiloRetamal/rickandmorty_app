import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core'
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop'
import { FormControl } from '@angular/forms'
import { Store } from '@ngrx/store'
import { AppFormInputComponent } from '../../../../components/form/app-form-input.component'
import { AppFormSelectComponent } from '../../../../components/form/app-form-select.component'
import { DataTableComponent } from '../../../../components/datatable/data-table.component'
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component'
import type {
  ColumnSortEvent,
  DataTableRow,
} from '../../../../components/datatable/data-table.types'
import { pageCardReveal } from '../../../../core/animations/ui.animations'
import { EPISODES_UI } from '../../../../core/constants/ui.constants'
import {
  EPISODES_TABLE_COLUMNS,
  EPISODES_TABLE_PAGINATION,
} from '../../constants/episodes-datatable.constants'
import {
  listColumnKeyToSortField,
  sortFieldToListColumnKey,
} from '../../constants/episodes-sort.constants'
import type { Episode } from '../../models/episode.model'
import { EpisodesActions } from '../../state/episodes.actions'
import { selectEpisodesPageVm, selectSort } from '../../state/episodes.selectors'
import {
  dataTableRowToEpisode,
  episodesToDataTableRows,
} from '../../utils/episode-data-table.mappers'
import { EpisodeDetailModalComponent } from '../episode-detail-modal/episode-detail-modal.component'

@Component({
  selector: 'app-episodes-page',
  standalone: true,
  imports: [
    AppFormInputComponent,
    AppFormSelectComponent,
    DataTableComponent,
    EpisodeDetailModalComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './episodes-page.component.html',
  styleUrl: './episodes-page.component.scss',
  animations: [pageCardReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpisodesPageComponent implements OnInit {
  protected readonly ui = EPISODES_UI
  protected readonly episodesColumns = EPISODES_TABLE_COLUMNS
  protected readonly tablePagination = EPISODES_TABLE_PAGINATION

  private readonly store = inject(Store)
  private readonly destroyRef = inject(DestroyRef)

  protected readonly vm = toSignal(this.store.select(selectEpisodesPageVm), {
    requireSync: true,
  })
  protected readonly sort = toSignal(this.store.select(selectSort), {
    requireSync: true,
  })

  protected readonly searchControl = new FormControl('', { nonNullable: true })
  protected readonly detailEpisode = signal<Episode | null>(null)

  protected readonly episodeRows = computed<DataTableRow[]>(() =>
    episodesToDataTableRows(this.vm().episodes),
  )

  protected readonly activeSortColumnKey = computed(() =>
    sortFieldToListColumnKey(this.sort().sortBy),
  )

  protected readonly seasonSelectValue = computed(() => this.vm().seasonPrefix ?? '')

  protected readonly episodesRowClassFn = (): string | undefined =>
    'hover:bg-teal-50/60 focus-within:bg-teal-50/60 dark:hover:bg-teal-950/40 dark:focus-within:bg-teal-950/40'

  ngOnInit(): void {
    this.store.dispatch(EpisodesActions.loadEpisodes({ page: 1 }))

    this.searchControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((name) => this.store.dispatch(EpisodesActions.changeSearch({ name })))
  }

  protected onSeasonChange(value: string): void {
    this.store.dispatch(EpisodesActions.changeSeason({ seasonPrefix: value || null }))
  }

  protected onDataTableSort(ev: ColumnSortEvent): void {
    const sortBy = listColumnKeyToSortField(ev.columnKey)
    this.store.dispatch(EpisodesActions.changeSort({ sortBy, sortDir: ev.direction }))
  }

  protected onDataTablePage(page: number): void {
    this.store.dispatch(EpisodesActions.changePage({ page }))
  }

  protected onDataTableRow(row: DataTableRow): void {
    this.openDetail(dataTableRowToEpisode(row))
  }

  protected openDetail(episode: Episode): void {
    this.detailEpisode.set(episode)
  }

  protected closeDetail(): void {
    this.detailEpisode.set(null)
  }

  protected retry(): void {
    this.store.dispatch(EpisodesActions.loadEpisodes({ page: this.vm().pagination.page }))
  }
}
