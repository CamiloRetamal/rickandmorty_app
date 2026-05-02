import { HttpErrorResponse } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import {
  EMPTY,
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  switchMap,
  withLatestFrom,
} from 'rxjs'
import { mapHttpError } from '../../../core/utils/http-error.util'
import { EpisodesApiService } from '../services/episodes-api.service'
import { buildEpisodesCacheKey } from '../utils/episodes-cache.utils'
import { EpisodesActions } from './episodes.actions'
import { selectEpisodesState } from './episodes.selectors'

@Injectable()
export class EpisodesEffects {
  private readonly actions$ = inject(Actions)
  private readonly api = inject(EpisodesApiService)
  private readonly store = inject(Store)

  loadEpisodes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EpisodesActions.loadEpisodes),
      withLatestFrom(this.store.select(selectEpisodesState)),
      switchMap(([{ page }, state]) => {
        const key = buildEpisodesCacheKey(page, state.searchName, state.seasonPrefix)
        if (state.pageCache[key]) {
          return EMPTY
        }
        return this.api.getEpisodes(page, state.searchName, state.seasonPrefix).pipe(
          map((res) =>
            EpisodesActions.loadEpisodesSuccess({
              episodes: res.results,
              page,
              totalPages: Math.max(1, res.info.pages),
              totalCount: res.info.count,
            }),
          ),
          catchError((err) => {
            if (err instanceof HttpErrorResponse && err.status === 404) {
              return of(
                EpisodesActions.loadEpisodesSuccess({
                  episodes: [],
                  page,
                  totalPages: 1,
                  totalCount: 0,
                }),
              )
            }
            return of(
              EpisodesActions.loadEpisodesFailure({
                error: mapHttpError(err),
              }),
            )
          }),
        )
      }),
    ),
  )

  searchChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EpisodesActions.changeSearch),
      debounceTime(400),
      distinctUntilChanged((a, b) => a.name === b.name),
      map(() => EpisodesActions.loadEpisodes({ page: 1 })),
    ),
  )

  pageChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EpisodesActions.changePage),
      map(({ page }) => EpisodesActions.loadEpisodes({ page })),
    ),
  )

  seasonChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EpisodesActions.changeSeason),
      map(() => EpisodesActions.loadEpisodes({ page: 1 })),
    ),
  )
}
