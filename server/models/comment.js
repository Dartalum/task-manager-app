module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'Comments'
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.User, { foreignKey: 'userId' });
    Comment.belongsTo(models.Task, { foreignKey: 'taskId' });
  };

  return Comment;
};
