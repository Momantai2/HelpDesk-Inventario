import { Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { CrudService } from '../crud.service';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { ModalFormComponent } from "../../shared/modal-form/modal-form.component";
import { ConfirmModalComponent } from "../../shared/confirm-modal/confirm-modal.component";
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';
import { ErrorHandlerService } from '../../core/error/errorhandler.service';
import { Comentario } from '../../model/comentario.model';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-comentario',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, ModalFormComponent, ConfirmModalComponent,DatePipe, AlertModalComponent],
  templateUrl: './comentario.component.html',
  styleUrls: ['../crud.component.css']
})
export class ComentarioComponent implements OnInit, OnChanges {
  @Input() ticketId?: number;
  comentarioTexto = '';
  comentarios: Comentario[] = [];
  comentarioEnModal: Partial<Comentario> = {};
  modalModo: 'crear' | 'editar' | 'ver' = 'crear';
  modalTitulo = '';

  @ViewChild('modal') modalComponent!: ModalFormComponent;
  @ViewChild('confirmModal') confirmModal!: ConfirmModalComponent;
  @ViewChild(AlertModalComponent) alertModal!: AlertModalComponent;

  constructor(
    private crudService: CrudService<Comentario>,
    private errorHandler: ErrorHandlerService,
    private authService: AuthService
  ) {}

  // Llama a getComentarios en la inicialización si no hay un ticketId.
  // Esto asegura que la tabla del CRUD se llene con todos los comentarios.
  ngOnInit(): void {
    console.log("ngOnInit: este es el ticket", this.ticketId);
    if (this.ticketId == null) {
      this.getComentarios();
    }
  }

  // Detecta cambios en los inputs, como el ticketId.
  // Esto es para la vista de las cartas, donde el ID se pasa dinámicamente.
  ngOnChanges(changes: SimpleChanges): void {
    console.log("ngOnChanges: este es el ticket", this.ticketId);
    if (changes['ticketId'] && this.ticketId != null) {
      this.getComentarios();
    }
  }

  crearComentario(): void {
    if (!this.ticketId || !this.comentarioTexto.trim()) return;

    const usuarioActual = this.authService.getCurrentUsuario?.();
    if (!usuarioActual) return;

    const nuevo: Comentario = {
      texto: this.comentarioTexto,
      ticket: { idTicket: this.ticketId!, descripcion: '' },
      usuario: { idUsuario: usuarioActual.idUsuario!, email: '', rol: { idRol: 0, nombre: '' } }
    };

    this.crudService.create('comentarios', nuevo).subscribe({
      next: () => {
        this.comentarioTexto = '';
        this.getComentarios();
      },
      error: error => {
        const err = this.errorHandler.getErrorData(error);
        this.alertModal.open(err.title, err.message, err.details);
      }
    });
  }

  getComentarios(): void {
    const endpoint = this.ticketId != null ? `comentarios?ticket=${this.ticketId}` : 'comentarios';
    this.crudService.getAll(endpoint).subscribe({
      next: data => this.comentarios = data,
      error: error => {
        const err = this.errorHandler.getErrorData(error);
        this.alertModal.open(err.title, err.message, err.details);
      }
    });
  }

  abrirCrear(): void {
    this.modalModo = 'crear';
    this.modalTitulo = 'Crear Comentario';
    this.comentarioEnModal = { 
      texto: '', 
      ticket: { idTicket: this.ticketId!, descripcion: '' }, 
      usuario: { idUsuario: this.authService.getCurrentUsuario()?.idUsuario!, email: '', rol: { idRol: 0, nombre: '' } }
    };
    this.modalComponent.open();
  }

  abrirEditar(comentario: Comentario): void {
    this.modalModo = 'editar';
    this.modalTitulo = 'Editar Comentario';
    this.comentarioEnModal = { ...comentario, ticket: { ...comentario.ticket! }, usuario: { ...comentario.usuario! } };
    this.modalComponent.open();
  }

  abrirVer(comentario: Comentario): void {
    this.modalModo = 'ver';
    this.modalTitulo = 'Detalle del Comentario';
    this.comentarioEnModal = { ...comentario };
    this.modalComponent.open();
  }

  cancelarModal(): void {
    this.comentarioEnModal = {};
  }

  confirmarAccionModal(): void {
    if (this.modalModo === 'crear') {
      this.crudService.create('comentarios', this.comentarioEnModal as Comentario).subscribe({
        next: () => {
          this.getComentarios();
          this.modalComponent.close();
          this.alertModal.open('Creado', 'El Comentario ha sido creado exitosamente.');
        },
        error: (error) => {
          const err = this.errorHandler.getErrorData(error);
          this.alertModal.open(err.title, err.message, err.details);
        }
      });
    }

    if (this.modalModo === 'editar') {
      this.crudService.update('comentarios', this.comentarioEnModal.idComentario!, this.comentarioEnModal as Comentario).subscribe({
        next: () => {
          this.getComentarios();
          this.modalComponent.close();
          this.alertModal.open('Actualizado', 'El Comentario ha sido actualizado correctamente.');
        },
        error: (error) => {
          const err = this.errorHandler.getErrorData(error);
          this.alertModal.open(err.title, err.message, err.details);
        }
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
              this.alertModal.open('Eliminado', 'El Comentario ha sido eliminado correctamente.');
            },
            error: (error) => {
              const err = this.errorHandler.getErrorData(error);
              this.alertModal.open(err.title, err.message, err.details);
            }
          });
        }
      });
  }

}
