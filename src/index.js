const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');
const brigadaRoutes = require('./routes/brigadaRoutes');
const catalogoRoutes = require('./routes/catalogoRoutes');
const equipamientoRoutes = require('./routes/equipamientoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(helmet());


app.use(cors({
  origin: ['formulario-bomberos-nqbe.vercel.app','formulario-bomberos-nqbe-jhair-andersons-projects.vercel.app','formulario-bomberos-nqbe-git-main-jhair-andersons-projects.vercel.app','formulario-bomberos-nqbe-9h8hbmf9i-jhair-andersons-projects.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});


app.use('/api/brigadas', brigadaRoutes);
app.use('/api/catalogos', catalogoRoutes);
app.use('/api/equipamiento', equipamientoRoutes);

//IGNORAR
//para verificar si el servidor esta funcionando pero ya me asegure de que si asi que chill

// app.get('/health', (req, res) => {
//   res.json({
//     success: true,
//     message: 'API de Bomberos funcionando correctamente',
//     timestamp: new Date().toISOString(),
//     version: '1.0.0'
//   });
// });


app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API de Formularios de Bomberos 2025',
    version: '1.0.0',
    endpoints: {
      brigadas: '/api/brigadas',
      catalogos: '/api/catalogos',
      equipamiento: '/api/equipamiento',
      health: '/health'
    }
  });
});

//IGNORAR
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Api corriendo en ${PORT}`);
})


module.exports = app; 
