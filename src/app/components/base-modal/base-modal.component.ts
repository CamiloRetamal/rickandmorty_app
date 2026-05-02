import { NgClass } from '@angular/common'
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'
import { modalBackdropFade, modalPanelSpring } from '../../core/animations/ui.animations'
import {
  BASE_MODAL_MAX_WIDTH_CLASSES,
  BASE_MODAL_UI,
  type BaseModalMaxWidth,
} from './base-modal.constants'

@Component({
  selector: 'app-base-modal',
  standalone: true,
  imports: [NgClass],
  templateUrl: './base-modal.component.html',
  animations: [modalBackdropFade, modalPanelSpring],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseModalComponent {
  readonly show = input.required<boolean>()
  readonly title = input.required<string>()
  readonly maxWidth = input<BaseModalMaxWidth>('2xl')
  readonly hideFooter = input(false)
  readonly useDefaultFooter = input(true)
  readonly hideCloseButton = input(false)
  readonly closeOnBackdropClick = input(true)
  readonly loading = input(false)
  readonly cancelText = input<string>(BASE_MODAL_UI.cancelText)
  readonly confirmText = input<string>(BASE_MODAL_UI.confirmText)
  readonly processingLabel = input<string>(BASE_MODAL_UI.processingText)

  readonly closed = output<void>()
  readonly confirm = output<void>()

  protected readonly maxWidthMap = BASE_MODAL_MAX_WIDTH_CLASSES

  protected onBackdropClick(): void {
    if (this.closeOnBackdropClick()) {
      this.closed.emit()
    }
  }

  protected onConfirmClick(): void {
    this.confirm.emit()
  }
}
