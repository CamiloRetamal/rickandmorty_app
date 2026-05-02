import { Routes } from '@angular/router'

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'episodes' },
  {
    path: 'episodes',
    loadChildren: () => import('./features/episodes/episodes.routes').then((m) => m.episodesRoutes),
  },
  { path: '**', redirectTo: 'episodes' },
]
