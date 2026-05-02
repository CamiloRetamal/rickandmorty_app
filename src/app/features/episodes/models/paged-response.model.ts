export interface PagedInfo {
  count: number
  pages: number
  next: string | null
  prev: string | null
}

export interface PagedResponse<T> {
  info: PagedInfo
  results: T[]
}
