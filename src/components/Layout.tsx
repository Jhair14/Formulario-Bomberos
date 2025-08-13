import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Package, 
  Settings, 
  Menu, 
  X,
  Flame,
  Shield,
  Bell
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home, description: 'Panel principal' },
    { name: 'Brigadas', href: '/brigadas', icon: Users, description: 'Gestión de equipos' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar para móvil */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-72 flex-col bg-white shadow-xl">
          <div className="flex h-20 items-center justify-between px-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl shadow-lg">
                <Flame className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">Bomberos</span>
                <p className="text-sm text-gray-500">Sistema de gestión</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Contenido del sidebar móvil */}
          <div className="flex-1 flex flex-col px-6 py-6">
            <nav className="space-y-3">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      active
                        ? 'bg-gradient-to-r from-red-50 to-orange-50 text-red-700 shadow-sm border border-red-100'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg mr-3 transition-colors ${
                      active ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Contenedor principal en desktop: sidebar + contenido */}
      <div className="lg:flex lg:items-start lg:gap-8 lg:p-6">
        {/* Sidebar desktop mejorado */}
        <aside className="hidden lg:block lg:sticky lg:top-6">
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden w-80">
            {/* Header del sidebar */}
            <div className="bg-gradient-to-r from-red-500 to-orange-600 px-6 py-8">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Flame className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Bomberos</h2>
                  <p className="text-red-100 text-sm">Sistema de gestión</p>
                </div>
              </div>
            </div>
            
            {/* Navegación principal */}
            <div className="p-6">
              <nav className="space-y-3">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-4 py-4 text-sm font-medium rounded-xl transition-all duration-200 ${
                        active
                          ? 'bg-gradient-to-r from-red-50 to-orange-50 text-red-700 shadow-md border border-red-100 transform scale-[1.02]'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:transform hover:scale-[1.01]'
                      }`}
                    >
                      <div className={`flex items-center justify-center w-12 h-12 rounded-xl mr-4 transition-all duration-200 ${
                        active 
                          ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg' 
                          : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:scale-110'
                      }`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-base">{item.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                      </div>
                      {active && (
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </aside>

        {/* Contenido principal */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 lg:rounded-t-2xl lg:mt-0">
            {/* botón para abrir sidebar móvil */}
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex flex-1 items-center">
                <h1 className="text-lg font-semibold text-gray-900 lg:hidden">Bomberos</h1>
              </div>
            </div>
          </div>

          {/* Contenido de la página */}
          <main className="py-6 lg:bg-white lg:rounded-b-2xl lg:shadow-xl lg:min-h-[calc(100vh-8rem)]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;