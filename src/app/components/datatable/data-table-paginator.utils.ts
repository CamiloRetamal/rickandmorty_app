export function getVisiblePages(
  current: number,
  last: number,
  delta = 1,
  maxElements = 7,
): (number | '...')[] {
  if (last <= 0) return []
  if (last === 1) return [1]

  const left = current - delta
  const right = current + delta + 1
  const range: number[] = []

  for (let i = 1; i <= last; i++) {
    if (i === 1 || i === last || (i >= left && i < right)) {
      range.push(i)
    }
  }

  const rangeWithDots: (number | '...')[] = []
  let previous: number | undefined

  for (const i of range) {
    if (previous !== undefined) {
      if (i - previous === 2) {
        rangeWithDots.push(previous + 1)
      } else if (i - previous !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    previous = i
  }

  if (rangeWithDots.length <= maxElements) {
    return rangeWithDots
  }

  if (current < 4) {
    return [...rangeWithDots.slice(0, delta + 2), '...', last]
  }
  if (current > last - 3) {
    return [1, '...', ...rangeWithDots.slice(-(delta + 2))]
  }
  return [1, '...', current - delta, current, current + delta, '...', last]
}
