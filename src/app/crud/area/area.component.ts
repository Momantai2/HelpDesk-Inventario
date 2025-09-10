import { Component, OnInit, ViewChild } from '@angular/core';
import { CrudService } from '../crud.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ModalFormComponent } from '../../shared/modal-form/modal-form.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';
import { ErrorHandlerService } from '../../core/error/errorhandler.service';
import { AreaRequestDTO, AreaResponseDTO } from '../../model/inventario/area.model';

@Component({
  selector: 'app-area',
  imports: [
    FormsModule,
    NgFor,
    ModalFormComponent,
    ConfirmModalComponent,
    AlertModalComponent,
  ],
  templateUrl: './area.component.html',
  styleUrls: ['../crud.component.css'], // sube una carpeta para llegar a "crud" donde está el CSS
})
export class AreaComponent implements OnInit {
  areas: AreaResponseDTO[] = [];
  areaEnModal: Partial<AreaResponseDTO> = {};
  modalModo: 'crear' | 'editar' | 'ver' = 'crear';
  modalTitulo = '';

  @ViewChild('modal') modalComponent!: ModalFormComponent;
  @ViewChild('confirmModal') confirmModal!: ConfirmModalComponent;
  @ViewChild(AlertModalComponent) alertModal!: AlertModalComponent;

  constructor(
    private crudService: CrudService<AreaResponseDTO, AreaRequestDTO>,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.getAreas();
  }

  getAreas(): void {
    this.crudService.getAll('areas').subscribe({
      next: (data) => (this.areas = data),
      error: (error) => {
        const err = this.errorHandler.getErrorData(error);
        this.alertModal.open(err.title, err.message, err.details);
      },
    });
  }

  abrirCrear(): void {
    this.modalModo = 'crear';
    this.modalTitulo = 'Crear Area';
    this.areaEnModal = {};
    this.modalComponent.open();
  }

  abrirEditar(area: AreaResponseDTO): void {
    this.modalModo = 'editar';
    this.modalTitulo = 'Editar Area';
    this.areaEnModal = { ...area };
    this.modalComponent.open();
  }

  abrirVer(area: AreaResponseDTO): void {
    this.modalModo = 'ver';
    this.modalTitulo = 'Detalle del Area';
    this.areaEnModal = { ...area };
    this.modalComponent.open();
  }

  cancelarModal(): void {
    this.areaEnModal = {};
  }

  confirmarAccionModal(): void {
    if (this.modalModo === 'crear') {
      this.crudService
        .create('areas', this.areaEnModal as AreaRequestDTO)
        .subscribe({
          next: () => {
            this.getAreas();
            this.modalComponent.close();
            this.alertModal.open(
              'Creado',
              'El area ha sido creado exitosamente.'
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
          'areas',
          this.areaEnModal.idArea!,
          this.areaEnModal as AreaRequestDTO
        )
        .subscribe({
          next: () => {
            this.getAreas();
            this.modalComponent.close();
            this.alertModal.open(
              'Actualizado',
              'El area ha sido actualizado correctamente.'
            );
          },
          error: (error) => {
            const err = this.errorHandler.getErrorData(error);
            this.alertModal.open(err.title, err.message, err.details);
          },
        });
    }

    this.areaEnModal = {};
  }

  eliminaArea(id: number): void {
    this.confirmModal
      .open('¿Estás seguro de que deseas eliminar este area?', 'eliminar')
      .then((confirmado) => {
        if (confirmado) {
          this.crudService.delete('areas', id).subscribe({
            next: () => {
              this.getAreas();
              this.alertModal.open(
                'Eliminado',
                'El area ha sido eliminado correctamente.'
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
