const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, UserRole } = require('../models');

// Генерация JWT токена
const generateToken = (user, roleName) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            roleId: user.roleId,
            role: roleName
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

// Регистрация пользователя
const register = async (req, res) => {
    const { username, email, password, firstName, lastName, middleName, roleName = 'user' } = req.body;

    try {
        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(400).json({ message: 'Email already registered' });

        const role = await UserRole.findOne({ where: { name: roleName } });
        if (!role) return res.status(400).json({ message: 'Invalid role' });

        const hash = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hash,
            firstName,
            lastName,
            middleName,
            roleId: role.id
        });

        const token = generateToken(user, role.name);

        res.status(201).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                roleId: user.roleId,
                role: role.name
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Registration failed', error: err.message });
    }
};

// Логин пользователя
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({
            where: { email },
            include: { model: UserRole, attributes: ['name'] }
        });

        if (!user) return res.status(401).json({ message: 'Login failed', error: 'User not found' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ message: 'Login failed', error: 'Invalid password' });

        const roleName = user.UserRole.name;
        const token = generateToken(user, roleName);

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                middleName: user.middleName,
                roleId: user.roleId,
                role: roleName
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Login error', error: err.message });
    }
};

module.exports = { register, login };
