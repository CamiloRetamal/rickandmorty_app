import { SORT_ASC, SORT_DESC, type SortDirection } from '../constants/sort-direction.constants'

export function nextSortDirectionForColumnClick(
  activeColumnKey: string | null,
  clickedColumnKey: string,
  currentDirection: SortDirection,
): SortDirection {
  const sameColumn = activeColumnKey === clickedColumnKey
  return sameColumn && currentDirection === SORT_ASC ? SORT_DESC : SORT_ASC
}

export function invertSortDirection(direction: SortDirection): SortDirection {
  return direction === SORT_ASC ? SORT_DESC : SORT_ASC
}
