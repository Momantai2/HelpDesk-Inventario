import { UsuarioResponseDTO } from './usuario.model';

export interface TicketResponseDTO {
  idTicket: number;
  titulo?: string;
  descripcion: string;
  idEstado: number;
  idPrioridad: number;
  usuario: UsuarioResponseDTO;
}
export interface TicketRequestDTO {
  titulo?: string;
  descripcion: string;
  idEstado: number;
  idPrioridad: number;
  idUsuario: number;
}
