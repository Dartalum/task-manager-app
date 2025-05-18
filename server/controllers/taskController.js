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
                    statusId: task.TaskStatus?.nameId,
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
    const { statusId, executorId, typeId, description } = req.body;

    try {
        const task = await Task.findByPk(id, {
            include: [{ model: Task, as: 'subtasks' }]
        });

        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Обновить описание может любой
        if (description !== undefined) {
            task.description = description;
        }

        // Обновление типа задачи — только для исполнителя или администратора
        if (typeId !== undefined && ['executor', 'admin'].includes(req.user.role)) {
            task.typeId = typeId;
        }

        // Обновление статуса задачи — только для исполнителя или администратора
        if (statusId !== undefined && ['executor', 'admin'].includes(req.user.role)) {
            const cancelStatus = await TaskStatus.findOne({ where: { name: 'cancelled' } });
            if (!cancelStatus) {
                return res.status(500).json({ message: 'Status "cancelled" not found' });
            }

            const targetStatus = await TaskStatus.findByPk(statusId);
            if (!targetStatus) {
                return res.status(400).json({ message: 'Invalid statusId' });
            }

            task.statusId = targetStatus.id;

            // Если статус "cancelled", то отменить все незавершённые подзадачи
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

        // Обновление исполнителя — только для исполнителя или администратора
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

const getAllTasks = async (req, res) => {
    const {
        author,
        executor,
        statusId,
        typeId,
        startDate,
        endDate,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;

    const where = {};

    if (statusId) where.statusId = statusId;
    if (typeId) where.typeId = typeId;
    if (startDate && endDate) {
        where.createdAt = {
            [Op.between]: [new Date(startDate), new Date(endDate)]
        };
    }

    const include = [
        {
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'email'],
            where: author ? {
                [Op.or]: [
                    { username: { [Op.iLike]: `%${author}%` } },
                    { email: { [Op.iLike]: `%${author}%` } }
                ]
            } : undefined
        },
        {
            model: User,
            as: 'executor',
            attributes: ['id', 'username', 'email'],
            where: executor ? {
                [Op.or]: [
                    { username: { [Op.iLike]: `%${executor}%` } },
                    { email: { [Op.iLike]: `%${executor}%` } }
                ]
            } : undefined
        },
        { model: TaskStatus },
        { model: TaskType }
    ];

    try {
        const { rows, count } = await Task.findAndCountAll({
            where,
            include,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [[sortBy, order.toUpperCase()]]
        });

        res.json({
            tasks: rows,
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit)
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching tasks', error: err.message });
    }
};

const assignExecutor = async (req, res) => {
    const { id } = req.params;
    const { executorId } = req.body;

    try {
        const task = await Task.findByPk(id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        const executor = await User.findByPk(executorId);
        if (!executor) return res.status(400).json({ message: 'Executor not found' });

        task.executorId = executorId;
        await task.save();

        res.json({ message: 'Executor assigned', task });
    } catch (err) {
        res.status(500).json({ message: 'Error assigning executor', error: err.message });
    }
};




module.exports = {
    createTask,
    getUserTasks,
    updateTask,
    deleteTask,
    getTaskById,
    getAllTasks,
    assignExecutor
};
