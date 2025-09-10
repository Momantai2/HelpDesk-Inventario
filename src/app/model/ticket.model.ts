import { EstadoResponseDTO } from './estado.model';
import { PrioridadResponseDTO } from './prioridad.model';
import { UsuarioResponseDTO } from './usuario.model';

export interface TicketResponseDTO {
  idTicket: number;
  titulo?: string;
  descripcion: string;
  estado: EstadoResponseDTO;
  prioridad: PrioridadResponseDTO;
  usuario: UsuarioResponseDTO;
}
export interface TicketRequestDTO {
  titulo?: string;
  descripcion: string;
  idEstado: number;
  idPrioridad: number;
  idUsuario: number;
}
