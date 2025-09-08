export interface UsuarioResponseDTO {
  idUsuario: number;
  nombre?: string;
  email: string;
  password?: string;
  idRol: number;
}

export interface UsuarioRequestDTO {
  nombre?: string;
  email: string;
  password?: string;
  idRol: number;
}
