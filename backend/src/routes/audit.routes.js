const express = require('express');
const { getLogs } = require('../controllers/AuditLogController');
const protect = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const { ROLES } = require('../constants');

const router = express.Router();

router.get('/', protect, authorize(ROLES.ADMIN), getLogs);

module.exports = router;
