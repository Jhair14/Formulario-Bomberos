const express = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validation');
const {
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
} = require('../controllers/catalogoController');

const router = express.Router();

// Validaciones para catálogos
const catalogoValidation = [
  body('Nombre')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ max: 150 })
    .withMessage('El nombre no puede exceder 150 caracteres'),
  body('Descripcion')
    .optional()
    .isLength({ max: 255 })
    .withMessage('La descripción no puede exceder 255 caracteres')
];

// Rutas para tipos de ropa
router.get('/tipos-ropa', tiposRopa.getAll);
router.post('/tipos-ropa', catalogoValidation, validateRequest, tiposRopa.create);
router.put('/tipos-ropa/:id', catalogoValidation, validateRequest, tiposRopa.update);
router.delete('/tipos-ropa/:id', tiposRopa.delete);

// Rutas para equipamiento EPP
router.get('/equipamiento-epp', equipamientoEPP.getAll);
router.post('/equipamiento-epp', catalogoValidation, validateRequest, equipamientoEPP.create);
router.put('/equipamiento-epp/:id', catalogoValidation, validateRequest, equipamientoEPP.update);
router.delete('/equipamiento-epp/:id', equipamientoEPP.delete);

// Rutas para herramientas
router.get('/herramientas', herramientas.getAll);
router.post('/herramientas', catalogoValidation, validateRequest, herramientas.create);
router.put('/herramientas/:id', catalogoValidation, validateRequest, herramientas.update);
router.delete('/herramientas/:id', herramientas.delete);

// Rutas para servicios de vehículos
router.get('/servicios-vehiculos', serviciosVehiculos.getAll);
router.post('/servicios-vehiculos', catalogoValidation, validateRequest, serviciosVehiculos.create);
router.put('/servicios-vehiculos/:id', catalogoValidation, validateRequest, serviciosVehiculos.update);
router.delete('/servicios-vehiculos/:id', serviciosVehiculos.delete);

// Rutas para alimentos y bebidas
router.get('/alimentos-bebidas', alimentosBebidas.getAll);
router.post('/alimentos-bebidas', catalogoValidation, validateRequest, alimentosBebidas.create);
router.put('/alimentos-bebidas/:id', catalogoValidation, validateRequest, alimentosBebidas.update);
router.delete('/alimentos-bebidas/:id', alimentosBebidas.delete);

// Rutas para equipo de campo
router.get('/equipo-campo', equipoCampo.getAll);
router.post('/equipo-campo', catalogoValidation, validateRequest, equipoCampo.create);
router.put('/equipo-campo/:id', catalogoValidation, validateRequest, equipoCampo.update);
router.delete('/equipo-campo/:id', equipoCampo.delete);

// Rutas para limpieza personal
router.get('/limpieza-personal', limpiezaPersonal.getAll);
router.post('/limpieza-personal', catalogoValidation, validateRequest, limpiezaPersonal.create);
router.put('/limpieza-personal/:id', catalogoValidation, validateRequest, limpiezaPersonal.update);
router.delete('/limpieza-personal/:id', limpiezaPersonal.delete);

// Rutas para limpieza general
router.get('/limpieza-general', limpiezaGeneral.getAll);
router.post('/limpieza-general', catalogoValidation, validateRequest, limpiezaGeneral.create);
router.put('/limpieza-general/:id', catalogoValidation, validateRequest, limpiezaGeneral.update);
router.delete('/limpieza-general/:id', limpiezaGeneral.delete);

// Rutas para medicamentos
router.get('/medicamentos', medicamentos.getAll);
router.post('/medicamentos', catalogoValidation, validateRequest, medicamentos.create);
router.put('/medicamentos/:id', catalogoValidation, validateRequest, medicamentos.update);
router.delete('/medicamentos/:id', medicamentos.delete);

// Rutas para alimentos de animales
router.get('/alimentos-animales', alimentosAnimales.getAll);
router.post('/alimentos-animales', catalogoValidation, validateRequest, alimentosAnimales.create);
router.put('/alimentos-animales/:id', catalogoValidation, validateRequest, alimentosAnimales.update);
router.delete('/alimentos-animales/:id', alimentosAnimales.delete);

module.exports = router; 