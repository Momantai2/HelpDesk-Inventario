import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modalHome',
  template: `
     <div class="modal-backdrop" (click)="close()"></div>
    <div class="modal-content" (click)="$event.stopPropagation()">
      <button class="close-button" (click)="close()" aria-label="Cerrar modal">&times;</button>
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./modalHome.component.css']
})
export class modalHomeComponent {
   @Output() closed = new EventEmitter<void>();
  close() { this.closed.emit(); }
}