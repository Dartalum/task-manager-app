const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const taskController = require('../controllers/taskController');
const checkRole = require('../middleware/checkRole');

router.get('/my', authenticate, taskController.getUserTasks);
router.get('/all', authenticate, taskController.getAllTasks);
router.post('/', authenticate, taskController.createTask);
router.get('/:id', authenticate, taskController.getTaskById);
router.patch('/:id', authenticate, taskController.updateTask);
router.delete('/:id', authenticate, taskController.deleteTask);
router.patch('/:id/assign', authenticate, checkRole(['admin', 'executor']), taskController.assignExecutor);



module.exports = router;
