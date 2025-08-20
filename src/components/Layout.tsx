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
      {/* Navbar horizontal */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl shadow-lg">
              <Flame className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Bomberos</span>
          </div>
          <div className="flex space-x-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-red-50 to-orange-50 text-red-700 shadow-sm border border-red-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`mr-2 h-5 w-5 ${active ? 'text-red-600' : 'text-gray-500'}`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Espacio para la navbar fija */}
      <div className="h-16" />

      {/* Contenido principal */}
      <main className="py-6 lg:bg-white lg:rounded-2xl lg:shadow-xl lg:min-h-[calc(100vh-8rem)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
