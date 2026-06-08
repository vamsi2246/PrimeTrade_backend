const express = require('express');
const {
  getProfile,
  updateProfile,
  getAllUsers,
  changeRole,
  deleteUser,
} = require('../controllers/UserController');
const {
  updateProfileValidator,
  changeRoleValidator,
  userIdParamValidator,
} = require('../validators/user.validator');
const protect = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const { ROLES } = require('../constants');

const router = express.Router();

// User profile endpoints (Authenticated)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfileValidator, updateProfile);

// Admin-only user management endpoints
router.get('/', protect, authorize(ROLES.ADMIN), getAllUsers);
router.patch('/:id/role', protect, authorize(ROLES.ADMIN), changeRoleValidator, changeRole);
router.delete('/:id', protect, authorize(ROLES.ADMIN), userIdParamValidator, deleteUser);

module.exports = router;
