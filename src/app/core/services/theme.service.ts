import { Injectable, signal } from '@angular/core'
import { THEME_DOCUMENT_CLASS, THEME_MODE, THEME_STORAGE_KEY } from '../constants/theme.constants'

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _isDark = signal(false)

  readonly isDark = this._isDark.asReadonly()

  initialize(): void {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    if (saved === THEME_MODE.DARK || saved === THEME_MODE.LIGHT) {
      this._apply(saved === THEME_MODE.DARK)
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      this._apply(prefersDark)
    }
  }

  toggleTheme(): void {
    this._apply(!this._isDark())
  }

  private _apply(dark: boolean): void {
    this._isDark.set(dark)
    localStorage.setItem(THEME_STORAGE_KEY, dark ? THEME_MODE.DARK : THEME_MODE.LIGHT)
    document.documentElement.classList.toggle(THEME_DOCUMENT_CLASS, dark)
  }
}
