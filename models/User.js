const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// Extend the Model class to create our User model
class User extends Model {
  // Instance method to check password validity
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

// Initialize our User model
User.init(
  {
    // Define model attributes
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // Ensure usernames are unique
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8] // Minimum password length of 8 characters
      }
    }
  },
  {
    // Define model hooks
    hooks: {
      // Before creating a new user, hash the password
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
      // Before updating a user, hash the new password
      async beforeUpdate(updatedUserData) {
        updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
        return updatedUserData;
      }
    },
    sequelize, // Pass in the sequelize instance
    timestamps: false, // Do not use default timestamp fields
    freezeTableName: true, // Do not pluralize table name
    underscored: true, // Use snake_case rather than camelCase
    modelName: 'user' // The name of the model
  }
);

module.exports = User;
