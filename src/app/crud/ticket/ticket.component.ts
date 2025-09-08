import { Component, ViewChild } from '@angular/core';
import { CrudService } from '../crud.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ModalFormComponent } from '../../shared/modal-form/modal-form.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';
import { ErrorHandlerService } from '../../core/error/errorhandler.service';
import { AuthService } from '../../core/auth/auth.service';
import { TicketRequestDTO, TicketResponseDTO } from '../../model/ticket.model';
import { EstadoResponseDTO } from '../../model/estado.model';
import { PrioridadResponseDTO } from '../../model/prioridad.model';

@Component({
  selector: 'app-ticket',
  imports: [
    FormsModule,
    NgFor,
    ModalFormComponent,
    ConfirmModalComponent,
    AlertModalComponent,
  ],
  templateUrl: './ticket.component.html',

  styleUrls: ['../crud.component.css'], // sube una carpeta para llegar a "crud" donde está el CSS
})
export class TicketComponent {
  tickets: TicketResponseDTO[] = [];
  estados: EstadoResponseDTO[] = [];
  prioridades: PrioridadResponseDTO[] = [];

  ticketEnModal: Partial<TicketRequestDTO & { idTicket?: number }> = {};

  modalModo: 'crear' | 'editar' | 'ver' = 'crear';
  modalTitulo = '';

  @ViewChild('modal') modalComponent!: ModalFormComponent;
  @ViewChild('confirmModal') confirmModal!: ConfirmModalComponent;
  @ViewChild(AlertModalComponent) alertModal!: AlertModalComponent;

  constructor(
    private crudService: CrudService<TicketResponseDTO, TicketRequestDTO>,
    private estadoService: CrudService<EstadoResponseDTO>,
    private prioridadService: CrudService<PrioridadResponseDTO>,
    private authService: AuthService, // inyectar aquí

    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.getTickets();
    this.getEstados();
    this.getPrioridades();
  }

  getTickets(): void {
    const rol = this.authService.getCurrentRol();
    const email = this.authService.getCurrentUsername(); // esto es el email guardado

    if (rol === 1) {
      // Asumiendo 1 = administrador
      this.crudService.getAll('tickets').subscribe({
        next: (data) => (this.tickets = data),
        error: (error) => {
          const err = this.errorHandler.getErrorData(error);
          this.alertModal.open(err.title, err.message, err.details);
        },
      });
    } else {
      this.crudService.getAll(`tickets?usuario=${email}`).subscribe({
        next: (data) => (this.tickets = data),
        error: (error) => {
          const err = this.errorHandler.getErrorData(error);
          this.alertModal.open(err.title, err.message, err.details);
        },
      });
    }
  }

  getEstados(): void {
    this.estadoService.getAll('estados').subscribe({
      next: (data) => (this.estados = data),
      error: (error) => {
        const err = this.errorHandler.getErrorData(error);
        this.alertModal.open(err.title, err.message, err.details);
      },
    });
  }

  getPrioridades(): void {
    this.prioridadService.getAll('prioridades').subscribe({
      next: (data) => (this.prioridades = data),
      error: (error) => {
        const err = this.errorHandler.getErrorData(error);
        this.alertModal.open(err.title, err.message, err.details);
      },
    });
  }

  abrirCrear(): void {
    this.modalModo = 'crear';
    this.modalTitulo = 'Crear Ticket';

    this.ticketEnModal = {
      idEstado: this.estados[0]?.idEstado ?? 1,
      idPrioridad: this.prioridades[0]?.idPrioridad ?? 1,
      titulo: '',
      descripcion: '',
    };

    this.modalComponent.open();
  }

  abrirEditar(ticket: TicketResponseDTO): void {
    this.modalModo = 'editar';
    this.modalTitulo = 'Editar Ticket';
    this.ticketEnModal = { ...ticket };
    this.modalComponent.open();
  }

  abrirVer(ticket: TicketResponseDTO): void {
    this.modalModo = 'ver';
    this.modalTitulo = 'Detalle del Ticket';
    this.ticketEnModal = { ...ticket };
    this.modalComponent.open();
  }

  cancelarModal(): void {
    this.ticketEnModal = {};
  }
  confirmarAccionModal(): void {
    if (this.modalModo === 'crear') {
      const usuarioActual = this.authService.getCurrentUsuario();
      if (usuarioActual) {
        this.ticketEnModal.idUsuario = usuarioActual.idUsuario; // <- solo el ID
      } else {
        this.alertModal.open('Error', 'No se pudo obtener el usuario actual.');
        return;
      }

      this.crudService
        .create('tickets', this.ticketEnModal as TicketRequestDTO)
        .subscribe({
          next: () => {
            this.getTickets();
            this.modalComponent.close();
            this.alertModal.open(
              'Creado',
              'El ticket ha sido creado exitosamente.'
            );
          },
          error: (error) => {
            const err = this.errorHandler.getErrorData(error);
            this.alertModal.open(err.title, err.message, err.details);
          },
        });
    }

    if (this.modalModo === 'editar') {
      this.crudService
        .update(
          'tickets',
          this.ticketEnModal.idTicket!,
          this.ticketEnModal as TicketRequestDTO
        )
        .subscribe({
          next: () => {
            this.getTickets();
            this.modalComponent.close();
            this.alertModal.open(
              'Actualizado',
              'El ticket ha sido actualizado correctamente.'
            );
          },
          error: (error) => {
            const err = this.errorHandler.getErrorData(error);
            this.alertModal.open(err.title, err.message, err.details);
          },
        });
    }

    this.ticketEnModal = {};
  }

  eliminarTicket(id: number): void {
    this.confirmModal
      .open('¿Estás seguro de que deseas eliminar este ticket?', 'eliminar')
      .then((confirmado) => {
        if (confirmado) {
          this.crudService.delete('tickets', id).subscribe({
            next: () => {
              this.getTickets();
              this.alertModal.open(
                'Eliminado',
                'El ticket ha sido eliminado correctamente.'
              );
            },
            error: (error) => {
              const err = this.errorHandler.getErrorData(error);
              this.alertModal.open(err.title, err.message, err.details);
            },
          });
        }
      });
  }
}
