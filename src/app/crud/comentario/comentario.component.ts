import {
  Component,
  Input,
  OnInit,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CrudService } from '../crud.service';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { ModalFormComponent } from '../../shared/modal-form/modal-form.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';
import { ErrorHandlerService } from '../../core/error/errorhandler.service';
import { AuthService } from '../../core/auth/auth.service';
import {
  ComentarioRequestDTO,
  ComentarioResponseDTO,
} from '../../model/comentario.model';

import { map } from 'rxjs';
import { UsuarioResponseDTO } from '../../model/usuario.model';
import { TicketResponseDTO } from '../../model/ticket.model';

@Component({
  selector: 'app-comentario',
  standalone: true,
  imports: [
    FormsModule,
    NgFor,
    NgIf,
    ModalFormComponent,
    ConfirmModalComponent,
    DatePipe,
    AlertModalComponent,
  ],
  templateUrl: './comentario.component.html',
  styleUrls: ['../crud.component.css'],
})
export class ComentarioComponent implements OnInit, OnChanges {
  @Input() ticketId?: number;
  comentarioTexto = '';
  comentarios: (ComentarioResponseDTO & { usuarioNombre: string })[] = [];
  comentarioEnModal: Partial<ComentarioResponseDTO> = {};
  modalModo: 'crear' | 'editar' | 'ver' = 'crear';
  modalTitulo = '';

  usuarios: UsuarioResponseDTO[] = [];
  tickets: TicketResponseDTO[] = [];

  @ViewChild('modal') modalComponent!: ModalFormComponent;
  @ViewChild('confirmModal') confirmModal!: ConfirmModalComponent;
  @ViewChild(AlertModalComponent) alertModal!: AlertModalComponent;

  constructor(
    private crudService: CrudService<any>,
    private errorHandler: ErrorHandlerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit: este es el ticket', this.ticketId);
    this.cargarDatosIniciales();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges: este es el ticket', this.ticketId);
    if (changes['ticketId'] && this.ticketId != null) {
      this.cargarDatosIniciales();
    }
  }

  cargarDatosIniciales(): void {
    // Cargar la lista de usuarios y tickets antes de los comentarios
    this.crudService.getAll('usuarios').subscribe({
      next: (data) => (this.usuarios = data),
      error: (error) => console.error('Error al cargar usuarios:', error),
    });

    this.crudService.getAll('tickets').subscribe({
      next: (data) => (this.tickets = data),
      error: (error) => console.error('Error al cargar tickets:', error),
    });

    // Cargar los comentarios después
    this.getComentarios();
  }

  crearComentario(): void {
    if (!this.ticketId || !this.comentarioTexto.trim()) return;

    const usuarioActual = this.authService.getCurrentUsuario?.();
    if (!usuarioActual) return;

    const nuevoComentario: ComentarioRequestDTO = {
      texto: this.comentarioTexto,
      idTicket: this.ticketId,
      idUsuario: usuarioActual.idUsuario,
    };

    this.crudService.create('comentarios', nuevoComentario).subscribe({
      next: () => {
        this.comentarioTexto = '';
        this.getComentarios();
      },
      error: (error) => {
        const err = this.errorHandler.getErrorData(error);
        this.alertModal.open(err.title, err.message, err.details);
      },
    });
  }

  getComentarios(): void {
    const endpoint =
      this.ticketId != null
        ? `comentarios?ticketId=${this.ticketId}`
        : 'comentarios';

    this.crudService
      .getAll(endpoint)
      .pipe(
        map((comentarios: ComentarioResponseDTO[]) => {
          return comentarios.map((comentario) => {
            const usuario = this.usuarios.find(
              (u) => u.idUsuario === comentario.idUsuario
            );
            return {
              ...comentario,
              usuarioNombre: usuario ? usuario.email : 'Desconocido',
            };
          });
        })
      )
      .subscribe({
        next: (data: (ComentarioResponseDTO & { usuarioNombre: string })[]) =>
          (this.comentarios = data),
        error: (error) => {
          const err = this.errorHandler.getErrorData(error);
          this.alertModal.open(err.title, err.message, err.details);
        },
      });
  }

  abrirCrear(): void {
    const usuarioActual = this.authService.getCurrentUsuario?.();
    if (!usuarioActual) return;

    this.modalModo = 'crear';
    this.modalTitulo = 'Crear Comentario';
    this.comentarioEnModal = {
      texto: '',
      idTicket: this.ticketId,
      idUsuario: usuarioActual.idUsuario,
    };
    this.modalComponent.open();
  }

  abrirEditar(comentario: ComentarioResponseDTO): void {
    this.modalModo = 'editar';
    this.modalTitulo = 'Editar Comentario';
    this.comentarioEnModal = { ...comentario };
    this.modalComponent.open();
  }

  abrirVer(comentario: ComentarioResponseDTO): void {
    this.modalModo = 'ver';
    this.modalTitulo = 'Detalle del Comentario';
    this.comentarioEnModal = { ...comentario };
    this.modalComponent.open();
  }

  cancelarModal(): void {
    this.comentarioEnModal = {};
  }

  confirmarAccionModal(): void {
    // Lógica para el modal (crear/editar)
    const request: ComentarioRequestDTO = {
      texto: this.comentarioEnModal.texto!,
      idTicket: this.comentarioEnModal.idTicket!,
      idUsuario: this.comentarioEnModal.idUsuario!,
    };

    if (this.modalModo === 'crear') {
      this.crudService.create('comentarios', request).subscribe({
        next: () => {
          this.getComentarios();
          this.modalComponent.close();
          this.alertModal.open(
            'Creado',
            'El Comentario ha sido creado exitosamente.'
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
        .update('comentarios', this.comentarioEnModal.idComentario!, request)
        .subscribe({
          next: () => {
            this.getComentarios();
            this.modalComponent.close();
            this.alertModal.open(
              'Actualizado',
              'El Comentario ha sido actualizado correctamente.'
            );
          },
          error: (error) => {
            const err = this.errorHandler.getErrorData(error);
            this.alertModal.open(err.title, err.message, err.details);
          },
        });
    }

    this.comentarioEnModal = {};
  }

  eliminarComentario(id: number): void {
    this.confirmModal
      .open('¿Estás seguro de que deseas eliminar este Comentario?', 'eliminar')
      .then((confirmado) => {
        if (confirmado) {
          this.crudService.delete('comentarios', id).subscribe({
            next: () => {
              this.getComentarios();
              this.alertModal.open(
                'Eliminado',
                'El Comentario ha sido eliminado correctamente.'
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
