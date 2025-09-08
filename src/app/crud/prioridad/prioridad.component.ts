import { Component, OnInit, ViewChild } from '@angular/core';
import { CrudService } from '../crud.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ModalFormComponent } from '../../shared/modal-form/modal-form.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';
import { ErrorHandlerService } from '../../core/error/errorhandler.service';
import {
  PrioridadRequestDTO,
  PrioridadResponseDTO,
} from '../../model/prioridad.model';

@Component({
  selector: 'app-prioridad',
  imports: [
    FormsModule,
    NgFor,
    ModalFormComponent,
    ConfirmModalComponent,
    AlertModalComponent,
  ],
  templateUrl: './prioridad.component.html',
  styleUrls: ['../crud.component.css'], // sube una carpeta para llegar a "crud" donde está el CSS
})
export class PrioridadComponent implements OnInit {
  prioridades: PrioridadResponseDTO[] = [];
  prioridadEnModal: Partial<PrioridadResponseDTO> = {};
  modalModo: 'crear' | 'editar' | 'ver' = 'crear';
  modalTitulo = '';

  @ViewChild('modal') modalComponent!: ModalFormComponent;
  @ViewChild('confirmModal') confirmModal!: ConfirmModalComponent;
  @ViewChild(AlertModalComponent) alertModal!: AlertModalComponent;

  constructor(
    private crudService: CrudService<PrioridadResponseDTO, PrioridadRequestDTO>,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.getPrioridades();
  }

  getPrioridades(): void {
    this.crudService.getAll('prioridades').subscribe({
      next: (data) => (this.prioridades = data),
      error: (error) => {
        const err = this.errorHandler.getErrorData(error);
        this.alertModal.open(err.title, err.message, err.details);
      },
    });
  }

  abrirCrear(): void {
    this.modalModo = 'crear';
    this.modalTitulo = 'Crear Prioridad';
    this.prioridadEnModal = {};
    this.modalComponent.open();
  }

  abrirEditar(prioridad: PrioridadResponseDTO): void {
    this.modalModo = 'editar';
    this.modalTitulo = 'Editar Prioridades';
    this.prioridadEnModal = { ...prioridad };
    this.modalComponent.open();
  }

  abrirVer(prioridad: PrioridadResponseDTO): void {
    this.modalModo = 'ver';
    this.modalTitulo = 'Detalle de la Prioridad';
    this.prioridadEnModal = { ...prioridad };
    this.modalComponent.open();
  }

  cancelarModal(): void {
    this.prioridadEnModal = {};
  }

  confirmarAccionModal(): void {
    if (this.modalModo === 'crear') {
      this.crudService
        .create('prioridades', this.prioridadEnModal as PrioridadRequestDTO)
        .subscribe({
          next: () => {
            this.getPrioridades();
            this.modalComponent.close();
            this.alertModal.open(
              'Creado',
              'La prioridad ha sido creado exitosamente.'
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
          'prioridades',
          this.prioridadEnModal.idPrioridad!,
          this.prioridadEnModal as PrioridadRequestDTO
        )
        .subscribe({
          next: () => {
            this.getPrioridades();
            this.modalComponent.close();
            this.alertModal.open(
              'Actualizado',
              'La Prioridad ha sido actualizado correctamente.'
            );
          },
          error: (error) => {
            const err = this.errorHandler.getErrorData(error);
            this.alertModal.open(err.title, err.message, err.details);
          },
        });
    }

    this.prioridadEnModal = {};
  }

  eliminarPrioridad(id: number): void {
    this.confirmModal
      .open('¿Estás seguro de que deseas eliminar esta prioridad?', 'eliminar')
      .then((confirmado) => {
        if (confirmado) {
          this.crudService.delete('prioridades', id).subscribe({
            next: () => {
              this.getPrioridades();
              this.alertModal.open(
                'Eliminado',
                'La prioridad ha sido eliminado correctamente.'
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
