import { Injectable, isDevMode } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class HttpClientErrorLogger {
  logFailedRequest(info: { method: string; url: string }, error: unknown): void {
    if (!isDevMode()) return
    console.error('[HTTP]', info.method, info.url, error)
  }
}
