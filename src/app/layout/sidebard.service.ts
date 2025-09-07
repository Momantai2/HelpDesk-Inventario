// src/app/shared/services/sidebar.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private _isSidebarOpen = new BehaviorSubject<boolean>(false);
  isSidebarOpen$ = this._isSidebarOpen.asObservable();

  toggle() {
    this._isSidebarOpen.next(!this._isSidebarOpen.value);
  }

  open() {
    this._isSidebarOpen.next(true);
  }

  close() {
    this._isSidebarOpen.next(false);
  }

  get isOpen() {
    return this._isSidebarOpen.value;
  }
}
