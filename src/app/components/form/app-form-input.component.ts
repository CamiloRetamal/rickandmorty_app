import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { ReactiveFormsModule, type FormControl } from '@angular/forms'

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block min-w-0 w-full max-w-full',
  },
  template: `
    <label class="flex min-w-0 w-full max-w-full flex-col gap-1.5">
      <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ label() }}</span>
      <div class="relative">
        <input
          [type]="type()"
          [formControl]="control()"
          [attr.placeholder]="placeholder()"
          class="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-3 pr-10 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-light dark:focus:ring-brand-light/30"
        />
        @if (withSearchIcon()) {
          <span
            class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            aria-hidden="true"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
        }
      </div>
    </label>
  `,
})
export class AppFormInputComponent {
  readonly label = input.required<string>()
  readonly control = input.required<FormControl<string>>()
  readonly placeholder = input('')
  readonly type = input('search')
  readonly withSearchIcon = input(true)
}
