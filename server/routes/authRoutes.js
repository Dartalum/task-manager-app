const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);

router.get('/me', authenticate, async (req, res) => {
    const { User } = require('../models');

    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'username', 'email', 'role']
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user', error: error.message });
    }
});

module.exports = router;
