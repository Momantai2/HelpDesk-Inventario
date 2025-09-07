import { Component, OnInit, ViewChild } from '@angular/core';
import { CrudService } from '../crud.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ModalFormComponent } from "../../shared/modal-form/modal-form.component";
import { ConfirmModalComponent } from "../../shared/confirm-modal/confirm-modal.component";
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';
import { ErrorHandlerService } from '../../core/error/errorhandler.service';
import { Estado } from '../../model/estado.model';

@Component({
  selector: 'app-estado',
  imports: [FormsModule, NgFor, ModalFormComponent, ConfirmModalComponent, AlertModalComponent],
  templateUrl: './estado.component.html',
  styleUrls: ['../crud.component.css']  // sube una carpeta para llegar a "crud" donde está el CSS
})
export class EstadoComponent implements OnInit {

 
  estados: Estado[] = [];
  estadoEnModal: Partial<Estado> = {};
  modalModo: 'crear' | 'editar' | 'ver' = 'crear';
  modalTitulo = '';

  @ViewChild('modal') modalComponent!: ModalFormComponent;
  @ViewChild('confirmModal') confirmModal!: ConfirmModalComponent;
  @ViewChild(AlertModalComponent) alertModal!: AlertModalComponent;

  constructor(
    private crudService: CrudService<Estado>,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.getEstados();
  }

  getEstados(): void {
    this.crudService.getAll('estados').subscribe({
      next: (data) => this.estados = data,
      error: (error) => {
        const err = this.errorHandler.getErrorData(error);
        this.alertModal.open(err.title, err.message, err.details);
      }
    });
  }

  abrirCrear(): void {
    this.modalModo = 'crear';
    this.modalTitulo = 'Crear Estado';
    this.estadoEnModal = {};
    this.modalComponent.open();
  }

  abrirEditar(estado: Estado): void {
    this.modalModo = 'editar';
    this.modalTitulo = 'Editar Estado';
    this.estadoEnModal = { ...estado };
    this.modalComponent.open();
  }

  abrirVer(estado: Estado): void {
    this.modalModo = 'ver';
    this.modalTitulo = 'Detalle del Estado';
    this.estadoEnModal = { ...estado };
    this.modalComponent.open();
  }

  cancelarModal(): void {
    this.estadoEnModal = {};
  }

  confirmarAccionModal(): void {
    if (this.modalModo === 'crear') {
      this.crudService.create('estados', this.estadoEnModal as Estado).subscribe({
        next: () => {
          this.getEstados();
          this.modalComponent.close();
          this.alertModal.open('Creado', 'El estado ha sido creado exitosamente.');
        },
        error: (error) => {
          const err = this.errorHandler.getErrorData(error);
          this.alertModal.open(err.title, err.message, err.details);
        }
      });
    }

    if (this.modalModo === 'editar') {
      this.crudService.update('estados', this.estadoEnModal.idEstado!, this.estadoEnModal as Estado).subscribe({
        next: () => {
          this.getEstados();
          this.modalComponent.close();
          this.alertModal.open('Actualizado', 'El estado ha sido actualizado correctamente.');
        },
        error: (error) => {
          const err = this.errorHandler.getErrorData(error);
          this.alertModal.open(err.title, err.message, err.details);
        }
      });
    }

    this.estadoEnModal = {};
  }

  eliminaEstado(id: number): void {
    this.confirmModal
      .open('¿Estás seguro de que deseas eliminar este estado?', 'eliminar')
      .then((confirmado) => {
        if (confirmado) {
          this.crudService.delete('estados', id).subscribe({
            next: () => {
              this.getEstados();
              this.alertModal.open('Eliminado', 'El estado ha sido eliminado correctamente.');
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
