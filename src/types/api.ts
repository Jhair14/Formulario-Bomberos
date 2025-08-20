// Tipos base
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}

// Brigada
export interface Brigada {
  id: number;
  nombre_brigada: string;
  cantidad_bomberos_activos: number;
  contacto_celular_comandante: string;
  encargado_logistica: string;
  contacto_celular_logistica: string;
  numero_emergencia_publico: string;
  fecha_registro: string;
  activo: boolean;
}

export interface CreateBrigadaRequest {
  NombreBrigada: string;
  CantidadBomberosActivos: number;
  ContactoCelularComandante: string;
  EncargadoLogistica: string;
  ContactoCelularLogistica: string;
  NumeroEmergenciaPublico: string;
}

// Catálogos
export interface CatalogoItem {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  fecha_creacion: string;
}

// Equipamiento
export interface EquipamientoRopa {
  id: number;
  brigada_id: number;
  tipo_ropa_id: number;
  tipo_ropa_nombre: string;
  cantidad_xs: number;
  cantidad_s: number;
  cantidad_m: number;
  cantidad_l: number;
  cantidad_xl: number;
  observaciones: string;
}

export interface EquipamientoBotas {
  id: number;
  brigada_id: number;
  talla_37: number;
  talla_38: number;
  talla_39: number;
  talla_40: number;
  talla_41: number;
  talla_42: number;
  talla_43: number;
  otra_talla: string;
  cantidad_otra_talla: number;
  observaciones: string;
}

export interface EquipamientoGuantes {
  id: number;
  brigada_id: number;
  talla_xs: number;
  talla_s: number;
  talla_m: number;
  talla_l: number;
  talla_xl: number;
  talla_xxl: number;
  otra_talla: string;
  cantidad_otra_talla: number;
  observaciones: string;
}

export interface EquipamientoGenerico {
  id: number;
  brigada_id: number;
  cantidad: number;
  observaciones: string;
  [key: string]: any; // Para campos específicos de cada tipo
}

// Requests para crear equipamiento
export interface CreateEquipamientoRopaRequest {
  TipoRopaID: number;
  CantidadXS: number;
  CantidadS: number;
  CantidadM: number;
  CantidadL: number;
  CantidadXL: number;
  Observaciones: string;
}

export interface CreateEquipamientoBotasRequest {
  Talla37: number;
  Talla38: number;
  Talla39: number;
  Talla40: number;
  Talla41: number;
  Talla42: number;
  Talla43: number;
  OtraTalla: string;
  CantidadOtraTalla: number;
  Observaciones: string;
}

export interface CreateEquipamientoGuantesRequest {
  TallaXS: number;
  TallaS: number;
  TallaM: number;
  TallaL: number;
  TallaXL: number;
  TallaXXL: number;
  OtraTalla: string;
  CantidadOtraTalla: number;
  Observaciones: string;
}

export interface CreateEquipamientoGenericoRequest {
  Cantidad: number;
  Observaciones: string;
  [key: string]: any; // Para campos específicos de cada tipo
} 