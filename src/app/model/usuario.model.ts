import { RolResponseDTO } from "./rol.model";

export interface UsuarioResponseDTO {
  idUsuario: number;
  nombre?: string;
  email: string;
  password?: string;
  rol: RolResponseDTO;
}

export interface UsuarioRequestDTO {
  nombre?: string;
  email: string;
  password?: string;
  idRol: number;
}
