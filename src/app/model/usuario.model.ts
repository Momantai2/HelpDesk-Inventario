import { Rol } from "./rol.model";

export interface Usuario {
  idUsuario: number;
  nombre?: string;
  email: string;
  password?: string;
  rol : Rol;
}
