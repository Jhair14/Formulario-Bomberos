import axios from 'axios';
import { 
  ApiResponse, 
  Brigada, 
  CatalogoItem, 
  EquipamientoRopa, 
  EquipamientoBotas, 
  EquipamientoGuantes, 
  EquipamientoGenerico,
  CreateBrigadaRequest,
  CreateEquipamientoRopaRequest,
  CreateEquipamientoBotasRequest,
  CreateEquipamientoGuantesRequest,
  CreateEquipamientoGenericoRequest
} from '../types/api';

const API_BASE_URL = 'https://formulario-bomberos.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Brigadas
export const brigadasApi = {
  getAll: (): Promise<ApiResponse<Brigada[]>> => 
    api.get('/brigadas').then(res => res.data),
  
  getById: (id: number): Promise<ApiResponse<Brigada>> => 
    api.get(`/brigadas/${id}`).then(res => res.data),
  
  create: (data: CreateBrigadaRequest): Promise<ApiResponse<Brigada>> => 
    api.post('/brigadas', data).then(res => res.data),
  
  update: (id: number, data: CreateBrigadaRequest): Promise<ApiResponse<void>> => 
    api.put(`/brigadas/${id}`, data).then(res => res.data),
  
  delete: (id: number): Promise<ApiResponse<void>> => 
    api.delete(`/brigadas/${id}`).then(res => res.data),
};

// Catálogos
export const catalogosApi = {
  getTiposRopa: (): Promise<ApiResponse<CatalogoItem[]>> => 
    api.get('/catalogos/tipos-ropa').then(res => res.data),
  
  getEquipamientoEPP: (): Promise<ApiResponse<CatalogoItem[]>> => 
    api.get('/catalogos/equipamiento-epp').then(res => res.data),
  
  getHerramientas: (): Promise<ApiResponse<CatalogoItem[]>> => 
    api.get('/catalogos/herramientas').then(res => res.data),
  
  getServiciosVehiculos: (): Promise<ApiResponse<CatalogoItem[]>> => 
    api.get('/catalogos/servicios-vehiculos').then(res => res.data),
  
  getAlimentosBebidas: (): Promise<ApiResponse<CatalogoItem[]>> => 
    api.get('/catalogos/alimentos-bebidas').then(res => res.data),
  
  getEquipoCampo: (): Promise<ApiResponse<CatalogoItem[]>> => 
    api.get('/catalogos/equipo-campo').then(res => res.data),
  
  getLimpiezaPersonal: (): Promise<ApiResponse<CatalogoItem[]>> => 
    api.get('/catalogos/limpieza-personal').then(res => res.data),
  
  getLimpiezaGeneral: (): Promise<ApiResponse<CatalogoItem[]>> => 
    api.get('/catalogos/limpieza-general').then(res => res.data),
  
  getMedicamentos: (): Promise<ApiResponse<CatalogoItem[]>> => 
    api.get('/catalogos/medicamentos').then(res => res.data),
  
  getAlimentosAnimales: (): Promise<ApiResponse<CatalogoItem[]>> => 
    api.get('/catalogos/alimentos-animales').then(res => res.data),
};

// Equipamiento
export const equipamientoApi = {
  // Ropa
  getRopa: (brigadaId: number): Promise<ApiResponse<EquipamientoRopa[]>> => 
    api.get(`/equipamiento/${brigadaId}/ropa`).then(res => res.data),
  
  createRopa: (brigadaId: number, data: CreateEquipamientoRopaRequest): Promise<ApiResponse<{id: number}>> => 
    api.post(`/equipamiento/${brigadaId}/ropa`, data).then(res => res.data),
  
  deleteRopa: (brigadaId: number): Promise<ApiResponse<void>> => 
    api.delete(`/equipamiento/${brigadaId}/ropa`).then(res => res.data),
  
  // Botas
  getBotas: (brigadaId: number): Promise<ApiResponse<EquipamientoBotas[]>> => 
    api.get(`/equipamiento/${brigadaId}/botas`).then(res => res.data),
  
  createBotas: (brigadaId: number, data: CreateEquipamientoBotasRequest): Promise<ApiResponse<{id: number}>> => 
    api.post(`/equipamiento/${brigadaId}/botas`, data).then(res => res.data),
  
  deleteBotas: (brigadaId: number): Promise<ApiResponse<void>> => 
    api.delete(`/equipamiento/${brigadaId}/botas`).then(res => res.data),
  
  // Guantes
  getGuantes: (brigadaId: number): Promise<ApiResponse<EquipamientoGuantes[]>> => 
    api.get(`/equipamiento/${brigadaId}/guantes`).then(res => res.data),
  
  createGuantes: (brigadaId: number, data: CreateEquipamientoGuantesRequest): Promise<ApiResponse<{id: number}>> => 
    api.post(`/equipamiento/${brigadaId}/guantes`, data).then(res => res.data),
  
  deleteGuantes: (brigadaId: number): Promise<ApiResponse<void>> => 
    api.delete(`/equipamiento/${brigadaId}/guantes`).then(res => res.data),
  
  // Genérico
  getGenerico: (brigadaId: number, tipo: string): Promise<ApiResponse<EquipamientoGenerico[]>> => 
    api.get(`/equipamiento/${brigadaId}/${tipo}`).then(res => res.data),
  
  createGenerico: (brigadaId: number, tipo: string, data: CreateEquipamientoGenericoRequest): Promise<ApiResponse<{id: number}>> => 
    api.post(`/equipamiento/${brigadaId}/${tipo}`, data).then(res => res.data),
  
  deleteGenerico: (brigadaId: number, tipo: string): Promise<ApiResponse<void>> => 
    api.delete(`/equipamiento/${brigadaId}/${tipo}`).then(res => res.data),
};

export default api; 
