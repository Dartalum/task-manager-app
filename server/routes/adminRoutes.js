const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticate = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');






// Task Types
router.get('/types', authenticate, checkRole(['admin', 'executor']), adminController.getTaskTypes);
router.post('/types', authenticate, checkRole(['admin']), adminController.addTaskType);
router.delete('/types/:id', authenticate, checkRole(['admin']), adminController.deleteTaskType);

// Task Statuses
router.get('/statuses', authenticate, checkRole(['admin', 'executor']), adminController.getTaskStatuses);
router.post('/statuses', authenticate, checkRole(['admin']), adminController.addTaskStatus);
router.delete('/statuses/:id', authenticate, checkRole(['admin']), adminController.deleteTaskStatus);

module.exports = router;
