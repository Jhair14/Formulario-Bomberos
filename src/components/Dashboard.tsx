import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Package, 
  Settings, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Layers
} from 'lucide-react';
import { brigadasApi } from '../services/api';
import { Brigada } from '../types/api';

const Dashboard: React.FC = () => {
  const [brigadas, setBrigadas] = useState<Brigada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrigadas = async () => {
      try {
        setLoading(true);
        const response = await brigadasApi.getAll();
        if (response.success && response.data) {
          setBrigadas(response.data);
        }
      } catch (err) {
        setError('Error al cargar las brigadas');
        console.error('Error fetching brigadas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrigadas();
  }, []);

  const stats = [
    {
      name: 'Total Brigadas',
      value: brigadas.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      href: '/brigadas'
    },
    {
      name: 'Brigadas Activas',
      value: brigadas.filter(b => b.activo).length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      href: '/brigadas'
    },
    {
      name: 'Total Bomberos',
      value: brigadas.reduce((sum, b) => sum + (b.cantidad_bomberos_activos || 0), 0),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      href: '/brigadas'
    }
  ];

  const recentBrigadas = brigadas.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Resumen del sistema de bomberos</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/brigadas/completa"
            className="btn-primary flex items-center space-x-2 bg-green-600 hover:bg-green-700"
          >
            <Layers className="h-4 w-4" />
            <span>Agregar Brigada</span>
          </Link>

        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              to={stat.href}
              className="card hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Brigadas Recientes */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Brigadas Recientes</h2>
          <Link to="/brigadas" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Ver todas
          </Link>
        </div>
        
        {recentBrigadas.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay brigadas registradas</p>
            <div className="flex items-center justify-center mt-4">
              <Link to="/brigadas/completa" className="btn-primary bg-green-600 hover:bg-green-700">
                Agregar Brigada
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {recentBrigadas.map((brigada) => (
              <div
                key={brigada.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${brigada.activo ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <div>
                    <p className="font-medium text-gray-900">{brigada.nombre_brigada}</p>
                    <p className="text-sm text-gray-600">
                      {brigada.cantidad_bomberos_activos} bomberos activos
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>
                    {new Date(brigada.fecha_registro).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Acciones Rápidas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
        <Link
          to="/brigadas"
          className="card hover:shadow-lg transition-shadow duration-200 group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-200">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Gestionar Brigadas</h3>
              <p className="text-sm text-gray-600">Ver y administrar brigadas</p>
            </div>
          </div>
        </Link>

        <Link
          to="/brigadas/completa"
          className="card hover:shadow-lg transition-shadow duration-200 group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors duration-200">
              <Layers className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Brigada Completa</h3>
              <p className="text-sm text-gray-600">Crear con equipamiento</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard; 