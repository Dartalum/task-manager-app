
const { Comment, Task, User } = require('../models');

const createComment = async (req, res) => {
    const { taskId } = req.params;
    const { content } = req.body;

    try {
        console.log('[createComment] taskId param =', taskId);
        console.log('[createComment] type of taskId =', typeof taskId);

        const tasks = await Task.findAll({ attributes: ['id', 'title'] });
        console.log('[DEBUG] Все задачи:', tasks);


        const task = await Task.findByPk(Number(taskId));
        console.log('[createComment] task result =', task);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        const comment = await Comment.create({
            content,
            userId: req.user.id,
            taskId: Number(taskId)
        });

        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ message: 'Error creating comment', error: err.message });
    }
};

const getComments = async (req, res) => {
    const { taskId } = req.query;

    try {
        const comments = await Comment.findAll({
            where: { taskId },
            include: {
                model: User,
                attributes: ['id', 'username', 'firstName', 'lastName', 'middleName']
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
