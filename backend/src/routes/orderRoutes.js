'use strict';
const router = require('express').Router();
const ctrl   = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/auth');
const { validate, schemas }  = require('../validators/schemas');

router.use(protect); // Todas las rutas requieren auth

router.post('/',          validate(schemas.pedidoSchema), ctrl.create);
router.get ('/me',        ctrl.getMine);
router.get ('/',          authorize('admin'), ctrl.getAll);
router.get ('/:id',       ctrl.getOne);
router.patch('/:id/status', authorize('admin'), ctrl.updateStatus);
router.patch('/:id/pay',  ctrl.markAsPaid);

module.exports = router;
