import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  Phone, 
  User,
  Package,
  Settings,
  Calendar,
  MapPin,
  AlertTriangle,
  Loader,
  Shield,
  Wrench,
  Car,
  Coffee,
  Tent,
  Droplets,
  Sparkles,
  Pill,
  PawPrint
} from 'lucide-react';
import { brigadasApi, equipamientoApi } from '../services/api';
import { Brigada, EquipamientoRopa, EquipamientoBotas, EquipamientoGuantes, EquipamientoGenerico } from '../types/api';

interface BrigadaDetailsData {
  brigada: Brigada | null;
  equipamiento: {
    ropa: EquipamientoRopa[];
    botas: EquipamientoBotas[];
    guantes: EquipamientoGuantes[];
    epp: EquipamientoGenerico[];
    herramientas: EquipamientoGenerico[];
    serviciosVehiculos: EquipamientoGenerico[];
    alimentosBebidas: EquipamientoGenerico[];
    equipoCampo: EquipamientoGenerico[];
    limpiezaPersonal: EquipamientoGenerico[];
    limpiezaGeneral: EquipamientoGenerico[];
    medicamentos: EquipamientoGenerico[];
    alimentosAnimales: EquipamientoGenerico[];
  };
}

const BrigadaDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<BrigadaDetailsData>({
    brigada: null,
    equipamiento: {
      ropa: [],
      botas: [],
      guantes: [],
      epp: [],
      herramientas: [],
      serviciosVehiculos: [],
      alimentosBebidas: [],
      equipoCampo: [],
      limpiezaPersonal: [],
      limpiezaGeneral: [],
      medicamentos: [],
      alimentosAnimales: []
    }
  });

  useEffect(() => {
    if (id) {
      fetchBrigadaDetails(parseInt(id));
    }
  }, [id]);

  const fetchBrigadaDetails = async (brigadaId: number) => {
    try {
      setLoading(true);
      setError(null);

      // Obtener datos de la brigada
      const brigadaResponse = await brigadasApi.getById(brigadaId);
      if (!brigadaResponse.success || !brigadaResponse.data) {
        throw new Error('No se pudo cargar la información de la brigada');
      }

      // Obtener todo el equipamiento
      const [
        ropaResponse,
        botasResponse,
        guantesResponse,
        eppResponse,
        herramientasResponse,
        serviciosVehiculosResponse,
        alimentosBebidasResponse,
        equipoCampoResponse,
        limpiezaPersonalResponse,
        limpiezaGeneralResponse,
        medicamentosResponse,
        alimentosAnimalesResponse
      ] = await Promise.all([
        equipamientoApi.getRopa(brigadaId),
        equipamientoApi.getBotas(brigadaId),
        equipamientoApi.getGuantes(brigadaId),
        equipamientoApi.getGenerico(brigadaId, 'epp'),
        equipamientoApi.getGenerico(brigadaId, 'herramientas'),
        equipamientoApi.getGenerico(brigadaId, 'logistica-vehiculos'),
        equipamientoApi.getGenerico(brigadaId, 'alimentacion'),
        equipamientoApi.getGenerico(brigadaId, 'equipo-campo'),
        equipamientoApi.getGenerico(brigadaId, 'limpieza-personal'),
        equipamientoApi.getGenerico(brigadaId, 'limpieza-general'),
        equipamientoApi.getGenerico(brigadaId, 'medicamentos'),
        equipamientoApi.getGenerico(brigadaId, 'rescate-animal')
      ]);

      setData({
        brigada: brigadaResponse.data,
        equipamiento: {
          ropa: ropaResponse.data || [],
          botas: botasResponse.data || [],
          guantes: guantesResponse.data || [],
          epp: eppResponse.data || [],
          herramientas: herramientasResponse.data || [],
          serviciosVehiculos: serviciosVehiculosResponse.data || [],
          alimentosBebidas: alimentosBebidasResponse.data || [],
          equipoCampo: equipoCampoResponse.data || [],
          limpiezaPersonal: limpiezaPersonalResponse.data || [],
          limpiezaGeneral: limpiezaGeneralResponse.data || [],
          medicamentos: medicamentosResponse.data || [],
          alimentosAnimales: alimentosAnimalesResponse.data || []
        }
      });

    } catch (err) {
      setError('Error al cargar los detalles de la brigada');
      console.error('Error fetching brigada details:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalQuantity = (quantities: number[]) => {
    return quantities.reduce((sum, qty) => sum + qty, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !data.brigada) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/brigadas')}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar la brigada</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/brigadas')}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{data.brigada.nombre_brigada}</h1>
            <p className="text-gray-600">Detalles completos de la brigada</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            data.brigada.activo 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {data.brigada.activo ? 'Activa' : 'Inactiva'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Principal */}
        <div className="lg:col-span-1 space-y-6">
          {/* Información General */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary-600" />
              <span>Información General</span>
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Nombre de la Brigada</label>
                <p className="text-gray-900 font-medium">{data.brigada.nombre_brigada}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Bomberos Activos</label>
                <p className="text-gray-900 font-medium">{data.brigada.cantidad_bomberos_activos}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Fecha de Registro</label>
                <p className="text-gray-900 font-medium">{formatDate(data.brigada.fecha_registro)}</p>
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Phone className="h-5 w-5 text-primary-600" />
              <span>Información de Contacto</span>
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Celular del Comandante</label>
                <p className="text-gray-900 font-medium">
                  {data.brigada.contacto_celular_comandante || 'No especificado'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Número de Emergencia Público</label>
                <p className="text-gray-900 font-medium">
                  {data.brigada.numero_emergencia_publico || 'No especificado'}
                </p>
              </div>
            </div>
          </div>

          {/* Información de Logística */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <User className="h-5 w-5 text-primary-600" />
              <span>Información de Logística</span>
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Encargado de Logística</label>
                <p className="text-gray-900 font-medium">
                  {data.brigada.encargado_logistica || 'No especificado'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Celular de Logística</label>
                <p className="text-gray-900 font-medium">
                  {data.brigada.contacto_celular_logistica || 'No especificado'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Equipamiento */}
        <div className="lg:col-span-2 space-y-6">
          {/* Equipamiento Personal */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Package className="h-5 w-5 text-primary-600" />
              <span>Equipamiento Personal</span>
            </h2>
            
            {/* Ropa */}
            {data.equipamiento.ropa.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-800 mb-3">Ropa de Trabajo</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">XS</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">S</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">M</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">L</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">XL</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.equipamiento.ropa.map((ropa, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2 text-sm text-gray-900">{ropa.tipo_ropa_nombre}</td>
                          <td className="px-3 py-2 text-sm text-center text-gray-900">{ropa.cantidad_xs}</td>
                          <td className="px-3 py-2 text-sm text-center text-gray-900">{ropa.cantidad_s}</td>
                          <td className="px-3 py-2 text-sm text-center text-gray-900">{ropa.cantidad_m}</td>
                          <td className="px-3 py-2 text-sm text-center text-gray-900">{ropa.cantidad_l}</td>
                          <td className="px-3 py-2 text-sm text-center text-gray-900">{ropa.cantidad_xl}</td>
                          <td className="px-3 py-2 text-sm text-center font-medium text-primary-600">
                            {getTotalQuantity([ropa.cantidad_xs, ropa.cantidad_s, ropa.cantidad_m, ropa.cantidad_l, ropa.cantidad_xl])}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Botas */}
            {data.equipamiento.botas.length > 0 && data.equipamiento.botas[0] && (
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-800 mb-3">Botas de Seguridad</h3>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
                  {[37, 38, 39, 40, 41, 42, 43].map((talla) => (
                    <div key={talla} className="text-center">
                      <div className="text-sm font-medium text-gray-500">Talla {talla}</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {data.equipamiento.botas[0][`talla_${talla}` as keyof EquipamientoBotas] as number}
                      </div>
                    </div>
                  ))}
                </div>
                {data.equipamiento.botas[0].otra_talla && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-500">Otra Talla</div>
                    <div className="text-gray-900">{data.equipamiento.botas[0].otra_talla} - {data.equipamiento.botas[0].cantidad_otra_talla} unidades</div>
                  </div>
                )}
              </div>
            )}

            {/* Guantes */}
            {data.equipamiento.guantes.length > 0 && data.equipamiento.guantes[0] && (
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-800 mb-3">Guantes</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((talla) => (
                    <div key={talla} className="text-center">
                      <div className="text-sm font-medium text-gray-500">Talla {talla}</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {data.equipamiento.guantes[0][`talla_${talla.toLowerCase()}` as keyof EquipamientoGuantes] as number}
                      </div>
                    </div>
                  ))}
                </div>
                {data.equipamiento.guantes[0].otra_talla && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-500">Otra Talla</div>
                    <div className="text-gray-900">{data.equipamiento.guantes[0].otra_talla} - {data.equipamiento.guantes[0].cantidad_otra_talla} unidades</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Equipamiento General */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Settings className="h-5 w-5 text-primary-600" />
              <span>Equipamiento General</span>
            </h2>
            
            {/* EPP */}
            {data.equipamiento.epp.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span>Equipamiento de Protección Personal (EPP)</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Equipo</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Observaciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.equipamiento.epp.map((item, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2 text-sm text-gray-900">{item.equipo_nombre}</td>
                          <td className="px-3 py-2 text-sm text-center text-gray-900">{item.cantidad}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{item.observaciones || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Herramientas */}
            {data.equipamiento.herramientas.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center space-x-2">
                  <Wrench className="h-4 w-4 text-orange-600" />
                  <span>Herramientas</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Herramienta</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Observaciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.equipamiento.herramientas.map((item, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2 text-sm text-gray-900">{item.herramienta_nombre}</td>
                          <td className="px-3 py-2 text-sm text-center text-gray-900">{item.cantidad}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{item.observaciones || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Servicios de Vehículos */}
            {data.equipamiento.serviciosVehiculos.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center space-x-2">
                  <Car className="h-4 w-4 text-purple-600" />
                  <span>Servicios de Vehículos</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Servicio</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Monto Aproximado</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Observaciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.equipamiento.serviciosVehiculos.map((item, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2 text-sm text-gray-900">{item.servicio_nombre}</td>
                          <td className="px-3 py-2 text-sm text-center text-gray-900">
                            ${item.monto_aproximado?.toLocaleString() || '0'}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-900">{item.observaciones || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Alimentos y Bebidas */}
            {data.equipamiento.alimentosBebidas.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center space-x-2">
                  <Coffee className="h-4 w-4 text-amber-600" />
                  <span>Alimentos y Bebidas</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Alimento/Bebida</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Observaciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.equipamiento.alimentosBebidas.map((item, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2 text-sm text-gray-900">{item.alimento_nombre}</td>
                          <td className="px-3 py-2 text-sm text-center text-gray-900">{item.cantidad}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{item.observaciones || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Equipo de Campo */}
            {data.equipamiento.equipoCampo.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center space-x-2">
                  <Tent className="h-4 w-4 text-green-600" />
                  <span>Equipo de Campo</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Equipo</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Observaciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.equipamiento.equipoCampo.map((item, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2 text-sm text-gray-900">{item.equipo_nombre}</td>
                          <td className="px-3 py-2 text-sm text-center text-gray-900">{item.cantidad}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{item.observaciones || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Limpieza Personal */}
            {data.equipamiento.limpiezaPersonal.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center space-x-2">
                  <Droplets className="h-4 w-4 text-blue-600" />
                  <span>Limpieza Personal</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Observaciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.equipamiento.limpiezaPersonal.map((item, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2 text-sm text-gray-900">{item.producto_nombre}</td>
                          <td className="px-3 py-2 text-sm text-center text-gray-900">{item.cantidad}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{item.observaciones || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Limpieza General */}
            {data.equipamiento.limpiezaGeneral.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  <span>Limpieza General</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Observaciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.equipamiento.limpiezaGeneral.map((item, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2 text-sm text-gray-900">{item.producto_nombre}</td>
                          <td className="px-3 py-2 text-sm text-center text-gray-900">{item.cantidad}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{item.observaciones || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Medicamentos */}
            {data.equipamiento.medicamentos.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center space-x-2">
                  <Pill className="h-4 w-4 text-red-600" />
                  <span>Medicamentos</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Medicamento</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Observaciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.equipamiento.medicamentos.map((item, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2 text-sm text-gray-900">{item.medicamento_nombre}</td>
                          <td className="px-3 py-2 text-sm text-center text-gray-900">{item.cantidad}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{item.observaciones || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Alimentos para Animales */}
            {data.equipamiento.alimentosAnimales.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center space-x-2">
                  <PawPrint className="h-4 w-4 text-brown-600" />
                  <span>Alimentos para Animales</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Alimento</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Observaciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.equipamiento.alimentosAnimales.map((item, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2 text-sm text-gray-900">{item.alimento_nombre}</td>
                          <td className="px-3 py-2 text-sm text-center text-gray-900">{item.cantidad}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{item.observaciones || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Mensaje si no hay equipamiento */}
            {Object.values(data.equipamiento).every(arr => arr.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No hay equipamiento registrado para esta brigada</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrigadaDetails; 