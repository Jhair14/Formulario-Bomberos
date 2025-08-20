import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Eye, 
  Trash2, 
  Users, 
  Phone,
  AlertTriangle,
  CheckCircle,
  Loader,
  Settings
} from 'lucide-react';
import { brigadasApi } from '../services/api';
import { Brigada } from '../types/api';

const BrigadasList: React.FC = () => {
  const [brigadas, setBrigadas] = useState<Brigada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [brigadaToDelete, setBrigadaToDelete] = useState<Brigada | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchBrigadas();
  }, []);

  const fetchBrigadas = async () => {
    try {
      setLoading(true);
      const response = await brigadasApi.getAll();
      if (response.success && response.data) {
        setBrigadas(response.data);
      } else {
        setError('Error al cargar las brigadas');
      }
    } catch (err) {
      setError('Error al cargar las brigadas');
      console.error('Error fetching brigadas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (brigada: Brigada) => {
    setBrigadaToDelete(brigada);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!brigadaToDelete) return;

    try {
      setDeleting(true);
      await brigadasApi.delete(brigadaToDelete.id);
      setBrigadas(brigadas.filter(b => b.id !== brigadaToDelete.id));
      setShowDeleteModal(false);
      setBrigadaToDelete(null);
    } catch (err) {
      setError('Error al eliminar la brigada');
      console.error('Error deleting brigada:', err);
    } finally {
      setDeleting(false);
    }
  };

  const filteredBrigadas = brigadas.filter(brigada =>
    brigada.nombre_brigada.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brigada.encargado_logistica?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brigada.contacto_celular_comandante?.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brigadas</h1>
          <p className="text-gray-600">Gestiona todas las brigadas registradas</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/brigadas/completa"
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Agregar Brigada</span>
          </Link>

        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar brigadas por nombre, encargado o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Brigadas List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrigadas.map((brigada) => (
          <div key={brigada.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-200 overflow-hidden">
            {/* Header de la card */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {brigada.nombre_brigada}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      brigada.activo 
                        
                    }`}>
                      
                      
                    </span>
                  </div>
                </div>
                {/* Botón de eliminar en la esquina */}
                <button
                  onClick={() => handleDelete(brigada)}
                  title="Eliminar brigada"
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                >
                  <Trash2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

            {/* Información de la brigada */}
            <div className="px-6 pb-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-600">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">
                    {brigada.cantidad_bomberos_activos} bomberos activos
                  </span>
                </div>
                
                {brigada.contacto_celular_comandante && (
                  <div className="flex items-center space-x-3 text-gray-600">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg">
                      <Phone className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm">{brigada.contacto_celular_comandante}</span>
                  </div>
                )}

                {brigada.encargado_logistica && (
                  <div className="flex items-start space-x-3 text-gray-600">
                    <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg mt-0.5">
                      <Settings className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                        Encargado de Logística
                      </span>
                      <p className="text-sm font-medium text-gray-900">
                        {brigada.encargado_logistica}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer con botones de acción */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between space-x-2">
                {/* Grupo de botones principales */}
                <div className="flex items-center space-x-2 flex-1">
                  <Link
                    to={`/brigadas/${brigada.id}`}
                    className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 shadow-sm"
                  >
                    <Eye className="h-3 w-3 mr-1.5" />
                    Ver
                  </Link>
                  

                </div>
                
                {/* Botón destacado a la derecha */}
                <Link
                  to={`/brigadas/editar-completa/${brigada.id}`}
                  className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-orange-600 rounded-lg hover:from-red-600 hover:to-orange-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                >
                  <Settings className="h-3 w-3 mr-1.5" />
                  Editar brigada
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje cuando no hay brigadas */}
      {filteredBrigadas.length === 0 && (
        <div className="col-span-full">
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No se encontraron brigadas
            </h3>
            <p className="text-gray-600 mb-6">
              No hay brigadas que coincidan con los filtros aplicados.
            </p>
            <Link
              to="/brigadas/completa"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-orange-600 rounded-lg hover:from-red-600 hover:to-orange-700 transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear primera brigada
            </Link>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredBrigadas.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No se encontraron brigadas' : 'No hay brigadas registradas'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Intenta con otros términos de búsqueda' 
              : 'Comienza creando tu primera brigada'
            }
          </p>
                      {!searchTerm && (
              <Link to="/brigadas/completa" className="btn-primary">
                Crear Primera Brigada
              </Link>
            )}
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && brigadaToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">Confirmar Eliminación</h3>
            </div>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que quieres eliminar la brigada "{brigadaToDelete.nombre_brigada}"? 
              Esta acción no se puede deshacer.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setBrigadaToDelete(null);
                }}
                className="btn-secondary"
                disabled={deleting}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="btn-primary bg-red-600 hover:bg-red-700"
                disabled={deleting}
              >
                {deleting ? (
                  <div className="flex items-center space-x-2">
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Eliminando...</span>
                  </div>
                ) : (
                  'Eliminar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrigadasList; 