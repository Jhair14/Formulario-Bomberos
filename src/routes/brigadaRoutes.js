const express = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validation');
const {
  getAllBrigadas,
  getBrigadaById,
  createBrigada,
  updateBrigada,
  deleteBrigada
} = require('../controllers/brigadaController');

const router = express.Router();

// Validaciones para brigadas
const brigadaValidation = [
  body('NombreBrigada')
    .notEmpty()
    .withMessage('El nombre de la brigada es requerido')
    .isLength({ max: 255 })
    .withMessage('El nombre de la brigada no puede exceder 255 caracteres'),
  body('CantidadBomberosActivos')
    .optional()
    .isInt({ min: 0 })
    .withMessage('La cantidad de bomberos debe ser un número entero positivo'),
  body('ContactoCelularComandante')
    .optional()
    .isLength({ max: 20 })
    .withMessage('El contacto del comandante no puede exceder 20 caracteres'),
  body('EncargadoLogistica')
    .optional()
    .isLength({ max: 255 })
    .withMessage('El encargado de logística no puede exceder 255 caracteres'),
  body('ContactoCelularLogistica')
    .optional()
    .isLength({ max: 20 })
    .withMessage('El contacto de logística no puede exceder 20 caracteres'),
  body('NumeroEmergenciaPublico')
    .optional()
    .isLength({ max: 20 })
    .withMessage('El número de emergencia no puede exceder 20 caracteres')
];

// Rutas para brigadas
router.get('/', getAllBrigadas);
router.get('/:id', getBrigadaById);
router.post('/', brigadaValidation, validateRequest, createBrigada);
router.put('/:id', brigadaValidation, validateRequest, updateBrigada);
router.delete('/:id', deleteBrigada);

module.exports = router; 