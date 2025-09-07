import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Ticket } from '../model/ticket.model';
import { CrudService } from '../crud/crud.service';
import { AuthService } from '../core/auth/auth.service';
import { ErrorHandlerService } from '../core/error/errorhandler.service';
import { NgFor, NgIf } from '@angular/common';
import { modalHomeComponent } from "./modalHome.component";
import { ComentarioComponent } from "../crud/comentario/comentario.component";

@Component({
  selector: 'app-home',
  imports: [NgIf, NgFor, modalHomeComponent, ComentarioComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tickets: Ticket[] = [];
    selectedTicket: Ticket | null = null;

  rol: number = 0;

 openTicket(ticket: Ticket) { this.selectedTicket = ticket; }
  closeModal() { this.selectedTicket = null; }

  constructor(
    private router: Router,
    private crudService: CrudService<Ticket>,
    private authService: AuthService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.rol = this.authService.getCurrentRol() ?? 0;
    this.cargarTickets();
  }

  cargarTickets(): void {
    const email = this.authService.getCurrentUsername();

    const endpoint = this.rol === 1
      ? 'tickets' // admin
      : `tickets?usuario=${email}`; // usuario

    this.crudService.getAll(endpoint).subscribe({
      next: (data) => this.tickets = data,
      error: (error) => {
        const err = this.errorHandler.getErrorData(error);
        alert(`${err.title}: ${err.message}`);
      }
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
