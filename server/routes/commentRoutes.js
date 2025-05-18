const express = require('express');
const router = express.Router();
const { createComment, getComments } = require('../controllers/commentController');
const authenticate = require('../middleware/authMiddleware');

// Проверка, что файл подключился
console.log('[ROUTES] commentRoutes.js подключён');

// Маршрут для добавления комментария
router.post('/:taskId', (req, res, next) => {
    console.log('[ROUTES] POST /api/comments/:taskId сработал');
    next();
}, authenticate, createComment);

// Маршрут для получения комментариев
router.get('/', authenticate, getComments);

module.exports = router;
