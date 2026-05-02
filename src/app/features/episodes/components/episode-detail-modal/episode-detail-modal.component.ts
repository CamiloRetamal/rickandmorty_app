import { DatePipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core'
import { toObservable, toSignal } from '@angular/core/rxjs-interop'
import { Observable, catchError, map, of, startWith, switchMap } from 'rxjs'
import { BaseModalComponent } from '../../../../components/base-modal/base-modal.component'
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component'
import { EPISODES_UI } from '../../../../core/constants/ui.constants'
import type { Character } from '../../models/character.model'
import type { Episode } from '../../models/episode.model'
import { CharactersApiService } from '../../services/characters-api.service'

interface CharactersVm {
  chars: Character[]
  loading: boolean
  error: string | null
}

const LOADING_STATE: CharactersVm = { chars: [], loading: true, error: null }
const ERROR_STATE: CharactersVm = {
  chars: [],
  loading: false,
  error: EPISODES_UI.detail.charactersLoadError,
}

@Component({
  selector: 'app-episode-detail-modal',
  standalone: true,
  imports: [BaseModalComponent, DatePipe, LoadingSpinnerComponent],
  templateUrl: './episode-detail-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpisodeDetailModalComponent {
  private readonly charactersApi = inject(CharactersApiService)

  readonly episode = input.required<Episode>()

  readonly closed = output<void>()

  protected readonly ui = EPISODES_UI.detail

  protected readonly charactersVm = toSignal(
    toObservable(this.episode).pipe(switchMap((ep) => this.buildCharactersVm$(ep))),
    { initialValue: LOADING_STATE },
  )

  private buildCharactersVm$(ep: Episode): Observable<CharactersVm> {
    return this.charactersApi.getCharactersForEpisode(ep).pipe(
      map((chars): CharactersVm => ({ chars, loading: false, error: null })),
      startWith(LOADING_STATE),
      catchError((): Observable<CharactersVm> => of(ERROR_STATE)),
    )
  }

  protected onClose(): void {
    this.closed.emit()
  }
}
