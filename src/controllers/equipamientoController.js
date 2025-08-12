const { getConnection } = require('../config/database');



const getEquipamientoRopa = async (req, res) => {
  try {
    const { brigadaId } = req.params;
    const pool = await getConnection();
    const result = await pool.query(`
      SELECT er.*, ctr.nombre as tipo_ropa_nombre
      FROM equipamiento_ropa er
      INNER JOIN cat_tipos_ropa ctr ON er.tipo_ropa_id = ctr.id
      WHERE er.brigada_id = $1
    `, [brigadaId]);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener equipamiento de ropa:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el equipamiento de ropa'
    });
  }
};

const createEquipamientoRopa = async (req, res) => {
  try {
    const { brigadaId } = req.params;
    const {
      TipoRopaID,
      CantidadXS,
      CantidadS,
      CantidadM,
      CantidadL,
      CantidadXL,
      Observaciones
    } = req.body;
    
    const pool = await getConnection();
    const result = await pool.query(`
      INSERT INTO equipamiento_ropa (
        brigada_id, tipo_ropa_id, cantidad_xs, cantidad_s, cantidad_m, 
        cantidad_l, cantidad_xl, observaciones
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `, [
      brigadaId,
      TipoRopaID,
      CantidadXS || 0,
      CantidadS || 0,
      CantidadM || 0,
      CantidadL || 0,
      CantidadXL || 0,
      Observaciones
    ]);
    
    res.status(201).json({
      success: true,
      message: 'Equipamiento de ropa creado exitosamente',
      data: { id: result.rows[0].id }
    });
  } catch (error) {
    console.error('Error al crear equipamiento de ropa:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el equipamiento de ropa'
    });
  }
};


const getEquipamientoBotas = async (req, res) => {
  try {
    const { brigadaId } = req.params;
    const pool = await getConnection();
    const result = await pool.query(`
      SELECT * FROM equipamiento_botas
      WHERE brigada_id = $1
    `, [brigadaId]);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener equipamiento de botas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el equipamiento de botas'
    });
  }
};

const createEquipamientoBotas = async (req, res) => {
  try {
    const { brigadaId } = req.params;
    const {
      Talla37,
      Talla38,
      Talla39,
      Talla40,
      Talla41,
      Talla42,
      Talla43,
      OtraTalla,
      CantidadOtraTalla,
      Observaciones
    } = req.body;
    
    const pool = await getConnection();
    const result = await pool.query(`
      INSERT INTO equipamiento_botas (
        brigada_id, talla_37, talla_38, talla_39, talla_40, talla_41, talla_42, talla_43,
        otra_talla, cantidad_otra_talla, observaciones
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id
    `, [
      brigadaId,
      Talla37 || 0,
      Talla38 || 0,
      Talla39 || 0,
      Talla40 || 0,
      Talla41 || 0,
      Talla42 || 0,
      Talla43 || 0,
      OtraTalla,
      CantidadOtraTalla || 0,
      Observaciones
    ]);
    
    res.status(201).json({
      success: true,
      message: 'Equipamiento de botas creado exitosamente',
      data: { id: result.rows[0].id }
    });
  } catch (error) {
    console.error('Error al crear equipamiento de botas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el equipamiento de botas'
    });
  }
};


const getEquipamientoGuantes = async (req, res) => {
  try {
    const { brigadaId } = req.params;
    const pool = await getConnection();
    const result = await pool.query(`
      SELECT * FROM equipamiento_guantes
      WHERE brigada_id = $1
    `, [brigadaId]);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener equipamiento de guantes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el equipamiento de guantes'
    });
  }
};

const createEquipamientoGuantes = async (req, res) => {
  try {
    const { brigadaId } = req.params;
    const {
      TallaXS,
      TallaS,
      TallaM,
      TallaL,
      TallaXL,
      TallaXXL,
      OtraTalla,
      CantidadOtraTalla,
      Observaciones
    } = req.body;
    
    const pool = await getConnection();
    const result = await pool.query(`
      INSERT INTO equipamiento_guantes (
        brigada_id, talla_xs, talla_s, talla_m, talla_l, talla_xl, talla_xxl,
        otra_talla, cantidad_otra_talla, observaciones
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
    `, [
      brigadaId,
      TallaXS || 0,
      TallaS || 0,
      TallaM || 0,
      TallaL || 0,
      TallaXL || 0,
      TallaXXL || 0,
      OtraTalla,
      CantidadOtraTalla || 0,
      Observaciones
    ]);
    
    res.status(201).json({
      success: true,
      message: 'Equipamiento de guantes creado exitosamente',
      data: { id: result.rows[0].id }
    });
  } catch (error) {
    console.error('Error al crear equipamiento de guantes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el equipamiento de guantes'
    });
  }
};

// =============================================
// FUNCIONES GENÉRICAS PARA EQUIPAMIENTO
// =============================================

const getEquipamientoGenerico = async (tableName, brigadaId, res) => {
  try {
    const pool = await getConnection();
    let query = '';
    
    switch (tableName) {
      case 'equipamiento_epp':
        query = `
          SELECT e.*, cep.nombre as equipo_nombre
          FROM equipamiento_epp e
          INNER JOIN cat_equipamiento_epp cep ON e.equipo_epp_id = cep.id
          WHERE e.brigada_id = $1
        `;
        break;
      case 'herramientas':
        query = `
          SELECT h.*, ch.nombre as herramienta_nombre
          FROM herramientas h
          INNER JOIN cat_herramientas ch ON h.herramienta_id = ch.id
          WHERE h.brigada_id = $1
        `;
        break;
      case 'logistica_vehiculos':
        query = `
          SELECT lv.*, csv.nombre as servicio_nombre
          FROM logistica_vehiculos lv
          INNER JOIN cat_servicios_vehiculos csv ON lv.servicio_vehiculo_id = csv.id
          WHERE lv.brigada_id = $1
        `;
        break;
      case 'alimentacion_bebidas':
        query = `
          SELECT ab.*, cab.nombre as alimento_nombre
          FROM alimentacion_bebidas ab
          INNER JOIN cat_alimentos_bebidas cab ON ab.alimento_bebida_id = cab.id
          WHERE ab.brigada_id = $1
        `;
        break;
      case 'equipo_campo':
        query = `
          SELECT ec.*, cec.nombre as equipo_nombre
          FROM equipo_campo ec
          INNER JOIN cat_equipo_campo cec ON ec.equipo_campo_id = cec.id
          WHERE ec.brigada_id = $1
        `;
        break;
      case 'limpieza_personal':
        query = `
          SELECT lp.*, clp.nombre as producto_nombre
          FROM limpieza_personal lp
          INNER JOIN cat_limpieza_personal clp ON lp.producto_limpieza_personal_id = clp.id
          WHERE lp.brigada_id = $1
        `;
        break;
      case 'limpieza_general':
        query = `
          SELECT lg.*, clg.nombre as producto_nombre
          FROM limpieza_general lg
          INNER JOIN cat_limpieza_general clg ON lg.producto_limpieza_general_id = clg.id
          WHERE lg.brigada_id = $1
        `;
        break;
      case 'medicamentos':
        query = `
          SELECT m.*, cm.nombre as medicamento_nombre
          FROM medicamentos m
          INNER JOIN cat_medicamentos cm ON m.medicamento_id = cm.id
          WHERE m.brigada_id = $1
        `;
        break;
      case 'rescate_animal':
        query = `
          SELECT ra.*, caa.nombre as alimento_nombre
          FROM rescate_animal ra
          INNER JOIN cat_alimentos_animales caa ON ra.alimento_animal_id = caa.id
          WHERE ra.brigada_id = $1
        `;
        break;
    }
    
    const result = await pool.query(query, [brigadaId]);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error(`Error al obtener ${tableName}:`, error);
    res.status(500).json({
      success: false,
      message: `Error al obtener ${tableName}`
    });
  }
};

const createEquipamientoGenerico = async (tableName, brigadaId, req, res) => {
  try {
    const pool = await getConnection();
    let query = '';
    let values = [];
    let paramIndex = 1;
    
    switch (tableName) {
      case 'equipamiento_epp':
        query = `
          INSERT INTO equipamiento_epp (brigada_id, equipo_epp_id, cantidad, observaciones)
          VALUES ($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3})
          RETURNING id
        `;
        values = [
          brigadaId,
          req.body.EquipoEPPID,
          req.body.Cantidad || 0,
          req.body.Observaciones
        ];
        break;
      case 'herramientas':
        query = `
          INSERT INTO herramientas (brigada_id, herramienta_id, cantidad, observaciones)
          VALUES ($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3})
          RETURNING id
        `;
        values = [
          brigadaId,
          req.body.HerramientaID,
          req.body.Cantidad || 0,
          req.body.Observaciones
        ];
        break;
      case 'logistica_vehiculos':
        query = `
          INSERT INTO logistica_vehiculos (brigada_id, servicio_vehiculo_id, monto_aproximado, observaciones)
          VALUES ($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3})
          RETURNING id
        `;
        values = [
          brigadaId,
          req.body.ServicioVehiculoID,
          req.body.MontoAproximado || 0,
          req.body.Observaciones
        ];
        break;
      case 'alimentacion_bebidas':
        query = `
          INSERT INTO alimentacion_bebidas (brigada_id, alimento_bebida_id, cantidad, observaciones)
          VALUES ($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3})
          RETURNING id
        `;
        values = [
          brigadaId,
          req.body.AlimentoBebidaID,
          req.body.Cantidad || 0,
          req.body.Observaciones
        ];
        break;
      case 'equipo_campo':
        query = `
          INSERT INTO equipo_campo (brigada_id, equipo_campo_id, cantidad, observaciones)
          VALUES ($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3})
          RETURNING id
        `;
        values = [
          brigadaId,
          req.body.EquipoCampoID,
          req.body.Cantidad || 0,
          req.body.Observaciones
        ];
        break;
      case 'limpieza_personal':
        query = `
          INSERT INTO limpieza_personal (brigada_id, producto_limpieza_personal_id, cantidad, observaciones)
          VALUES ($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3})
          RETURNING id
        `;
        values = [
          brigadaId,
          req.body.ProductoLimpiezaPersonalID,
          req.body.Cantidad || 0,
          req.body.Observaciones
        ];
        break;
      case 'limpieza_general':
        query = `
          INSERT INTO limpieza_general (brigada_id, producto_limpieza_general_id, cantidad, observaciones)
          VALUES ($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3})
          RETURNING id
        `;
        values = [
          brigadaId,
          req.body.ProductoLimpiezaGeneralID,
          req.body.Cantidad || 0,
          req.body.Observaciones
        ];
        break;
      case 'medicamentos':
        query = `
          INSERT INTO medicamentos (brigada_id, medicamento_id, cantidad, observaciones)
          VALUES ($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3})
          RETURNING id
        `;
        values = [
          brigadaId,
          req.body.MedicamentoID,
          req.body.Cantidad || 0,
          req.body.Observaciones
        ];
        break;
      case 'rescate_animal':
        query = `
          INSERT INTO rescate_animal (brigada_id, alimento_animal_id, cantidad, observaciones)
          VALUES ($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3})
          RETURNING id
        `;
        values = [
          brigadaId,
          req.body.AlimentoAnimalID,
          req.body.Cantidad || 0,
          req.body.Observaciones
        ];
        break;
    }
    
    const result = await pool.query(query, values);
    
    res.status(201).json({
      success: true,
      message: `${tableName} creado exitosamente`,
      data: { id: result.rows[0].id }
    });
  } catch (error) {
    console.error(`Error al crear ${tableName}:`, error);
    res.status(500).json({
      success: false,
      message: `Error al crear ${tableName}`
    });
  }
};

const deleteEquipamientoRopa = async (req, res) => {
  try {
    const { brigadaId } = req.params;
    const pool = await getConnection();
    const result = await pool.query(`
      DELETE FROM equipamiento_ropa
      WHERE brigada_id = $1
    `, [brigadaId]);
    
    res.json({
      success: true,
      message: 'Equipamiento de ropa eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar equipamiento de ropa:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el equipamiento de ropa'
    });
  }
};

const deleteEquipamientoBotas = async (req, res) => {
  try {
    const { brigadaId } = req.params;
    const pool = await getConnection();
    const result = await pool.query(`
      DELETE FROM equipamiento_botas
      WHERE brigada_id = $1
    `, [brigadaId]);
    
    res.json({
      success: true,
      message: 'Equipamiento de botas eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar equipamiento de botas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el equipamiento de botas'
    });
  }
};

const deleteEquipamientoGuantes = async (req, res) => {
  try {
    const { brigadaId } = req.params;
    const pool = await getConnection();
    const result = await pool.query(`
      DELETE FROM equipamiento_guantes
      WHERE brigada_id = $1
    `, [brigadaId]);
    
    res.json({
      success: true,
      message: 'Equipamiento de guantes eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar equipamiento de guantes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el equipamiento de guantes'
    });
  }
};

const deleteEquipamientoGenerico = async (tableName, brigadaId, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.query(`
      DELETE FROM ${tableName}
      WHERE brigada_id = $1
    `, [brigadaId]);
    
    res.json({
      success: true,
      message: `Equipamiento de ${tableName} eliminado exitosamente`
    });
  } catch (error) {
    console.error(`Error al eliminar equipamiento de ${tableName}:`, error);
    res.status(500).json({
      success: false,
      message: `Error al eliminar el equipamiento de ${tableName}`
    });
  }
};

// Exportar controladores específicos
module.exports = {
  getEquipamientoRopa,
  createEquipamientoRopa,
  deleteEquipamientoRopa,
  getEquipamientoBotas,
  createEquipamientoBotas,
  deleteEquipamientoBotas,
  getEquipamientoGuantes,
  createEquipamientoGuantes,
  deleteEquipamientoGuantes,
  getEquipamientoGenerico,
  createEquipamientoGenerico,
  deleteEquipamientoGenerico
}; 