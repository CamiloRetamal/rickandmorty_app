import { provideHttpClient, withInterceptors } from '@angular/common/http'
import {
  ApplicationConfig,
  isDevMode,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core'
import { provideAnimations } from '@angular/platform-browser/animations'
import { provideRouter } from '@angular/router'
import { provideEffects } from '@ngrx/effects'
import { provideState, provideStore } from '@ngrx/store'
import { provideStoreDevtools } from '@ngrx/store-devtools'
import { routes } from './app.routes'
import { apiErrorInterceptor } from './core/interceptors/api-error.interceptor'
import { themeAppInitializer } from './core/theme/theme-initializer.factory'
import { EpisodesEffects } from './features/episodes/state/episodes.effects'
import { episodesFeatureKey, episodesReducer } from './features/episodes/state/episodes.reducer'

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(themeAppInitializer),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([apiErrorInterceptor])),
    provideStore(),
    provideState(episodesFeatureKey, episodesReducer),
    provideEffects([EpisodesEffects]),
    provideStoreDevtools({
      maxAge: 50,
      logOnly: !isDevMode(),
    }),
  ],
}
