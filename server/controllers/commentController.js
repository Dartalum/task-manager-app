const { Comment, Task, User } = require('../models');

const createComment = async (req, res) => {
    const { taskId } = req.params;
    const { content } = req.body;

    try {
        const task = await Task.findByPk(taskId);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        const comment = await Comment.create({
            content,
            userId: req.user.id,
            taskId
        });

        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ message: 'Error creating comment', error: err.message });
    }
};

const getComments = async (req, res) => {
    const { id: taskId } = req.params;

    try {
        const comments = await Comment.findAll({
            where: { taskId },
            include: {
                model: User,
                attributes: ['id', 'username']
            },
            order: [['createdAt', 'ASC']]
        });

        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching comments', error: err.message });
    }
};

module.exports = {
    createComment,
    getComments
};
