# 🚒 Frontend - Sistema de Bomberos

Un frontend moderno y minimalista para el sistema de gestión de brigadas de bomberos, construido con React, TypeScript y Tailwind CSS.

## ✨ Características

- **Diseño Minimalista**: Interfaz limpia y moderna con Tailwind CSS
- **Responsive**: Optimizado para dispositivos móviles y desktop
- **TypeScript**: Tipado estático para mayor seguridad
- **React Router**: Navegación SPA con rutas dinámicas
- **Iconos Lucide**: Iconografía moderna y consistente
- **Componentes Reutilizables**: Arquitectura modular y escalable

## 🚀 Tecnologías

- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS utilitario
- **React Router DOM** - Enrutamiento
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos

## 📦 Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone <url-del-repositorio>
   cd bomberos-front
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   ```bash
   # Crear archivo .env
   REACT_APP_API_URL=http://localhost:3000/api
   ```

4. **Ejecutar en desarrollo**:
   ```bash
   npm start
   ```

5. **Construir para producción**:
   ```bash
   npm run build
   ```

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── Layout.tsx      # Layout principal con navegación
│   ├── Dashboard.tsx   # Página de inicio
│   ├── BrigadasList.tsx # Lista de brigadas
│   └── BrigadaForm.tsx # Formulario de brigadas
├── services/           # Servicios de API
│   └── api.ts         # Cliente HTTP y endpoints
├── types/             # Tipos TypeScript
│   └── api.ts         # Interfaces de la API
├── App.tsx            # Componente principal
├── index.tsx          # Punto de entrada
└── index.css          # Estilos globales
```

## 🎨 Componentes Principales

### Layout
- Sidebar responsive con navegación
- Header con menú móvil
- Diseño adaptable para diferentes pantallas

### Dashboard
- Estadísticas en tiempo real
- Brigadas recientes
- Acciones rápidas
- Indicadores visuales

### BrigadasList
- Lista de brigadas con búsqueda
- Acciones CRUD (Crear, Leer, Actualizar, Eliminar)
- Filtros y ordenamiento
- Modal de confirmación

### BrigadaForm
- Formulario de creación/edición
- Validación de campos
- Feedback visual
- Navegación intuitiva

## 🔧 Configuración

### Variables de Entorno

```env
# URL de la API backend
REACT_APP_API_URL=http://localhost:3000/api
```

### Tailwind CSS

El proyecto incluye una configuración personalizada de Tailwind con:
- Colores personalizados (primary, secondary)
- Fuente Inter
- Animaciones personalizadas
- Componentes utilitarios

### API Integration

El frontend se conecta con el backend a través de:
- Cliente Axios configurado
- Interceptores para manejo de errores
- Tipos TypeScript para todas las respuestas
- Servicios organizados por módulo

## 📱 Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Sidebar**: Colapsable en móviles
- **Cards**: Adaptables a diferentes tamaños de pantalla

## 🎯 Funcionalidades Implementadas

### ✅ Completadas
- [x] Dashboard con estadísticas
- [x] Lista de brigadas con búsqueda
- [x] Crear nueva brigada
- [x] Editar brigada existente
- [x] Eliminar brigada (soft delete)
- [x] Navegación responsive
- [x] Manejo de errores
- [x] Estados de carga
- [x] Validación de formularios

### 🚧 En Desarrollo
- [ ] Gestión de equipamiento
- [ ] Catálogos
- [ ] Detalles de brigada
- [ ] Filtros avanzados
- [ ] Exportación de datos

## 🐛 Solución de Problemas

### Error de CORS
Si encuentras errores de CORS, asegúrate de que el backend esté configurado correctamente:

```javascript
// En el backend
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Error de Conexión API
Verifica que:
1. El backend esté ejecutándose
2. La URL en `REACT_APP_API_URL` sea correcta
3. El puerto no esté ocupado

## 📄 Scripts Disponibles

```bash
# Desarrollo
npm start

# Construcción
npm run build

# Tests
npm test

# Eject (irreversible)
npm run eject
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Tu Nombre** - *Desarrollo inicial* - [TuUsuario](https://github.com/TuUsuario)

## 🙏 Agradecimientos

- [Tailwind CSS](https://tailwindcss.com/) por el framework de CSS
- [Lucide](https://lucide.dev/) por los iconos
- [React](https://reactjs.org/) por la biblioteca de UI
