const { getConnection } = require('../config/database');

// Función genérica para obtener catálogos
const getCatalogo = async (tableName, req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.query(`SELECT * FROM ${tableName} WHERE activo = true ORDER BY nombre`);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error(`Error al obtener catálogo ${tableName}:`, error);
    res.status(500).json({
      success: false,
      message: `Error al obtener el catálogo ${tableName}`
    });
  }
};

// Función genérica para crear elementos en catálogos
const createCatalogoItem = async (tableName, req, res) => {
  try {
    const { Nombre, Descripcion } = req.body;
    const pool = await getConnection();
    const result = await pool.query(`
      INSERT INTO ${tableName} (nombre, descripcion)
      VALUES ($1, $2)
      RETURNING id, nombre
    `, [Nombre, Descripcion]);
    
    res.status(201).json({
      success: true,
      message: 'Elemento creado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error(`Error al crear elemento en ${tableName}:`, error);
    res.status(500).json({
      success: false,
      message: `Error al crear el elemento en ${tableName}`
    });
  }
};

// Función genérica para actualizar elementos en catálogos
const updateCatalogoItem = async (tableName, req, res) => {
  try {
    const { id } = req.params;
    const { Nombre, Descripcion } = req.body;
    const pool = await getConnection();
    const result = await pool.query(`
      UPDATE ${tableName}
      SET nombre = $1, descripcion = $2
      WHERE id = $3 AND activo = true
    `, [Nombre, Descripcion, id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Elemento no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Elemento actualizado exitosamente'
    });
  } catch (error) {
    console.error(`Error al actualizar elemento en ${tableName}:`, error);
    res.status(500).json({
      success: false,
      message: `Error al actualizar el elemento en ${tableName}`
    });
  }
};

// Función genérica para eliminar elementos en catálogos
const deleteCatalogoItem = async (tableName, req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    const result = await pool.query(`UPDATE ${tableName} SET activo = false WHERE id = $1 AND activo = true`, [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Elemento no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Elemento eliminado exitosamente'
    });
  } catch (error) {
    console.error(`Error al eliminar elemento en ${tableName}:`, error);
    res.status(500).json({
      success: false,
      message: `Error al eliminar el elemento en ${tableName}`
    });
  }
};

// Controladores específicos para cada catálogo
const tiposRopa = {
  getAll: (req, res) => getCatalogo('cat_tipos_ropa', req, res),
  create: (req, res) => createCatalogoItem('cat_tipos_ropa', req, res),
  update: (req, res) => updateCatalogoItem('cat_tipos_ropa', req, res),
  delete: (req, res) => deleteCatalogoItem('cat_tipos_ropa', req, res)
};

const equipamientoEPP = {
  getAll: (req, res) => getCatalogo('cat_equipamiento_epp', req, res),
  create: (req, res) => createCatalogoItem('cat_equipamiento_epp', req, res),
  update: (req, res) => updateCatalogoItem('cat_equipamiento_epp', req, res),
  delete: (req, res) => deleteCatalogoItem('cat_equipamiento_epp', req, res)
};

const herramientas = {
  getAll: (req, res) => getCatalogo('cat_herramientas', req, res),
  create: (req, res) => createCatalogoItem('cat_herramientas', req, res),
  update: (req, res) => updateCatalogoItem('cat_herramientas', req, res),
  delete: (req, res) => deleteCatalogoItem('cat_herramientas', req, res)
};

const serviciosVehiculos = {
  getAll: (req, res) => getCatalogo('cat_servicios_vehiculos', req, res),
  create: (req, res) => createCatalogoItem('cat_servicios_vehiculos', req, res),
  update: (req, res) => updateCatalogoItem('cat_servicios_vehiculos', req, res),
  delete: (req, res) => deleteCatalogoItem('cat_servicios_vehiculos', req, res)
};

const alimentosBebidas = {
  getAll: (req, res) => getCatalogo('cat_alimentos_bebidas', req, res),
  create: (req, res) => createCatalogoItem('cat_alimentos_bebidas', req, res),
  update: (req, res) => updateCatalogoItem('cat_alimentos_bebidas', req, res),
  delete: (req, res) => deleteCatalogoItem('cat_alimentos_bebidas', req, res)
};

const equipoCampo = {
  getAll: (req, res) => getCatalogo('cat_equipo_campo', req, res),
  create: (req, res) => createCatalogoItem('cat_equipo_campo', req, res),
  update: (req, res) => updateCatalogoItem('cat_equipo_campo', req, res),
  delete: (req, res) => deleteCatalogoItem('cat_equipo_campo', req, res)
};

const limpiezaPersonal = {
  getAll: (req, res) => getCatalogo('cat_limpieza_personal', req, res),
  create: (req, res) => createCatalogoItem('cat_limpieza_personal', req, res),
  update: (req, res) => updateCatalogoItem('cat_limpieza_personal', req, res),
  delete: (req, res) => deleteCatalogoItem('cat_limpieza_personal', req, res)
};

const limpiezaGeneral = {
  getAll: (req, res) => getCatalogo('cat_limpieza_general', req, res),
  create: (req, res) => createCatalogoItem('cat_limpieza_general', req, res),
  update: (req, res) => updateCatalogoItem('cat_limpieza_general', req, res),
  delete: (req, res) => deleteCatalogoItem('cat_limpieza_general', req, res)
};

const medicamentos = {
  getAll: (req, res) => getCatalogo('cat_medicamentos', req, res),
  create: (req, res) => createCatalogoItem('cat_medicamentos', req, res),
  update: (req, res) => updateCatalogoItem('cat_medicamentos', req, res),
  delete: (req, res) => deleteCatalogoItem('cat_medicamentos', req, res)
};

const alimentosAnimales = {
  getAll: (req, res) => getCatalogo('cat_alimentos_animales', req, res),
  create: (req, res) => createCatalogoItem('cat_alimentos_animales', req, res),
  update: (req, res) => updateCatalogoItem('cat_alimentos_animales', req, res),
  delete: (req, res) => deleteCatalogoItem('cat_alimentos_animales', req, res)
};

module.exports = {
  tiposRopa,
  equipamientoEPP,
  herramientas,
  serviciosVehiculos,
  alimentosBebidas,
  equipoCampo,
  limpiezaPersonal,
  limpiezaGeneral,
  medicamentos,
  alimentosAnimales
}; 