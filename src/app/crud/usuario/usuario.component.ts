import { Component, OnInit, ViewChild } from '@angular/core';
import { CrudService } from '../crud.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ModalFormComponent } from "../../shared/modal-form/modal-form.component";
import { ConfirmModalComponent } from "../../shared/confirm-modal/confirm-modal.component";
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';
import { ErrorHandlerService } from '../../core/error/errorhandler.service';
import { Usuario } from '../../model/usuario.model';
import { Rol } from '../../model/rol.model';
@Component({
  selector: 'app-usuario',
  imports: [FormsModule, NgFor, ModalFormComponent, ConfirmModalComponent, AlertModalComponent],
  templateUrl: './usuario.component.html',
  styleUrls: ['../crud.component.css']  // sube una carpeta para llegar a "crud" donde está el CSS
})
export class UsuarioComponent {

  usuarios : Usuario[] = [];
  roles: Rol[] = []; // ← lista de roles

 usuarioEnModal: Partial<Usuario> = {};
  modalModo: 'crear' | 'editar' | 'ver' = 'crear';
  modalTitulo = '';

  @ViewChild('modal') modalComponent!: ModalFormComponent;
  @ViewChild('confirmModal') confirmModal!: ConfirmModalComponent;
  @ViewChild(AlertModalComponent) alertModal!: AlertModalComponent;

  constructor(
    private crudService: CrudService<Usuario>,
      private rolService: CrudService<Rol>, // ← nuevo servicio para roles

    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.getUsuarios();
    this.getRoles();
  }

  getUsuarios(): void {
    this.crudService.getAll('usuarios').subscribe({
      next: (data) => this.usuarios = data,
      error: (error) => {
        const err = this.errorHandler.getErrorData(error);
        this.alertModal.open(err.title, err.message, err.details);
      }
    });
  }

    getRoles(): void {
    this.rolService.getAll('roles').subscribe({
      next: (data) => this.roles = data,
      error: (error) => {
        const err = this.errorHandler.getErrorData(error);
        this.alertModal.open(err.title, err.message, err.details);
      }
    });
  }

  abrirCrear(): void {
    this.modalModo = 'crear';
    this.modalTitulo = 'Crear Usuario';
    this.usuarioEnModal = {};
    this.modalComponent.open();
  }

  abrirEditar(usuario: Usuario): void {
    this.modalModo = 'editar';
    this.modalTitulo = 'Editar Usuario';
    this.usuarioEnModal = { ...usuario };
    this.modalComponent.open();
  }

  abrirVer(usuario: Usuario): void {
    this.modalModo = 'ver';
    this.modalTitulo = 'Detalle del Usuario';
    this.usuarioEnModal = { ...usuario };
    this.modalComponent.open();
  }

  cancelarModal(): void {
    this.usuarioEnModal = {};
  }

  confirmarAccionModal(): void {
    if (this.modalModo === 'crear') {
      this.crudService.create('usuarios', this.usuarioEnModal as Usuario).subscribe({
        next: () => {
          this.getUsuarios();
          this.modalComponent.close();
          this.alertModal.open('Creado', 'El Usuario ha sido creado exitosamente.');
        },
        error: (error) => {
          const err = this.errorHandler.getErrorData(error);
          this.alertModal.open(err.title, err.message, err.details);
        }
      });
    }

    if (this.modalModo === 'editar') {
      this.crudService.update('usuarios', this.usuarioEnModal.idUsuario!, this.usuarioEnModal as Usuario).subscribe({
        next: () => {
          this.getUsuarios();
          this.modalComponent.close();
          this.alertModal.open('Actualizado', 'El Usuario ha sido actualizado correctamente.');
        },
        error: (error) => {
          const err = this.errorHandler.getErrorData(error);
          this.alertModal.open(err.title, err.message, err.details);
        }
      });
    }

    this.usuarioEnModal = {};
  }

  eliminarUsuario(id: number): void {
    this.confirmModal
      .open('¿Estás seguro de que deseas eliminar este Usuario?', 'eliminar')
      .then((confirmado) => {
        if (confirmado) {
          this.crudService.delete('usuarios', id).subscribe({
            next: () => {
              this.getUsuarios();
              this.alertModal.open('Eliminado', 'El Usuario ha sido eliminado correctamente.');
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
