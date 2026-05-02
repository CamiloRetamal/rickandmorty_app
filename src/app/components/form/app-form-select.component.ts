import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'

export interface SelectOption {
  value: string
  label: string
}

@Component({
  selector: 'app-form-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block min-w-0 w-full max-w-full',
  },
  template: `
    <label class="flex min-w-0 w-full max-w-full flex-col gap-1.5">
      <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ label() }}</span>
      <select
        class="w-full min-w-0 max-w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-3 pr-8 text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-brand-light dark:focus:ring-brand-light/30"
        [value]="value()"
        (change)="onNativeChange($event)"
      >
        @for (opt of options(); track opt.value) {
          <option [value]="opt.value">{{ opt.label }}</option>
        }
      </select>
    </label>
  `,
})
export class AppFormSelectComponent {
  readonly label = input.required<string>()
  readonly options = input.required<readonly SelectOption[]>()
  readonly value = input('')

  readonly changed = output<string>()

  protected onNativeChange(ev: Event): void {
    this.changed.emit((ev.target as HTMLSelectElement).value)
  }
}
