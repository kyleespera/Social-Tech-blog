const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// Define the Post model class extending Sequelize's Model class
class Post extends Model {}

// Initialize the Post model's schema and configuration
Post.init(
  {
    // Define the attributes of the Post model
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true // Automatically increment the ID for each new Post
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false // Title cannot be null, it's required
    },
    post_text: {
      type: DataTypes.TEXT, // Changed to TEXT to allow for longer posts
      allowNull: false // Post content cannot be null, it's required
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users', // This references the 'users' table
        key: 'id'
      }
    }
  },
  {
    // Model options
    sequelize, // Pass the connection instance
    freezeTableName: true, // Model tableName will be the same as the model name
    underscored: true, // Use snake_case rather than camelCase for database attributes
    modelName: 'post' // Name of the model in the database is 'post'
  }
);

// Export the Post model
module.exports = Post;
