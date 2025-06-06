const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole } = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken');
const checkRole = require('../middleware/checkRole');


router.get('/', authenticateToken, getAllUsers);
router.patch('/:id/role', authenticateToken, updateUserRole);

module.exports = router;
