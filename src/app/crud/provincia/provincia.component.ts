import { Component, OnInit, ViewChild } from '@angular/core';
import { CrudService } from '../crud.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ModalFormComponent } from '../../shared/modal-form/modal-form.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';
import { ErrorHandlerService } from '../../core/error/errorhandler.service';
import {
  ProvinciaRequest,
  ProvinciaResponse,
} from '../../model/inventario/provincia.model';

@Component({
  selector: 'app-provincia',
  imports: [
    FormsModule,
    NgFor,
    ModalFormComponent,
    ConfirmModalComponent,
    AlertModalComponent,
    NgIf,
  ],
  templateUrl: './provincia.component.html',
  styleUrls: ['../crud.component.css'],
})
export class ProvinciaComponent implements OnInit {
  provincias: ProvinciaResponse[] = [];
  provinciaEnModal: Partial<ProvinciaRequest & ProvinciaResponse> = {};
  modalModo: 'crear' | 'editar' | 'ver' = 'crear';
  modalTitulo = '';

  @ViewChild('modal') modalComponent!: ModalFormComponent;
  @ViewChild('confirmModal') confirmModal!: ConfirmModalComponent;
  @ViewChild(AlertModalComponent) alertModal!: AlertModalComponent;

  constructor(
    private crudService: CrudService<ProvinciaResponse>,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.getProvincias();
  }

  getProvincias(): void {
    this.crudService.getAll('provincias').subscribe({
      next: (data) => (this.provincias = data),
      error: (error) => {
        const err = this.errorHandler.getErrorData(error);
        this.alertModal.open(err.title, err.message, err.details);
      },
    });
  }

  abrirCrear(): void {
    this.modalModo = 'crear';
    this.modalTitulo = 'Crear Provincia';
    this.provinciaEnModal = {};
    this.modalComponent.open();
  }

  abrirEditar(provincia: ProvinciaResponse): void {
    this.modalModo = 'editar';
    this.modalTitulo = 'Editar Provincia';
    this.provinciaEnModal = { ...provincia };
    this.modalComponent.open();
  }

  abrirVer(provincia: ProvinciaResponse): void {
    this.modalModo = 'ver';
    this.modalTitulo = 'Detalle de Provincia';
    this.provinciaEnModal = { ...provincia };
    this.modalComponent.open();
  }

  cancelarModal(): void {
    this.provinciaEnModal = {};
  }

  confirmarAccionModal(): void {
    if (this.modalModo === 'crear') {
      const payload: ProvinciaRequest = {
        nombre: this.provinciaEnModal.nombre!,
        idDepartamento: this.provinciaEnModal.idDepartamento!,
      };

      this.crudService.create('provincias', payload).subscribe({
        next: () => {
          this.getProvincias();
          this.modalComponent.close();
          this.alertModal.open(
            'Creado',
            'La provincia ha sido creada exitosamente.'
          );
        },
        error: (error) => {
          const err = this.errorHandler.getErrorData(error);
          this.alertModal.open(err.title, err.message, err.details);
        },
      });
    }

    if (this.modalModo === 'editar') {
      const payload: ProvinciaRequest = {
        nombre: this.provinciaEnModal.nombre!,
        idDepartamento: this.provinciaEnModal.idDepartamento!,
      };

      this.crudService
        .update('provincias', this.provinciaEnModal.id!, payload)
        .subscribe({
          next: () => {
            this.getProvincias();
            this.modalComponent.close();
            this.alertModal.open(
              'Actualizado',
              'La provincia ha sido actualizada correctamente.'
            );
          },
          error: (error) => {
            const err = this.errorHandler.getErrorData(error);
            this.alertModal.open(err.title, err.message, err.details);
          },
        });
    }

    this.provinciaEnModal = {};
  }

  eliminarProvincia(id: number): void {
    this.confirmModal
      .open('¿Estás seguro de que deseas eliminar esta provincia?', 'eliminar')
      .then((confirmado) => {
        if (confirmado) {
          this.crudService.delete('provincias', id).subscribe({
            next: () => {
              this.getProvincias();
              this.alertModal.open(
                'Eliminado',
                'La provincia ha sido eliminada correctamente.'
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
