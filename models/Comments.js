const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// Use a class declaration for the model which extends Sequelize's Model class
class Comment extends Model {}

// Initialize the model's schema and configuration
Comment.init(
  {
    // Define attributes
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    comment_text: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1], // Ensures the comment is not empty
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user', // This should match the table name for the user model
        key: 'id',
      },
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'post', // This should match the table name for the post model
        key: 'id',
      },
    },
  },
  {
    // Sequelize model options
    sequelize,
    freezeTableName: true, // Prevents Sequelize from renaming the table
    underscored: true, // Ensures that all attributes are named with underscores instead of camelCase
    modelName: 'comment', // This is the name to use when associating with other models
  }
);

module.exports = Comment;
