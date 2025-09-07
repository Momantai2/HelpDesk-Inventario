import { Ticket } from "./ticket.model";
import { Usuario } from "./usuario.model";

export interface Comentario {
  idComentario?: number;       // Ahora opcional para crear
  texto: string;
  ticket: Ticket;              // Solo el ID del ticket
  usuario: Usuario;             // Solo el ID del usuario
      fechaCreacion?: string; 

}
