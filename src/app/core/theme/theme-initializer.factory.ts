import { inject } from '@angular/core'
import { ThemeService } from '../services/theme.service'

export function themeAppInitializer(): void {
  inject(ThemeService).initialize()
}
