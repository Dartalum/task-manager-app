module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    middleName: DataTypes.STRING,
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Users'
  });


  User.associate = (models) => {
    User.belongsTo(models.UserRole, { foreignKey: 'roleId' });
    User.hasMany(models.Task, { as: 'createdTasks', foreignKey: 'authorId' });
    User.hasMany(models.Task, { as: 'assignedTasks', foreignKey: 'executorId' });
    User.hasMany(models.Comment, { foreignKey: 'userId' });
  };

  return User;
};
