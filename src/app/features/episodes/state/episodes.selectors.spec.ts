import { SORT_ASC, SORT_DESC } from '../../../core/constants/sort-direction.constants'
import { EPISODES_SORT_FIELD } from '../constants/episodes-sort.constants'
import type { Episode } from '../models/episode.model'
import { compareEpisodes } from './episodes.selectors'

function ep(partial: Partial<Episode> & Pick<Episode, 'id' | 'name'>): Episode {
  return {
    air_date: 'January 1, 2020',
    episode: 'S01E01',
    characters: [],
    url: '',
    created: '',
    ...partial,
  }
}

describe('compareEpisodes', () => {
  it('sorts by name ascending', () => {
    const a = ep({ id: 1, name: 'Alpha' })
    const b = ep({ id: 2, name: 'Beta' })
    expect(compareEpisodes(a, b, EPISODES_SORT_FIELD.NAME, SORT_ASC)).toBeLessThan(0)
    expect(compareEpisodes(b, a, EPISODES_SORT_FIELD.NAME, SORT_ASC)).toBeGreaterThan(0)
  })

  it('sorts by name descending', () => {
    const a = ep({ id: 1, name: 'Alpha' })
    const b = ep({ id: 2, name: 'Beta' })
    expect(compareEpisodes(a, b, EPISODES_SORT_FIELD.NAME, SORT_DESC)).toBeGreaterThan(0)
  })

  it('sorts by air_date', () => {
    const older = ep({
      id: 1,
      name: 'A',
      air_date: 'January 1, 2019',
    })
    const newer = ep({
      id: 2,
      name: 'B',
      air_date: 'January 1, 2020',
    })
    expect(compareEpisodes(older, newer, EPISODES_SORT_FIELD.DATE, SORT_ASC)).toBeLessThan(0)
  })

  it('sorts by episode code with numeric awareness', () => {
    const s1 = ep({ id: 1, name: 'A', episode: 'S01E10' })
    const s2 = ep({ id: 2, name: 'B', episode: 'S01E02' })
    expect(compareEpisodes(s2, s1, EPISODES_SORT_FIELD.CODE, SORT_ASC)).toBeLessThan(0)
  })
})
