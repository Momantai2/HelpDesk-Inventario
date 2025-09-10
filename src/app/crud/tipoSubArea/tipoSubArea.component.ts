import { Component, OnInit, ViewChild } from '@angular/core';
import { CrudService } from '../crud.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ModalFormComponent } from '../../shared/modal-form/modal-form.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';
import { ErrorHandlerService } from '../../core/error/errorhandler.service';
import {
  TipoSubAreaRequestDTO,
  TipoSubAreaResponseDTO,
} from '../../model/inventario/tipoSubArea.model';
import { AreaResponseDTO } from '../../model/inventario/area.model';

@Component({
  selector: 'app-tipoSubArea',
  imports: [
    FormsModule,
    NgFor,
    ModalFormComponent,
    ConfirmModalComponent,
    AlertModalComponent,
  ],
  templateUrl: './tipoSubArea.component.html',
  styleUrls: ['../crud.component.css'], // sube una carpeta para llegar a "crud" donde está el CSS
})
export class tipoSubAreaComponent implements OnInit {
  tipoSubAreas: TipoSubAreaResponseDTO[] = [];
  tipoSubAreaEnModal: Partial<
    TipoSubAreaRequestDTO & { idTipoSubArea?: number }
  > = {};
  areas: AreaResponseDTO[] = []; // ← lista de areas

  modalModo: 'crear' | 'editar' | 'ver' = 'crear';
  modalTitulo = '';

  @ViewChild('modal') modalComponent!: ModalFormComponent;
  @ViewChild('confirmModal') confirmModal!: ConfirmModalComponent;
  @ViewChild(AlertModalComponent) alertModal!: AlertModalComponent;

  constructor(
    private crudService: CrudService<
      TipoSubAreaResponseDTO,
      TipoSubAreaRequestDTO
    >,
    private errorHandler: ErrorHandlerService,
    private areaService: CrudService<AreaResponseDTO> // ← nuevo servicio para areas
  ) {}

  ngOnInit(): void {
    this.gettipoSubAreas();
    this.getAreas();
  }

  gettipoSubAreas(): void {
    this.crudService.getAll('tipo-subArea').subscribe({
      next: (data) => (this.tipoSubAreas = data),
      error: (error) => {
        const err = this.errorHandler.getErrorData(error);
        this.alertModal.open(err.title, err.message, err.details);
      },
    });
  }

  getAreas(): void {
    this.areaService.getAll('areas').subscribe({
      next: (data) => (this.areas = data),
      error: (error) => {
        const err = this.errorHandler.getErrorData(error);
        this.alertModal.open(err.title, err.message, err.details);
      },
    });
  }

  abrirCrear(): void {
    this.modalModo = 'crear';
    this.modalTitulo = 'Crear tipoSubArea';
    this.tipoSubAreaEnModal = {};
    this.modalComponent.open();
  }

  abrirEditar(tipoSubArea: TipoSubAreaResponseDTO): void {
    this.modalModo = 'editar';
    this.modalTitulo = 'Editar tipoSubArea';
    this.tipoSubAreaEnModal = { ...tipoSubArea };
    this.modalComponent.open();
  }

  abrirVer(tipoSubArea: TipoSubAreaResponseDTO): void {
    this.modalModo = 'ver';
    this.modalTitulo = 'Detalle del tipoSubArea';
    this.tipoSubAreaEnModal = { ...tipoSubArea };
    this.modalComponent.open();
  }

  cancelarModal(): void {
    this.tipoSubAreaEnModal = {};
  }
  confirmarAccionModal(): void {
    const tiposubareaRequest: TipoSubAreaRequestDTO = {
      nombre: this.tipoSubAreaEnModal.nombre!, // <- nombre obligatorio
      idArea: this.tipoSubAreaEnModal.idArea!, // <- idArea obligatorio
    };

    if (this.modalModo === 'crear') {
      this.crudService.create('tipo-subArea', tiposubareaRequest).subscribe({
        next: () => {
          this.gettipoSubAreas();
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
        .update(
          'tipo-subArea',
          this.tipoSubAreaEnModal.idTipoSubArea!,
          tiposubareaRequest
        )
        .subscribe({
          next: () => {
            this.gettipoSubAreas();
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

    this.tipoSubAreaEnModal = {};
  }

  eliminatipoSubArea(id: number): void {
    this.confirmModal
      .open(
        '¿Estás seguro de que deseas eliminar este tipoSubArea?',
        'eliminar'
      )
      .then((confirmado) => {
        if (confirmado) {
          this.crudService.delete('tipo-subArea', id).subscribe({
            next: () => {
              this.gettipoSubAreas();
              this.alertModal.open(
                'Eliminado',
                'El tipoSubArea ha sido eliminado correctamente.'
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
