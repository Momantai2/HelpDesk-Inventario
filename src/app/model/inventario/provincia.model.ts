// provincia-request.ts
export interface ProvinciaRequest {
  nombre: string;
  idDepartamento: number;
}

// provincia-response.ts
export interface ProvinciaResponse {
  id: number;
  nombre: string;
  idDepartamento: number;
  departamentoNombre?: string; // si el backend lo devuelve
}
