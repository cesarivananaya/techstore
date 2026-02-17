'use strict';
const router = require('express').Router();
const ctrl   = require('../controllers/productController');
const { protect, authorize }         = require('../middlewares/auth');
const { validate, schemas }          = require('../validators/schemas');

// Rutas públicas
router.get ('/',                    ctrl.getAll);
router.get ('/categories/stats',    ctrl.categoryStats);
router.get ('/slug/:slug',          ctrl.getBySlug);
router.get ('/:id',                 ctrl.getOne);

// Rutas protegidas – solo admin
router.post  ('/',    protect, authorize('admin'), validate(schemas.productoSchema), ctrl.create);
router.put   ('/:id', protect, authorize('admin'), ctrl.update);
router.delete('/:id', protect, authorize('admin'), ctrl.remove);

module.exports = router;
