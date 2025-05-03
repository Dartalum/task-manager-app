module.exports = (sequelize, DataTypes) => {
  const TaskType = sequelize.define('TaskType', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'TaskTypes'
  });

  TaskType.associate = (models) => {
    TaskType.hasMany(models.Task, { foreignKey: 'typeId' });
  };

  return TaskType;
};
