const express = require('express');
const router = express.Router({ mergeParams: true });
const { createComment, getComments } = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');


const authenticate = require('../middleware/authMiddleware');
const commentController = require('../controllers/commentController');

router.post('/:taskId', authMiddleware, createComment);
router.post('/', authenticate, commentController.createComment);
router.get('/', authenticate, commentController.getComments);

module.exports = router;
