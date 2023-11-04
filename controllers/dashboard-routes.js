const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

// Helper function to serialize data
const serializeData = data => data.map(post => post.get({ plain: true }));

// Handler for errors
const errorHandler = (err, res) => {
  console.error(err);
  res.status(500).json(err);
};

// Attributes to be retrieved for posts
const postAttributes = ['id', 'title', 'post_text', 'created_at'];

// Attributes to be retrieved for users
const userAttributes = ['username'];

// Attributes to be retrieved for comments
const commentAttributes = ['id', 'comment_text', 'post_id', 'user_id', 'created_at'];

// Include options for post queries
const includeOptions = [
  {
    model: User,
    attributes: userAttributes
  },
  {
    model: Comment,
    attributes: commentAttributes,
    include: {
      model: User,
      attributes: userAttributes
    }
  }
];

// GET all posts
router.get('/', withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.findAll({
      where: {
        user_id: req.session.user_id
      },
      attributes: postAttributes,
      order: [['created_at', 'DESC']],
      include: includeOptions
    });

    const posts = serializeData(dbPostData);
    res.render('dashboard', { posts, loggedIn: true });
  } catch (err) {
    errorHandler(err, res);
  }
});

// GET a single post for editing
router.get('/edit/:id', withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: postAttributes,
      include: includeOptions
    });

    if (!dbPostData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }

    const post = dbPostData.get({ plain: true });
    res.render('edit-post', { post, loggedIn: req.session.loggedIn });
  } catch (err) {
    errorHandler(err, res);
  }
});

// GET the page to create a new post
router.get('/new', withAuth, (req, res) => {
  // You might want to add authentication here if creating a post requires a user to be logged in.
  res.render('new-post', { loggedIn: req.session.loggedIn });
});

module.exports = router;
