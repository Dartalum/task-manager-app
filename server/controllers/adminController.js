const { TaskType, TaskStatus } = require('../models');

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

module.exports = {
    getTaskTypes,
    addTaskType,
    deleteTaskType,
    getTaskStatuses,
    addTaskStatus,
    deleteTaskStatus
};
