import { Component, OnInit, ViewChild } from '@angular/core';
import { CrudService } from '../crud.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ModalFormComponent } from '../../shared/modal-form/modal-form.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';
import { ErrorHandlerService } from '../../core/error/errorhandler.service';

import { SucursalRequestDTO, SucursalResponseDTO } from '../../model/inventario/sucursal.model';
import { DistritoResponseDTO } from '../../model/inventario/distrito.model';
import { TipoSucursalComponent } from '../tipo-sucursal/tipoSucursal.component';
import { TipoSucursalResponseDTO } from '../../model/inventario/tipoSucursal.model';
@Component({
  selector: 'app-sucursal',
  imports: [
    FormsModule,
    NgFor,
    ModalFormComponent,
    ConfirmModalComponent,
    AlertModalComponent,
  ],
  templateUrl: './sucursal.component.html',
  styleUrls: ['../crud.component.css'], // sube una carpeta para llegar a "crud" donde está el CSS
})
export class SucursalComponent {
  sucursales: SucursalResponseDTO[] = [];
  distritos: DistritoResponseDTO[] = []; // ← lista de distritos
  tipossucursales : TipoSucursalResponseDTO [] = [];

  sucursalEnModal: Partial<SucursalRequestDTO & { idSucursal?: number }> = {};
  modalModo: 'crear' | 'editar' | 'ver' = 'crear';
  modalTitulo = '';

  @ViewChild('modal') modalComponent!: ModalFormComponent;
  @ViewChild('confirmModal') confirmModal!: ConfirmModalComponent;
  @ViewChild(AlertModalComponent) alertModal!: AlertModalComponent;

  constructor(
    private crudService: CrudService<SucursalResponseDTO, SucursalRequestDTO>,
    private distritoService: CrudService<DistritoResponseDTO>, // ← nuevo servicio para distritos
    private tipoSucursaleservice: CrudService<TipoSucursalResponseDTO>, // ← nuevo servicio para distritos

    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.getSucursales();
    this.getDistritos();
    this.getTiposSucursales();
  }

  getSucursales(): void {
    this.crudService.getAll('sucursales').subscribe({
      next: (data) => (this.sucursales = data),
      error: (error) => {
        const err = this.errorHandler.getErrorData(error);
        this.alertModal.open(err.title, err.message, err.details);
      },
    });
  }

  getDistritos(): void {
    this.distritoService.getAll('distritos').subscribe({
      next: (data) => (this.distritos = data),
      error: (error) => {
        const err = this.errorHandler.getErrorData(error);
        this.alertModal.open(err.title, err.message, err.details);
      },
    });
  }
   getTiposSucursales(): void {
    this.tipoSucursaleservice.getAll('tipos-sucursal').subscribe({
      next: (data) => (this.tipossucursales = data),
      error: (error) => {
        const err = this.errorHandler.getErrorData(error);
        this.alertModal.open(err.title, err.message, err.details);
      },
    });
  }

  abrirCrear(): void {
    this.modalModo = 'crear';
    this.modalTitulo = 'Crear Sucursal';
    this.sucursalEnModal = {};
    this.modalComponent.open();
  }

  abrirEditar(sucursal: SucursalResponseDTO): void {
    this.modalModo = 'editar';
    this.modalTitulo = 'Editar Sucursal';
    this.sucursalEnModal = { ...sucursal };
    this.modalComponent.open();
  }

  abrirVer(sucursal: SucursalResponseDTO): void {
    this.modalModo = 'ver';
    this.modalTitulo = 'Detalle del Sucursal';
    this.sucursalEnModal = { ...sucursal };
    this.modalComponent.open();
  }

  cancelarModal(): void {
    this.sucursalEnModal = {};
  }
  confirmarAccionModal(): void {
    const sucursalRequest: SucursalRequestDTO = {
      nombre: this.sucursalEnModal.nombre,
      idDistrito: this.sucursalEnModal.idDistrito!,
            idTipoSucursal: this.sucursalEnModal.idTipoSucursal!,

     
    };

    if (this.modalModo === 'crear') {
      this.crudService.create('sucursales', sucursalRequest).subscribe({
        next: () => {
          this.getSucursales();
          this.modalComponent.close();
          this.alertModal.open(
            'Creado',
            'El Sucursal ha sido creado exitosamente.'
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
        .update('sucursales', this.sucursalEnModal.idSucursal!, sucursalRequest)
        .subscribe({
          next: () => {
            this.getSucursales();
            this.modalComponent.close();
            this.alertModal.open(
              'Actualizado',
              'El Sucursal ha sido actualizado correctamente.'
            );
          },
          error: (error) => {
            const err = this.errorHandler.getErrorData(error);
            this.alertModal.open(err.title, err.message, err.details);
          },
        });
    }

    this.sucursalEnModal = {};
  }

  eliminarSucursal(id: number): void {
    this.confirmModal
      .open('¿Estás seguro de que deseas eliminar este Sucursal?', 'eliminar')
      .then((confirmado) => {
        if (confirmado) {
          this.crudService.delete('sucursales', id).subscribe({
            next: () => {
              this.getSucursales();
              this.alertModal.open(
                'Eliminado',
                'El Sucursal ha sido eliminado correctamente.'
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
