const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comments'); // Ensure this matches your file name. It should likely be 'Comment', not 'Comments'.

// Create model associations
// Users can create many Posts
User.hasMany(Post, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE' // If a User is deleted, also delete any associated Posts
});

// A Post belongs to a single User
Post.belongsTo(User, {
  foreignKey: 'user_id'
});

// A Comment is made by a User on a Post
// A Comment belongs to a single User
Comment.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE' // If a User is deleted, also delete any associated Comments
});

// A Comment is associated with a single Post
Comment.belongsTo(Post, {
  foreignKey: 'post_id',
  onDelete: 'CASCADE' // If a Post is deleted, also delete any associated Comments
});

// A User can make many Comments
User.hasMany(Comment, {
  foreignKey: 'user_id'
});

// A Post can have many Comments
Post.hasMany(Comment, {
  foreignKey: 'post_id'
});

// Exporting our models with their associations
module.exports = { User, Post, Comment };
