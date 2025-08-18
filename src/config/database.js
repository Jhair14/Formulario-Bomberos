const { Pool } = require('pg');
require('dotenv').config();

let pool;

const getConnection = async () => {
  try {
    if (!pool) {
      pool = new Pool({
        connectionString: "postgresql://postgres:sEjWavrHOFeJsNQmypeFVdcGFHpWeSpg@maglev.proxy.rlwy.net:56180/railway",
        ssl: { rejectUnauthorized: false}
      });
      console.log('✅ Conexión a la base de datos PostgreSQL establecida');
      
      // Test inicial de conexión
      const client = await pool.connect();
      const result = await client.query('SELECT NOW()');
      console.log('⏰ Conexión verificada:', result.rows[0].now);
      client.release();
    }
    
    // Verificar si la conexión está activa
    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
    } catch (error) {
      console.log('🔄 Conexión perdida, reconectando...');
      pool = null;
      pool = new Pool(dbConfig);
      console.log('✅ Reconexión exitosa');
    }
    
    return pool;
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    pool = null;
    throw error;
  }
};

const closeConnection = async () => {
  try {
    if (pool) {
      await pool.end();
      pool = null;
      console.log('🔐 Conexión a la base de datos cerrada');
    }
  } catch (error) {
    console.error('❌ Error al cerrar la conexión:', error);
  }
};

module.exports = {
  getConnection,
  closeConnection
};