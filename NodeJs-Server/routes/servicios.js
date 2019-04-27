var express = require('express');
var router = express.Router();
var servicioCtrl = require('../controllers/serviciosController');

/***********************Routes Modulo Casas***********************/
/*******************HTTP REQUESTS Modulo Bitacora***********************/
router.route('/ServiciosClientes/:id/:fechaInicio/:fechaFin').get(servicioCtrl.getServicesByCustomer);//Obtener Servicios Por Cliente PASS

router.route('/ServiciosBanco').post(servicioCtrl.getServicesByBank);//Obtener Servicios Pagados Por Banco PASS **********

router.route('/ServiciosCasas/:id/:fechaInicio/:fechaFin').get(servicioCtrl.getServicesByHouse);//Obtener Servicios Por Casa PASS

router.route('/ServiciosTipo/:tipo/:fechaInicio/:fechaFin').get(servicioCtrl.getServicesByService);//Obtener Servicios Por Tipo Servicio PASS

router.route('/ServiciosTodos/:fechaInicio/:fechaFin').get(servicioCtrl.getServicesGeneral);//Obtener Todos Los Servicios PASS

router.route('/Servicios').post(servicioCtrl.addService);//Agregar Servicio PASS

router.route('/Servicios').put(servicioCtrl.updateService);//Modificar Servicio PASS

router.route('/ServiciosPagos/:id').put(servicioCtrl.payService);//Modificar Servicio PASS

router.route('/Servicios/:id').delete(servicioCtrl.deleteService);//Eliminar Servicio PASS

module.exports = router;