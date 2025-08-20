import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  Users, 
  Phone, 
  User,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { brigadasApi } from '../services/api';
import { CreateBrigadaRequest } from '../types/api';
import NumberInput from './NumberInput';

const BrigadaForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<CreateBrigadaRequest>({
    NombreBrigada: '',
    CantidadBomberosActivos: 0,
    ContactoCelularComandante: '',
    EncargadoLogistica: '',
    ContactoCelularLogistica: '',
    NumeroEmergenciaPublico: ''
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchBrigada = async (brigadaId: string) => {
    try {
      setLoading(true);
      const response = await brigadasApi.getById(parseInt(brigadaId));
      if (response.success && response.data) {
        const brigada = response.data;
        setFormData({
          NombreBrigada: brigada.nombre_brigada,
          CantidadBomberosActivos: brigada.cantidad_bomberos_activos,
          ContactoCelularComandante: brigada.contacto_celular_comandante,
          EncargadoLogistica: brigada.encargado_logistica,
          ContactoCelularLogistica: brigada.contacto_celular_logistica,
          NumeroEmergenciaPublico: brigada.numero_emergencia_publico
        });
      }
    } catch (err) {
      setError('Error al cargar la brigada');
      console.error('Error fetching brigada:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEditing && id) {
      fetchBrigada(id);
    }
  }, [id, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.NombreBrigada.trim()) {
      setError('El nombre de la brigada es requerido');
      return;
    }

    if (formData.CantidadBomberosActivos <= 0) {
      setError('La cantidad de bomberos debe ser mayor a 0');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (isEditing && id) {
        await brigadasApi.update(parseInt(id), formData);
        setSuccess('Brigada actualizada exitosamente');
      } else {
        await brigadasApi.create(formData);
        setSuccess('Brigada creada exitosamente');
      }

      // Redirigir después de un breve delay
      setTimeout(() => {
        navigate('/brigadas');
      }, 1500);

    } catch (err) {
      setError('Error al guardar la brigada');
      console.error('Error saving brigada:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
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
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Editar Brigada' : 'Nueva Brigada'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Modifica la información de la brigada' : 'Crea una nueva brigada de bomberos'}
            </p>
          </div>
        </div>
      </div>

      {/* Alertas */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="text-green-700">{success}</span>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary-600" />
            <span>Información General</span>
          </h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="NombreBrigada" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Brigada *
              </label>
              <input
                type="text"
                id="NombreBrigada"
                name="NombreBrigada"
                value={formData.NombreBrigada}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Ej: Brigada Central"
                required
              />
            </div>

            <div>
              <label htmlFor="CantidadBomberosActivos" className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad de Bomberos Activos *
              </label>
              <NumberInput
                value={formData.CantidadBomberosActivos}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  CantidadBomberosActivos: value
                }))}
                min={1}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Phone className="h-5 w-5 text-primary-600" />
            <span>Información de Contacto</span>
          </h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="ContactoCelularComandante" className="block text-sm font-medium text-gray-700 mb-1">
                Celular del Comandante
              </label>
              <input
                type="tel"
                id="ContactoCelularComandante"
                name="ContactoCelularComandante"
                value={formData.ContactoCelularComandante}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Ej: 1234567890"
              />
            </div>

            <div>
              <label htmlFor="NumeroEmergenciaPublico" className="block text-sm font-medium text-gray-700 mb-1">
                Número de Emergencia Público
              </label>
              <input
                type="tel"
                id="NumeroEmergenciaPublico"
                name="NumeroEmergenciaPublico"
                value={formData.NumeroEmergenciaPublico}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Ej: 911"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <User className="h-5 w-5 text-primary-600" />
            <span>Información de Logística</span>
          </h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="EncargadoLogistica" className="block text-sm font-medium text-gray-700 mb-1">
                Encargado de Logística
              </label>
              <input
                type="text"
                id="EncargadoLogistica"
                name="EncargadoLogistica"
                value={formData.EncargadoLogistica}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <div>
              <label htmlFor="ContactoCelularLogistica" className="block text-sm font-medium text-gray-700 mb-1">
                Celular de Logística
              </label>
              <input
                type="tel"
                id="ContactoCelularLogistica"
                name="ContactoCelularLogistica"
                value={formData.ContactoCelularLogistica}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Ej: 0987654321"
              />
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/brigadas')}
            className="btn-secondary"
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary flex items-center space-x-2"
            disabled={saving}
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{saving ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default BrigadaForm; 