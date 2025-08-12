

## Endpoints Disponibles

### Brigadas
- `GET /api/brigadas` - Obtener todas las brigadas
- `GET /api/brigadas/:id` - Obtener brigada por ID
- `POST /api/brigadas` - Crear nueva brigada
- `PUT /api/brigadas/:id` - Actualizar brigada
- `DELETE /api/brigadas/:id` - Eliminar brigada (soft delete)

### Catálogos
- `GET /api/catalogos/tipos-ropa` - Obtener tipos de ropa
- `POST /api/catalogos/tipos-ropa` - Crear tipo de ropa
- `PUT /api/catalogos/tipos-ropa/:id` - Actualizar tipo de ropa
- `DELETE /api/catalogos/tipos-ropa/:id` - Eliminar tipo de ropa


### Equipamiento
- `GET /api/equipamiento/:brigadaId/ropa` - Obtener equipamiento de ropa
- `POST /api/equipamiento/:brigadaId/ropa` - Crear equipamiento de ropa
- `GET /api/equipamiento/:brigadaId/botas` - Obtener equipamiento de botas
- `POST /api/equipamiento/:brigadaId/botas` - Crear equipamiento de botas
- `GET /api/equipamiento/:brigadaId/guantes` - Obtener equipamiento de guantes
- `POST /api/equipamiento/:brigadaId/guantes` - Crear equipamiento de guantes

