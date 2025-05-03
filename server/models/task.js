module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    dueDate: DataTypes.DATE
  }, {
    tableName: 'Tasks'
  });

  Task.associate = (models) => {
    Task.belongsTo(models.TaskType, { foreignKey: 'typeId' });
    Task.belongsTo(models.TaskStatus, { foreignKey: 'statusId' });
    Task.belongsTo(models.User, { as: 'author', foreignKey: 'authorId' });
    Task.belongsTo(models.User, { as: 'executor', foreignKey: 'executorId' });
    Task.belongsTo(models.Task, { as: 'parent', foreignKey: 'parentId' });
    Task.hasMany(models.Task, { as: 'subtasks', foreignKey: 'parentId' });
    Task.hasMany(models.Comment, { foreignKey: 'taskId' });
  };

  return Task;
};
