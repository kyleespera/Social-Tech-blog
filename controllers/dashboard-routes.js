const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

// Helper function to serialize data
const serializeData = (data) => data.map((post) => post.get({ plain: true }));

// Attributes and include options for the queries
const postAttributes = ['id', 'title', 'post_text', 'created_at'];
const userAttributes = ['username'];
const commentAttributes = ['id', 'comment_text', 'post_id', 'user_id', 'created_at'];
const includeOptions = [
  {
    model: User,
    attributes: userAttributes,
  },
  {
    model: Comment,
    attributes: commentAttributes,
    include: {
      model: User,
      attributes: userAttributes,
    },
  },
];

// Error handling function
const handleErrors = (err, res) => {
  console.error(err);
  res.status(500).json(err);
};

// GET all posts for dashboard
router.get('/', withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.findAll({
      where: { user_id: req.session.user_id },
      attributes: postAttributes,
      order: [['created_at', 'DESC']],
      include: includeOptions,
    });

    const posts = serializeData(dbPostData);
    res.render('dashboard', { posts, loggedIn: true });
  } catch (err) {
    handleErrors(err, res);
  }
});

// GET a single post for editing
router.get('/edit/:id', withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.findOne({
      where: { id: req.params.id },
      attributes: postAttributes,
      include: includeOptions,
    });

    if (!dbPostData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }

    const post = dbPostData.get({ plain: true });
    res.render('edit-post', { post, loggedIn: req.session.loggedIn });
  } catch (err) {
    handleErrors(err, res);
  }
});

// GET the page to create a new post
router.get('/new', withAuth, (req, res) => {
  res.render('new-post', { loggedIn: req.session.loggedIn });
});

module.exports = router;
