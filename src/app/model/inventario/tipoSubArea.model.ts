import { AreaResponseDTO } from './area.model';

export interface TipoSubAreaRequestDTO {
  nombre: string;
  idArea: number;
}

export interface TipoSubAreaResponseDTO {
  idTipoSubArea: number;
  nombre: string;
  area: AreaResponseDTO;
}
