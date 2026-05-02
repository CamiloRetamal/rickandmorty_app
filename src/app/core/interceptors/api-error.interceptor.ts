import { HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { catchError, throwError } from 'rxjs'

import { HttpClientErrorLogger } from '../services/http-client-error-logger.service'

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(HttpClientErrorLogger)
  return next(req).pipe(
    catchError((err: unknown) => {
      logger.logFailedRequest({ method: req.method, url: req.url }, err)
      return throwError(() => err)
    }),
  )
}
