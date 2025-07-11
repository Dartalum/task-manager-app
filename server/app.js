const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const commentRoutes = require('./routes/commentRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
//const publicRoutes = require ('./routes/publicRoutes.js');
const authenticate = require('./middleware/authMiddleware');
const checkRole = require('./middleware/checkRole');




//.env
dotenv.config();

//Express-приложение
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Роуты
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);
//app.use('/api', publicRoutes);
//app.use('/api/tasks/:id/comments', commentRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', authenticate, checkRole(['admin']), adminRoutes);




//запуск из server.js
module.exports = app;
