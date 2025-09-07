import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgStyle],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

 onLogin() {
  this.authService.login(this.username, this.password).subscribe({
    next: () => {
      this.router.navigate(['/home']);
    },
    error: () => {
      alert('Credenciales incorrectas');
    },
  });
}
  
}