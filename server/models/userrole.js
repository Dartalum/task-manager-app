module.exports = (sequelize, DataTypes) => {
    const UserRole = sequelize.define('UserRole', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        tableName: 'UserRoles'
    });

    UserRole.associate = (models) => {
        UserRole.hasMany(models.User, { foreignKey: 'roleId' });
    };

    return UserRole;
};
