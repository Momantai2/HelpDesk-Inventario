import { ProvinciaResponseDTO } from "./provinciamodel";

export interface DistritoRequestDTO {
  nombre?: string;
  idProvincia: Number
}
export interface DistritoResponseDTO {
  idDistrito: number;
  nombre?: string;
  provincia : ProvinciaResponseDTO
}
