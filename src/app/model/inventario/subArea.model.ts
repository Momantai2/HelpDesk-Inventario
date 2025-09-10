import { AreaResponseDTO } from './area.model';
import { SucursalResponseDTO } from './sucursal.model';
import { TipoSubAreaResponseDTO } from './tipoSubArea.model';

export interface SubAreaResponseDTO {
  idSubArea: number;
  tipoSubArea: TipoSubAreaResponseDTO;
  sucursal: SucursalResponseDTO;
}

export interface SubAreaRequestDTO {
  idTipoSubArea?: number;
  idSucursal?: number;
}
