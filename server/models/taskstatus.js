module.exports = (sequelize, DataTypes) => {
  const TaskStatus = sequelize.define('TaskStatus', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'TaskStatuses'
  });

  TaskStatus.associate = (models) => {
    TaskStatus.hasMany(models.Task, { foreignKey: 'statusId' });
  };

  return TaskStatus;
};
