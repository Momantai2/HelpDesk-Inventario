import { Component, OnInit, ViewChild } from '@angular/core';
import { CrudService } from '../crud.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ModalFormComponent } from '../../shared/modal-form/modal-form.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';
import { ErrorHandlerService } from '../../core/error/errorhandler.service';

import {
  SubAreaRequestDTO,
  SubAreaResponseDTO,
} from '../../model/inventario/subArea.model';
import { AreaResponseDTO } from '../../model/inventario/area.model';
import { SucursalResponseDTO } from '../../model/inventario/sucursal.model';
import { tipoSubAreaComponent } from '../tipoSubArea/tipoSubArea.component';
import { TipoSubAreaResponseDTO } from '../../model/inventario/tipoSubArea.model';
@Component({
  selector: 'app-subarea',
  imports: [
    FormsModule,
    NgFor,
    ModalFormComponent,
    ConfirmModalComponent,
    AlertModalComponent,
  ],
  templateUrl: './subarea.component.html',
  styleUrls: ['../crud.component.css'], // sube una carpeta para llegar a "crud" donde está el CSS
})
export class SubAreaComponent {
  subareas: SubAreaResponseDTO[] = [];
  sucursales: SucursalResponseDTO[] = []; // ← lista de areas
  tipoSubAreas: TipoSubAreaResponseDTO[] = []; // ← lista de areas
  subareaEnModal: Partial<SubAreaRequestDTO & { idSubArea?: number }> = {};
  modalModo: 'crear' | 'editar' | 'ver' = 'crear';
  modalTitulo = '';

  @ViewChild('modal') modalComponent!: ModalFormComponent;
  @ViewChild('confirmModal') confirmModal!: ConfirmModalComponent;
  @ViewChild(AlertModalComponent) alertModal!: AlertModalComponent;

  constructor(
    private crudService: CrudService<SubAreaResponseDTO, SubAreaRequestDTO>,
    private sucursalService: CrudService<SucursalResponseDTO>, // ← nuevo servicio para areas
    private tipoSubAreaService: CrudService<TipoSubAreaResponseDTO>, // ← nuevo servicio para areas

    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.getSubAreas();
    this.getSucursales();
    this.getTipoSubArea();
  }

  getSubAreas(): void {
    this.crudService.getAll('subareas').subscribe({
      next: (data) => (this.subareas = data),
      error: (error) => {
        const err = this.errorHandler.getErrorData(error);
        this.alertModal.open(err.title, err.message, err.details);
      },
    });
  }

  getSucursales(): void {
    this.sucursalService.getAll('sucursales').subscribe({
      next: (data) => (this.sucursales = data),
      error: (error) => {
        const err = this.errorHandler.getErrorData(error);
        this.alertModal.open(err.title, err.message, err.details);
      },
    });
  }
  getTipoSubArea(): void {
    this.tipoSubAreaService.getAll('tipo-subArea').subscribe({
      next: (data) => (this.tipoSubAreas = data),
      error: (error) => {
        const err = this.errorHandler.getErrorData(error);
        this.alertModal.open(err.title, err.message, err.details);
      },
    });
  }

  abrirCrear(): void {
    this.modalModo = 'crear';
    this.modalTitulo = 'Crear SubArea';
    this.subareaEnModal = {};
    this.modalComponent.open();
  }

  abrirEditar(subarea: SubAreaResponseDTO): void {
    this.modalModo = 'editar';
    this.modalTitulo = 'Editar SubArea';
    this.subareaEnModal = { ...subarea };
    this.modalComponent.open();
  }

  abrirVer(subarea: SubAreaResponseDTO): void {
    this.modalModo = 'ver';
    this.modalTitulo = 'Detalle del SubArea';
    this.subareaEnModal = { ...subarea };
    this.modalComponent.open();
  }

  cancelarModal(): void {
    this.subareaEnModal = {};
  }
  confirmarAccionModal(): void {
    const subareaRequest: SubAreaRequestDTO = {
      idTipoSubArea: this.subareaEnModal.idTipoSubArea,
      idSucursal: this.subareaEnModal.idSucursal,
    };

    if (this.modalModo === 'crear') {
      this.crudService.create('subareas', subareaRequest).subscribe({
        next: () => {
          this.getSubAreas();
          this.modalComponent.close();
          this.alertModal.open(
            'Creado',
            'El SubArea ha sido creado exitosamente.'
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
        .update('subareas', this.subareaEnModal.idSubArea!, subareaRequest)
        .subscribe({
          next: () => {
            this.getSubAreas();
            this.modalComponent.close();
            this.alertModal.open(
              'Actualizado',
              'El SubArea ha sido actualizado correctamente.'
            );
          },
          error: (error) => {
            const err = this.errorHandler.getErrorData(error);
            this.alertModal.open(err.title, err.message, err.details);
          },
        });
    }

    this.subareaEnModal = {};
  }

  eliminarSubArea(id: number): void {
    this.confirmModal
      .open('¿Estás seguro de que deseas eliminar este SubArea?', 'eliminar')
      .then((confirmado) => {
        if (confirmado) {
          this.crudService.delete('subareas', id).subscribe({
            next: () => {
              this.getSubAreas();
              this.alertModal.open(
                'Eliminado',
                'El SubArea ha sido eliminado correctamente.'
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
