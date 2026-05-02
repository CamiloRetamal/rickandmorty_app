import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable, map, of } from 'rxjs'
import { RICK_MORTY_API } from '../../../core/constants/api.constants'
import type { Character } from '../models/character.model'
import type { Episode } from '../models/episode.model'

const CHARACTER_SAMPLE_LIMIT = 18

@Injectable({ providedIn: 'root' })
export class CharactersApiService {
  private readonly http = inject(HttpClient)
  private readonly base = RICK_MORTY_API.baseUrl

  getCharactersForEpisode(episode: Episode): Observable<Character[]> {
    const ids = episode.characters
      .slice(0, CHARACTER_SAMPLE_LIMIT)
      .map((url) => this.extractIdFromUrl(url))
      .filter((id): id is number => id !== null)

    const unique = [...new Set(ids)]
    if (!unique.length) {
      return of([])
    }

    return this.http
      .get<Character | Character[]>(`${this.base}/character/${unique.join(',')}`)
      .pipe(map((res) => (Array.isArray(res) ? res : [res])))
  }

  private extractIdFromUrl(resourceUrl: string): number | null {
    const match = /\/(\d+)\/?$/.exec(resourceUrl)
    return match ? Number(match[1]) : null
  }
}
