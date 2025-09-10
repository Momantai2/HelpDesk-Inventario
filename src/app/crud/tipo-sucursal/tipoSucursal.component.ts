import { Component, OnInit, ViewChild } from '@angular/core';
import { CrudService } from '../crud.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ModalFormComponent } from '../../shared/modal-form/modal-form.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';
import { ErrorHandlerService } from '../../core/error/errorhandler.service';
import { TipoSucursalRequestDTO, TipoSucursalResponseDTO } from '../../model/inventario/tipoSucursal.model';

@Component({
  selector: 'app-tiposucursal',
  imports: [
    FormsModule,
    NgFor,
    ModalFormComponent,
    ConfirmModalComponent,
    AlertModalComponent,
  ],
  templateUrl: './tiposucursal.component.html',
  styleUrls: ['../crud.component.css'], // sube una carpeta para llegar a "crud" donde está el CSS
})
export class TipoSucursalComponent implements OnInit {
  tiposucursales: TipoSucursalResponseDTO[] = [];
  tiposucursalEnModal: Partial<TipoSucursalResponseDTO> = {};
  modalModo: 'crear' | 'editar' | 'ver' = 'crear';
  modalTitulo = '';

  @ViewChild('modal') modalComponent!: ModalFormComponent;
  @ViewChild('confirmModal') confirmModal!: ConfirmModalComponent;
  @ViewChild(AlertModalComponent) alertModal!: AlertModalComponent;

  constructor(
    private crudService: CrudService<TipoSucursalResponseDTO, TipoSucursalRequestDTO>,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.getTipoSucursales();
  }

  getTipoSucursales(): void {
    this.crudService.getAll('tipos-sucursal').subscribe({
      next: (data) => (this.tiposucursales = data),
      error: (error) => {
        const err = this.errorHandler.getErrorData(error);
        this.alertModal.open(err.title, err.message, err.details);
      },
    });
  }

  abrirCrear(): void {
    this.modalModo = 'crear';
    this.modalTitulo = 'Crear tipos-sucursal';
    this.tiposucursalEnModal = {};
    this.modalComponent.open();
  }

  abrirEditar(tiposucursal: TipoSucursalResponseDTO): void {
    this.modalModo = 'editar';
    this.modalTitulo = 'Editar TipoSucursal';
    this.tiposucursalEnModal = { ...tiposucursal };
    this.modalComponent.open();
  }

  abrirVer(tiposucursal: TipoSucursalResponseDTO): void {
    this.modalModo = 'ver';
    this.modalTitulo = 'Detalle del TipoSucursal';
    this.tiposucursalEnModal = { ...tiposucursal };
    this.modalComponent.open();
  }

  cancelarModal(): void {
    this.tiposucursalEnModal = {};
  }

  confirmarAccionModal(): void {
    if (this.modalModo === 'crear') {
      this.crudService
        .create('tipos-sucursal', this.tiposucursalEnModal as TipoSucursalRequestDTO)
        .subscribe({
          next: () => {
            this.getTipoSucursales();
            this.modalComponent.close();
            this.alertModal.open(
              'Creado',
              'El tiposucursal ha sido creado exitosamente.'
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
          'tipos-sucursal',
          this.tiposucursalEnModal.idTipoSucursal!,
          this.tiposucursalEnModal as TipoSucursalRequestDTO
        )
        .subscribe({
          next: () => {
            this.getTipoSucursales();
            this.modalComponent.close();
            this.alertModal.open(
              'Actualizado',
              'El tiposucursal ha sido actualizado correctamente.'
            );
          },
          error: (error) => {
            const err = this.errorHandler.getErrorData(error);
            this.alertModal.open(err.title, err.message, err.details);
          },
        });
    }

    this.tiposucursalEnModal = {};
  }

  eliminaTipoSucursal(id: number): void {
    this.confirmModal
      .open('¿Estás seguro de que deseas eliminar este tiposucursal?', 'eliminar')
      .then((confirmado) => {
        if (confirmado) {
          this.crudService.delete('tipos-sucursal', id).subscribe({
            next: () => {
              this.getTipoSucursales();
              this.alertModal.open(
                'Eliminado',
                'El tiposucursal ha sido eliminado correctamente.'
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
