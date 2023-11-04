const router = require('express').Router();
const { Post, User, Comment } = require('../models');

// Helper function to serialize data
const serializeData = (data) => data.get({ plain: true });

// Attributes to be retrieved for posts, users, and comments
const postAttributes = ['id', 'title', 'post_text', 'created_at'];
const userAttributes = ['username'];
const commentAttributes = ['id', 'comment_text', 'post_id', 'user_id', 'created_at'];

// Include options for post queries
const includeOptions = [
  {
    model: Comment,
    attributes: commentAttributes,
    include: {
      model: User,
      attributes: userAttributes
    }
  },
  {
    model: User,
    attributes: userAttributes
  }
];

// Error handling function
const handleErrors = (err, res) => {
  console.error(err);
  res.status(500).json(err);
};

// GET all posts to display on the homepage
router.get('/', async (req, res) => {
  try {
    const dbPostData = await Post.findAll({
      attributes: postAttributes,
      include: includeOptions
    });
    const posts = dbPostData.map(serializeData);
    res.render('homepage', { posts, loggedIn: req.session.loggedIn });
  } catch (err) {
    handleErrors(err, res);
  }
});

// GET the login page, redirect if user is already logged in
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

// GET a single post
router.get('/post/:id', async (req, res) => {
  try {
    const dbPostData = await Post.findOne({
      where: { id: req.params.id },
      attributes: postAttributes,
      include: includeOptions
    });

    if (!dbPostData) {
      res.status(404).json({ message: 'No Post found with this id' });
      return;
    }

    const post = serializeData(dbPostData);
    res.render('single-post', { post, loggedIn: req.session.loggedIn });
  } catch (err) {
    handleErrors(err, res);
  }
});

module.exports = router;
