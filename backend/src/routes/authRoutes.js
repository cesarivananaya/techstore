'use strict';
const router = require('express').Router();
const ctrl   = require('../controllers/authController');
const { protect }                    = require('../middlewares/auth');
const { authLimiter }                = require('../middlewares/rateLimit');
const { validate, schemas }          = require('../validators/schemas');

router.post('/register',
  authLimiter,
  validate(schemas.registerSchema),
  ctrl.register
);

router.post('/login',
  authLimiter,
  validate(schemas.loginSchema),
  ctrl.login
);

router.post('/logout',   protect, ctrl.logout);
router.get ('/me',       protect, ctrl.getMe);
router.post('/refresh',  ctrl.refreshToken);

router.post('/forgot-password',
  authLimiter,
  validate(schemas.forgotPasswordSchema),
  ctrl.forgotPassword
);

router.put('/reset-password/:token',
  validate(schemas.resetPasswordSchema),
  ctrl.resetPassword
);

module.exports = router;
