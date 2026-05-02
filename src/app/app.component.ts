import { Component, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { ThemeService } from './core/services/theme.service'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly themeSvc = inject(ThemeService)

  protected readonly isDark = this.themeSvc.isDark

  protected onToggleTheme(): void {
    this.themeSvc.toggleTheme()
  }
}
