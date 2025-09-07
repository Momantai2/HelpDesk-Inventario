import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.css'],
    imports: [NgIf,NgFor],

  standalone: true
})
export class AlertModalComponent {
  @Input() title: string = 'Error';
  @Input() message: string = '';
  @Input() details: string[] = [];

  visible = false;

  open(title: string, message: string, details: string[] = []) {
    this.title = title;
    this.message = message;
    this.details = details;
    this.visible = true;
  }

  close() {
    this.visible = false;
  }
}
