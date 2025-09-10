import { Component, OnInit, ViewChild } from '@angular/core';
import { CrudService } from '../crud.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ModalFormComponent } from '../../shared/modal-form/modal-form.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';
import { ErrorHandlerService } from '../../core/error/errorhandler.service';

import { DistritoRequestDTO, DistritoResponseDTO } from '../../model/inventario/distrito.model';
import { ProvinciaResponseDTO } from '../../model/inventario/provinciamodel';
@Component({
  selector: 'app-distrito',
  imports: [
    FormsModule,
    NgFor,
    ModalFormComponent,
    ConfirmModalComponent,
    AlertModalComponent,
  ],
  templateUrl: './distrito.component.html',
  styleUrls: ['../crud.component.css'], // sube una carpeta para llegar a "crud" donde está el CSS
})
export class DistritoComponent {
  distritos: DistritoResponseDTO[] = [];
  provincias: ProvinciaResponseDTO[] = []; // ← lista de provincias

  distritoEnModal: Partial<DistritoRequestDTO & { idDistrito?: number }> = {};
  modalModo: 'crear' | 'editar' | 'ver' = 'crear';
  modalTitulo = '';

  @ViewChild('modal') modalComponent!: ModalFormComponent;
  @ViewChild('confirmModal') confirmModal!: ConfirmModalComponent;
  @ViewChild(AlertModalComponent) alertModal!: AlertModalComponent;

  constructor(
    private crudService: CrudService<DistritoResponseDTO , DistritoRequestDTO>,
    private provinciaService: CrudService<ProvinciaResponseDTO>, // ← nuevo servicio para provincias

    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.getDistritos();
    this.getProvincias();
  }

  getDistritos(): void {
    this.crudService.getAll('distritos').subscribe({
      next: (data) => (this.distritos = data),
      error: (error) => {
        const err = this.errorHandler.getErrorData(error);
        this.alertModal.open(err.title, err.message, err.details);
      },
    });
  }

  getProvincias(): void {
    this.provinciaService.getAll('provincias').subscribe({
      next: (data) => (this.provincias = data),
      error: (error) => {
        const err = this.errorHandler.getErrorData(error);
        this.alertModal.open(err.title, err.message, err.details);
      },
    });
  }

  abrirCrear(): void {
    this.modalModo = 'crear';
    this.modalTitulo = 'Crear Distrito';
    this.distritoEnModal = {};
    this.modalComponent.open();
  }

  abrirEditar(distrito: DistritoResponseDTO): void {
    this.modalModo = 'editar';
    this.modalTitulo = 'Editar Distrito';
    this.distritoEnModal = { ...distrito };
    this.modalComponent.open();
  }

  abrirVer(distrito: DistritoResponseDTO): void {
    this.modalModo = 'ver';
    this.modalTitulo = 'Detalle del Distrito';
    this.distritoEnModal = { ...distrito };
    this.modalComponent.open();
  }

  cancelarModal(): void {
    this.distritoEnModal = {};
  }
  confirmarAccionModal(): void {
    const distritoRequest: DistritoRequestDTO = {
      nombre: this.distritoEnModal.nombre,
      idProvincia: this.distritoEnModal.idProvincia!,
    
    };

    if (this.modalModo === 'crear') {
      this.crudService.create('distritos', distritoRequest).subscribe({
        next: () => {
          this.getDistritos();
          this.modalComponent.close();
          this.alertModal.open(
            'Creado',
            'El Distrito ha sido creado exitosamente.'
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
        .update('distritos', this.distritoEnModal.idDistrito!, distritoRequest)
        .subscribe({
          next: () => {
            this.getDistritos();
            this.modalComponent.close();
            this.alertModal.open(
              'Actualizado',
              'El Distrito ha sido actualizado correctamente.'
            );
          },
          error: (error) => {
            const err = this.errorHandler.getErrorData(error);
            this.alertModal.open(err.title, err.message, err.details);
          },
        });
    }

    this.distritoEnModal = {};
  }

  eliminarDistrito(id: number): void {
    this.confirmModal
      .open('¿Estás seguro de que deseas eliminar este Distrito?', 'eliminar')
      .then((confirmado) => {
        if (confirmado) {
          this.crudService.delete('distritos', id).subscribe({
            next: () => {
              this.getDistritos();
              this.alertModal.open(
                'Eliminado',
                'El Distrito ha sido eliminado correctamente.'
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
