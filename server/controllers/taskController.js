const { Task, User, TaskType, TaskStatus, sequelize } = require('../models');
const { Op } = require('sequelize');

const createTask = async (req, res) => {
    const { title, description, typeId, dueDate, executorId } = req.body;

    const transaction = await sequelize.transaction();

    try {
        const taskData = {
            title,
            description,
            typeId,
            dueDate,
            authorId: req.user.id,
            statusId: 1 // "new"
        };

        if (executorId !== undefined) {
            const executor = await User.findByPk(executorId, { transaction });
            if (!executor) {
                await transaction.rollback();
                return res.status(400).json({ message: 'Executor not found' });
            }
            taskData.executorId = executorId;
        }

        const task = await Task.create(taskData, { transaction });

        const parentTypes = await TaskType.findAll({
            where: { name: ['creation request', 'modification request'] },
            transaction
        });

        const parentTypeIds = parentTypes.map(t => t.id);

        if (parentTypeIds.includes(task.typeId)) {
            const subTypes = await TaskType.findAll({
                where: { name: ['analysis', 'development', 'testing'] },
                transaction
            });

            const subTaskNames = ['Анализ', 'Разработка', 'Тестирование'];

            for (let i = 0; i < subTaskNames.length; i++) {
                await Task.create({
                    title: subTaskNames[i],
                    description: `Подзадача: ${subTaskNames[i]}`,
                    typeId: subTypes[i].id,
                    statusId: task.statusId,
                    dueDate: task.dueDate,
                    authorId: task.authorId,
                    executorId: null,
                    parentId: task.id
                }, { transaction });
            }
        }

        await transaction.commit();
        res.status(201).json(task);
    } catch (err) {
        await transaction.rollback();
        res.status(500).json({ message: 'Error creating task', error: err.message });
    }
};


const getUserTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({
            where: {
                [Op.or]: [
                    { authorId: req.user.id },
                    { executorId: req.user.id }
                ]
            },
            include: [
                { model: User, as: 'author', attributes: ['id', 'username'] },
                { model: User, as: 'executor', attributes: ['id', 'username'] }
            ]
        });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching tasks', error: err.message });
    }
};

const updateTask = async (req, res) => {
    const { id } = req.params;
    const { status, executorId, typeId, description } = req.body;

    try {
        const task = await Task.findByPk(id, {
            include: [{ model: Task, as: 'subtasks' }]
        });

        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (description !== undefined) {
            task.description = description;
        }

        if (typeId !== undefined && ['executor', 'admin'].includes(req.user.role)) {
            task.typeId = typeId;
        }

        if (status && ['executor', 'admin'].includes(req.user.role)) {
            const cancelStatus = await TaskStatus.findOne({ where: { name: 'cancelled' } });
            if (!cancelStatus) return res.status(500).json({ message: 'Status "cancelled" not found' });

            const targetStatus = await TaskStatus.findByPk(status);
            if (!targetStatus) return res.status(400).json({ message: 'Invalid status' });

            task.statusId = targetStatus.id;

            if (targetStatus.name === 'cancelled') {
                const completedStatus = await TaskStatus.findOne({ where: { name: 'completed' } });

                await Task.update(
                    { statusId: cancelStatus.id },
                    {
                        where: {
                            parentId: task.id,
                            statusId: { [Op.ne]: completedStatus.id }
                        }
                    }
                );
            }
        }

        if (executorId !== undefined && ['executor', 'admin'].includes(req.user.role)) {
            const executor = await User.findByPk(executorId);
            if (!executor) return res.status(400).json({ message: 'Executor not found' });
            task.executorId = executorId;
        }

        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: 'Error updating task', error: err.message });
    }
};

const deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findByPk(id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (task.authorId !== req.user.id) {
            return res.status(403).json({ message: 'You can delete only your tasks' });
        }

        await task.destroy();
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting task', error: err.message });
    }
};

const getTaskById = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findByPk(id, {
            include: [
                { model: User, as: 'author', attributes: ['id', 'username'] },
                { model: User, as: 'executor', attributes: ['id', 'username'] },
                {
                    model: Task,
                    as: 'subtasks',
                    include: [
                        { model: User, as: 'author', attributes: ['id', 'username'] },
                        { model: User, as: 'executor', attributes: ['id', 'username'] }
                    ]
                },
                {
                    model: require('../models').Comment,
                    include: { model: User, attributes: ['id', 'username'] }
                }
            ]
        });

        if (!task) return res.status(404).json({ message: 'Task not found' });

        res.json(task);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching task', error: err.message });
    }
};

module.exports = {
    createTask,
    getUserTasks,
    updateTask,
    deleteTask,
    getTaskById
};
