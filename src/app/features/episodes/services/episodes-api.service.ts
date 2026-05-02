import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { RICK_MORTY_API } from '../../../core/constants/api.constants'
import type { Episode } from '../models/episode.model'
import type { PagedResponse } from '../models/paged-response.model'

@Injectable({ providedIn: 'root' })
export class EpisodesApiService {
  private readonly http = inject(HttpClient)
  private readonly base = RICK_MORTY_API.baseUrl

  getEpisodes(
    page: number,
    name?: string,
    episodePrefix?: string | null,
  ): Observable<PagedResponse<Episode>> {
    let params = new HttpParams().set('page', String(page))
    const trimmedName = name?.trim()
    if (trimmedName) {
      params = params.set('name', trimmedName)
    }
    const trimmedEp = episodePrefix?.trim()
    if (trimmedEp) {
      params = params.set('episode', trimmedEp)
    }
    return this.http.get<PagedResponse<Episode>>(`${this.base}/episode`, {
      params,
    })
  }
}
