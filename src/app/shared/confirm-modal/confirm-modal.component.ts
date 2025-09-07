import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css'],
  standalone: true,
  imports : [NgIf]
})
export class ConfirmModalComponent {
  @Input() message: string = '¿Está seguro que desea continuar?';
  @Input() actionType: 'eliminar' | 'confirmar' = 'eliminar';

  visible = false;
  private resolveFn!: (confirmed: boolean) => void;

  open(message: string = this.message, actionType: 'eliminar' | 'confirmar' = 'eliminar'): Promise<boolean> 
  {
    this.message = message;
    this.actionType = actionType;
    this.visible = true;

    return new Promise<boolean>((resolve) => {
      this.resolveFn = resolve;
    });
  }

  confirm() {
    this.visible = false;
    this.resolveFn(true);
  }

  cancel() {
    this.visible = false;
    this.resolveFn(false);
  }
}
