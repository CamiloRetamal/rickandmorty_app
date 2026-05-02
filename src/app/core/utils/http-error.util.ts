import { HttpErrorResponse } from '@angular/common/http'

export function mapHttpError(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    const apiMsg =
      err.error &&
      typeof err.error === 'object' &&
      'error' in err.error &&
      typeof (err.error as Record<string, unknown>)['error'] === 'string'
        ? (err.error as Record<string, string>)['error']
        : null

    return apiMsg ?? err.message ?? `Error HTTP ${err.status}`
  }
  return 'Error inesperado al contactar la API.'
}
