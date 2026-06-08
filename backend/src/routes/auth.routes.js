const express = require('express');
const { register, login, googleLogin, refresh, logout } = require('../controllers/AuthController');
const { registerValidator, loginValidator } = require('../validators/auth.validator');
const protect = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.post('/google', googleLogin);
router.post('/refresh', refresh);
router.post('/logout', protect, logout);

module.exports = router;
