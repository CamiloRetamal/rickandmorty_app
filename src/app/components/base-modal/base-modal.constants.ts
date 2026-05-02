export const BASE_MODAL_UI = {
  cancelText: 'Cancelar',
  confirmText: 'Guardar',
  processingText: 'Procesando…',
} as const

export const BASE_MODAL_MAX_WIDTH_CLASSES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
} as const

export type BaseModalMaxWidth = keyof typeof BASE_MODAL_MAX_WIDTH_CLASSES
