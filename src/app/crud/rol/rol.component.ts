import { Component, OnInit, ViewChild } from '@angular/core';
import { CrudService } from '../crud.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ModalFormComponent } from "../../shared/modal-form/modal-form.component";
import { ConfirmModalComponent } from "../../shared/confirm-modal/confirm-modal.component";
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';
import { ErrorHandlerService } from '../../core/error/errorhandler.service';
import { Rol } from '../../model/rol.model';
@Component({
  selector: 'app-rol',
  imports: [FormsModule, NgFor, ModalFormComponent, ConfirmModalComponent, AlertModalComponent],
  templateUrl: './rol.component.html',
  styleUrls: ['../crud.component.css']  // sube una carpeta para llegar a "crud" donde está el CSS
})
export class RolComponent implements OnInit
 {
  roles: Rol[] = [];
  rolEnModal: Partial<Rol> = {};
  modalModo: 'crear' | 'editar' | 'ver' = 'crear';
  modalTitulo = '';

  @ViewChild('modal') modalComponent!: ModalFormComponent;
  @ViewChild('confirmModal') confirmModal!: ConfirmModalComponent;
  @ViewChild(AlertModalComponent) alertModal!: AlertModalComponent;

  constructor(
    private crudService: CrudService<Rol>,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.getRoles();
  }

  getRoles(): void {
    this.crudService.getAll('roles').subscribe({
      next: (data) => this.roles = data,
      error: (error) => {
        const err = this.errorHandler.getErrorData(error);
        this.alertModal.open(err.title, err.message, err.details);
      }
    });
  }

  abrirCrear(): void {
    this.modalModo = 'crear';
    this.modalTitulo = 'Crear Rol';
    this.rolEnModal = {};
    this.modalComponent.open();
  }

  abrirEditar(rol: Rol): void {
    this.modalModo = 'editar';
    this.modalTitulo = 'Editar Roles';
    this.rolEnModal = { ...rol };
    this.modalComponent.open();
  }

  abrirVer(rol: Rol): void {
    this.modalModo = 'ver';
    this.modalTitulo = 'Detalle del Rol';
    this.rolEnModal = { ...rol };
    this.modalComponent.open();
  }

  cancelarModal(): void {
    this.rolEnModal = {};
  }

  confirmarAccionModal(): void {
    if (this.modalModo === 'crear') {
      this.crudService.create('roles', this.rolEnModal as Rol).subscribe({
        next: () => {
          this.getRoles();
          this.modalComponent.close();
          this.alertModal.open('Creado', 'El rol ha sido creado exitosamente.');
        },
        error: (error) => {
          const err = this.errorHandler.getErrorData(error);
          this.alertModal.open(err.title, err.message, err.details);
        }
      });
    }

    if (this.modalModo === 'editar') {
      this.crudService.update('roles', this.rolEnModal.idRol!, this.rolEnModal as Rol).subscribe({
        next: () => {
          this.getRoles();
          this.modalComponent.close();
          this.alertModal.open('Actualizado', 'El rol ha sido actualizado correctamente.');
        },
        error: (error) => {
          const err = this.errorHandler.getErrorData(error);
          this.alertModal.open(err.title, err.message, err.details);
        }
      });
    }

    this.rolEnModal = {};
  }

  eliminarRol(id: number): void {
    this.confirmModal
      .open('¿Estás seguro de que deseas eliminar este rol?', 'eliminar')
      .then((confirmado) => {
        if (confirmado) {
          this.crudService.delete('roles', id).subscribe({
            next: () => {
              this.getRoles();
              this.alertModal.open('Eliminado', 'El rol ha sido eliminado correctamente.');
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
