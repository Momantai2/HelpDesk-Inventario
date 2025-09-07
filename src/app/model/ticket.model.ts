import { Estado } from "./estado.model";
import { Prioridad } from "./prioridad.model";
import { Usuario } from "./usuario.model";

export interface Ticket {
  idTicket: number;
  titulo?: string;
  descripcion: string;
  estado?: Estado;
  prioridad?: Prioridad;
  usuario?: Usuario;
}
