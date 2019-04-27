var express = require('express');
var router = express.Router();
var bitacoraCtrl = require('../controllers/bitacoraController');

/***********************Routes Modulo Casas***********************/
/*******************HTTP REQUESTS Modulo Bitacora***********************/
router.route('/BitacoraGeneral/:fechaInicio/:fechaFin').get(bitacoraCtrl.getInformationBitacora);//Obtener Informacion Toda La Bitacora PASS

router.route('/Bitacora/Usuarios/:id/:fechaInicio/:fechaFin').get(bitacoraCtrl.getInformationBitacoraByUser);//Obtener Informacion Bitacora Por Usuario PASS

router.route('/Bitacora/Movimientos/:movimiento/:fechaInicio/:fechaFin').get(bitacoraCtrl.getInformationBitacoraByAction);//Obtener Informacion Bitacora Por Movimiento. PASS

router.route('/Bitacora/Filtros').post(bitacoraCtrl.getInformationBitacoraByAllFilters);//Obtener Informacion Bitacora Todos Los Filtros Anteriores

router.route('/Bitacora').post(bitacoraCtrl.addActionBitacora);//Insertar Movimiento Bitacora PASS


module.exports = router;