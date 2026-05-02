import { animate, style, transition, trigger } from '@angular/animations'

export const modalBackdropFade = trigger('modalBackdropFade', [
  transition(':enter', [style({ opacity: 0 }), animate('180ms ease-out', style({ opacity: 1 }))]),
  transition(':leave', [animate('140ms ease-in', style({ opacity: 0 }))]),
])

export const modalPanelSpring = trigger('modalPanelSpring', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.94) translateY(16px)' }),
    animate(
      '240ms cubic-bezier(0.22, 1, 0.36, 1)',
      style({ opacity: 1, transform: 'scale(1) translateY(0)' }),
    ),
  ]),
  transition(':leave', [
    animate('160ms ease-in', style({ opacity: 0, transform: 'scale(0.96) translateY(10px)' })),
  ]),
])

export const pageCardReveal = trigger('pageCardReveal', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(14px)' }),
    animate(
      '300ms cubic-bezier(0.22, 1, 0.36, 1)',
      style({ opacity: 1, transform: 'translateY(0)' }),
    ),
  ]),
])
