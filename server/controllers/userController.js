const { User, UserRole } = require('../models');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'middleName', 'roleId'],
            include: { model: UserRole, attributes: ['name'] }
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
};

const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { roleName } = req.body;

    try {
        const role = await UserRole.findOne({ where: { name: roleName } });
        if (!role) return res.status(400).json({ message: 'Role not found' });

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.roleId = role.id;
        await user.save();

        res.json({ message: 'User role updated', userId: user.id, newRole: roleName });
    } catch (err) {
        res.status(500).json({ message: 'Error updating role', error: err.message });
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

module.exports = { getAllUsers, updateUserRole, getRoles };
