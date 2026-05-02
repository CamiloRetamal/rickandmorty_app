import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core'

export type LoadingSpinnerSize = 'sm' | 'md' | 'lg'

export type LoadingSpinnerColor = 'brand' | 'yellow' | 'blue' | 'green' | 'red' | 'purple'

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div [class]="containerClass()">
      <div [class]="spinnerClass()" aria-hidden="true"></div>
      @if (message(); as text) {
        @if (inline()) {
          <span class="text-slate-600 dark:text-slate-300">{{ text }}</span>
        } @else {
          <p class="text-center text-slate-600 dark:text-slate-300">{{ text }}</p>
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinnerComponent {
  readonly size = input<LoadingSpinnerSize>('md')
  readonly color = input<LoadingSpinnerColor>('brand')
  readonly fullHeight = input(false)
  readonly message = input<string | undefined>(undefined)
  readonly inline = input(false)

  protected readonly containerClass = computed(() => {
    const base = 'flex justify-center items-center'
    if (this.fullHeight()) {
      return `${base} min-h-screen flex-col gap-4 text-slate-600 dark:text-slate-300`
    }
    if (this.inline()) {
      return `${base} flex-row gap-3 text-slate-600 dark:text-slate-300`
    }
    return `${base} flex-col gap-4 py-20 text-slate-600 dark:text-slate-300`
  })

  protected readonly spinnerClass = computed(() => {
    const sizeClasses: Record<LoadingSpinnerSize, string> = {
      sm: 'h-8 w-8',
      md: 'h-16 w-16',
      lg: 'h-24 w-24',
    }
    const s = sizeClasses[this.size()]
    const color = this.color()
    if (color === 'brand') {
      return `rounded-full border-2 border-brand border-t-transparent animate-spin ${s}`
    }
    const colorClasses: Record<Exclude<LoadingSpinnerColor, 'brand'>, string> = {
      yellow: 'border-yellow-400',
      blue: 'border-blue-400',
      green: 'border-green-400',
      red: 'border-red-400',
      purple: 'border-purple-400',
    }
    const c = colorClasses[color]
    return `rounded-full border-t-4 border-b-4 animate-spin ${s} ${c}`
  })
}
