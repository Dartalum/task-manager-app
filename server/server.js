require('dotenv').config(); // Подключаем .env

const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully.');

        await sequelize.sync();

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('❌ Unable to connect to the database:', error.message);
        console.error(error);
    }
})();
