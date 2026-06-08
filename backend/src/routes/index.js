const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const taskRoutes = require('./task.routes');
const auditRoutes = require('./audit.routes');
const systemRoutes = require('./system.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/tasks', taskRoutes);
router.use('/audit', auditRoutes);

// Mounting system routes (health & metrics) directly under version 1
router.use('/', systemRoutes);

module.exports = router;
