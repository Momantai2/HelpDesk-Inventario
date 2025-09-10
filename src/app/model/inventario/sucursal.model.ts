import { DistritoResponseDTO } from "./distrito.model";
import { TipoSucursalResponseDTO } from "./tipoSucursal.model";

export interface SucursalRequestDTO {
  nombre?: string;
  idDistrito : Number;
  idTipoSucursal : Number;
}
export interface SucursalResponseDTO {
  idSucursal: number;
  nombre?: string;
  distrito : DistritoResponseDTO
  tiposucursal : TipoSucursalResponseDTO
}
