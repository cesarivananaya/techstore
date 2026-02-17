'use strict';
const router = require('express').Router();
const ctrl   = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/auth');

router.use(protect);

router.get ('/profile',        ctrl.getProfile);
router.put ('/profile',        ctrl.updateProfile);
router.put ('/password',       ctrl.updatePassword);
router.get ('/',               authorize('admin'), ctrl.getAllUsers);
router.patch('/:id/toggle',    authorize('admin'), ctrl.toggleActive);

module.exports = router;
