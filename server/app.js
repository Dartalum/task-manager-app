const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const commentRoutes = require('./routes/commentRoutes');



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
app.use('/api/tasks/:id/comments', commentRoutes);


//запуск из server.js
module.exports = app;
