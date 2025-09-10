import { UsuarioResponseDTO } from './usuario.model';

export interface ComentarioRequestDTO {
  texto: string;
  idTicket: number;
  idUsuario: number;
}
export interface ComentarioResponseDTO {
  idComentario: number;
  texto: string;
  idTicket: number;
  nombreusuarioactual: string;
  idUsuario: number;
  fechaCreacion: string;
}
