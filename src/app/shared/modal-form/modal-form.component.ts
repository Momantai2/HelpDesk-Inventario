import { NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
@Component({
  selector: 'app-modal-form',
  imports: [NgIf],
  templateUrl: './modal-form.component.html',
  styleUrl: './modal-form.component.css'
})
export class ModalFormComponent {
  @Input() title = 'Formulario';
  @Input() hideSave = false;
  @Input() readonly = false;

  @Output() onSave = new EventEmitter<void>();
  @Output() onClose = new EventEmitter<void>();

  visible = false;

  open() {
    this.visible = true;
  }

  close() {
    this.visible = false;
    this.onClose.emit();
  }

  save() {
    this.onSave.emit();
    this.close();
  }
}