import { provideHttpClient } from '@angular/common/http'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { RICK_MORTY_API } from '../../../core/constants/api.constants'
import { EpisodesApiService } from './episodes-api.service'

describe('EpisodesApiService', () => {
  let service: EpisodesApiService
  let http: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
    service = TestBed.inject(EpisodesApiService)
    http = TestBed.inject(HttpTestingController)
  })

  afterEach(() => http.verify())

  it('should request the correct page and name params', () => {
    service.getEpisodes(2, 'rick').subscribe((res) => {
      expect(res.results.length).toBe(1)
    })

    const req = http.expectOne(
      (r) =>
        r.url === `${RICK_MORTY_API.baseUrl}/episode` &&
        r.params.get('page') === '2' &&
        r.params.get('name') === 'rick',
    )
    expect(req.request.method).toBe('GET')
    req.flush({
      info: { count: 1, pages: 1, next: null, prev: null },
      results: [
        {
          id: 1,
          name: 'Pilot',
          air_date: 'December 2, 2013',
          episode: 'S01E01',
          characters: [],
          url: '',
          created: '',
        },
      ],
    })
  })

  it('should omit name param when not provided', () => {
    service.getEpisodes(1).subscribe()

    const req = http.expectOne(
      (r) =>
        r.url === `${RICK_MORTY_API.baseUrl}/episode` &&
        r.params.get('page') === '1' &&
        !r.params.has('name'),
    )
    expect(req.request.method).toBe('GET')
    req.flush({
      info: { count: 0, pages: 0, next: null, prev: null },
      results: [],
    })
  })

  it('should send episode query for season filter', () => {
    service.getEpisodes(1, undefined, 'S03').subscribe()

    const req = http.expectOne(
      (r) =>
        r.url === `${RICK_MORTY_API.baseUrl}/episode` &&
        r.params.get('page') === '1' &&
        r.params.get('episode') === 'S03' &&
        !r.params.has('name'),
    )
    expect(req.request.method).toBe('GET')
    req.flush({
      info: { count: 10, pages: 1, next: null, prev: null },
      results: [],
    })
  })

  it('should combine name and episode query params', () => {
    service.getEpisodes(1, 'rick', 'S01').subscribe()

    const req = http.expectOne(
      (r) =>
        r.url === `${RICK_MORTY_API.baseUrl}/episode` &&
        r.params.get('name') === 'rick' &&
        r.params.get('episode') === 'S01',
    )
    expect(req.request.method).toBe('GET')
    req.flush({
      info: { count: 0, pages: 1, next: null, prev: null },
      results: [],
    })
  })
})
