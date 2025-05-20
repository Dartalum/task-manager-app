const { TaskType, TaskStatus } = require('../models');
const { UserRole, User } = require('../models');
const bcrypt = require('bcrypt');

const getTaskTypes = async (req, res) => {
    try {
        const types = await TaskType.findAll();
        res.json(types);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch task types', error: err.message });
    }
};

const addTaskType = async (req, res) => {
    const { name } = req.body;
    try {
        const existing = await TaskType.findOne({ where: { name } });
        if (existing) return res.status(400).json({ message: 'Task type already exists' });

        const type = await TaskType.create({ name });
        res.status(201).json(type);
    } catch (err) {
        res.status(500).json({ message: 'Failed to add task type', error: err.message });
    }
};

const deleteTaskType = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await TaskType.destroy({ where: { id } });
        if (!deleted) return res.status(404).json({ message: 'Task type not found' });
        res.json({ message: 'Task type deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete task type', error: err.message });
    }
};

const getTaskStatuses = async (req, res) => {
    try {
        const statuses = await TaskStatus.findAll();
        res.json(statuses);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch task statuses', error: err.message });
    }
};

const addTaskStatus = async (req, res) => {
    const { name } = req.body;
    try {
        const existing = await TaskStatus.findOne({ where: { name } });
        if (existing) return res.status(400).json({ message: 'Task status already exists' });

        const status = await TaskStatus.create({ name });
        res.status(201).json(status);
    } catch (err) {
        res.status(500).json({ message: 'Failed to add task status', error: err.message });
    }
};

const deleteTaskStatus = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await TaskStatus.destroy({ where: { id } });
        if (!deleted) return res.status(404).json({ message: 'Task status not found' });
        res.json({ message: 'Task status deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete task status', error: err.message });
    }
};

const getRoles = async (req, res) => {
    try {
        const roles = await UserRole.findAll();
        res.json(roles);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch roles', error: err.message });
    }
};

const addUser = async (req, res) => {
    console.log('[addUser] req.body:', req.body);
    const { email, password, username, firstName, lastName, middleName, roleId } = req.body;

    if (!email || !password || !username || !firstName || !lastName || !roleId) {
        return res.status(400).json({ message: 'Заполните все обязательные поля' });
    }

    try {
        const existing = await User.findOne({ where: { email } });
        if (existing) {
            return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email,
            password: hashedPassword,
            firstName,
            username,
            lastName,
            middleName,
            roleId
        });

        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка при создании пользователя', error: err.message });
    }
};

module.exports = {
    getTaskTypes,
    addTaskType,
    deleteTaskType,
    getTaskStatuses,
    addTaskStatus,
    deleteTaskStatus,
    getRoles,
    addUser
};
