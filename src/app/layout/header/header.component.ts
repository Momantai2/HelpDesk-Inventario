import { Component, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() toggleSidebar = new EventEmitter<void>();

  nombre: string | null = null;
  isLoggedIn = false;
  private subs: Subscription[] = [];

  constructor( private router: Router,private authService: AuthService) {}

  ngOnInit() {
    this.subs.push(
      this.authService.loggedIn$.subscribe(status => this.isLoggedIn = status),
      this.authService.username$.subscribe(name => this.nombre = name),
    );
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  onToggleClick() {
    this.toggleSidebar.emit();
  }

    cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}