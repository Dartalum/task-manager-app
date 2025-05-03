const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const taskController = require('../controllers/taskController');

router.post('/', authenticate, taskController.createTask);
router.get('/', authenticate, taskController.getUserTasks);
router.patch('/:id', authenticate, taskController.updateTask);
router.delete('/:id', authenticate, taskController.deleteTask);
router.get('/:id', authenticate, taskController.getTaskById);


module.exports = router;
