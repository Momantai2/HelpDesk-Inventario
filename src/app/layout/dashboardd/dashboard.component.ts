import { Component, OnDestroy, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from "../../core/auth/auth.service";
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  @Input() isSidebarOpen: boolean = false;
  @Output() mouseLeave = new EventEmitter<void>();

  idRol: number | null = null;
  isLoggedIn = false;
  showSubmenu = false;

  private subs: Subscription[] = [];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.subs.push(
      this.authService.loggedIn$.subscribe(status => {
        this.isLoggedIn = status;
      }),
      this.authService.rol$.subscribe(rol => {
        this.idRol = rol;
      })
    );
  }

  toggleSubmenu() {
    this.showSubmenu = !this.showSubmenu;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.idRol === 1;
  }

  onMouseLeaveSidebar() {
    this.mouseLeave.emit();
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}