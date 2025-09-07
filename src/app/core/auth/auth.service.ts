import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { JwtResponse } from './jwt.response.model';
import { Usuario } from '../../model/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
   private apiUrl = `${environment.apispirngUrl}/auth`;

  // Estado login y username
  private loggedIn = new BehaviorSubject<boolean>(
    !!localStorage.getItem('token')
  );
  loggedIn$ = this.loggedIn.asObservable();

  private username = new BehaviorSubject<string | null>(
    localStorage.getItem('username')
  );
  username$ = this.username.asObservable();

  private rol = new BehaviorSubject<number | null>(
    localStorage.getItem('idRol') ? Number(localStorage.getItem('idRol')) : null
  );
  rol$ = this.rol.asObservable();

  private idUsuario = new BehaviorSubject<number | null>(
    localStorage.getItem('idUsuario') ? Number(localStorage.getItem('idUsuario')) : null
  );
  idUsuario$ = this.idUsuario.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<JwtResponse> {
    return this.http
      .post<JwtResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('username', email);
          localStorage.setItem('idRol', res.rol.toString());
          localStorage.setItem('idUsuario', res.idUsuario.toString());  // Guardamos idUsuario

          this.loggedIn.next(true);
          this.username.next(email);
          this.rol.next(res.rol);
          this.idUsuario.next(res.idUsuario);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('idRol');
    localStorage.removeItem('idUsuario');

    this.loggedIn.next(false);
    this.username.next(null);
    this.rol.next(null);
    this.idUsuario.next(null);
  }

  getCurrentUsername(): string | null {
    return localStorage.getItem('username');
  }

  getCurrentRol(): number | null {
    const rol = localStorage.getItem('idRol');
    return rol ? Number(rol) : null;
  }

  getCurrentUsuario(): Usuario | null {
    const idUsuarioStr = localStorage.getItem('idUsuario');
    const email = localStorage.getItem('username');
    const rolNum = localStorage.getItem('idRol');
    if (idUsuarioStr && email && rolNum) {
      return {
        idUsuario: Number(idUsuarioStr),
        email: email,
        rol: { idRol: Number(rolNum), nombre: '' }  // puedes ajustar si tienes nombre del rol
      };
    }
    return null;
  }
}