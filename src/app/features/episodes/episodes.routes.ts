import { Routes } from '@angular/router'

export const episodesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/episodes-page/episodes-page.component').then(
        (m) => m.EpisodesPageComponent,
      ),
  },
]
