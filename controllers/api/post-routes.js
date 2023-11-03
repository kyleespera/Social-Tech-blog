const express = require('express');
const router = express.Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Helper function to get post attributes
const getPostAttributes = () => ({
  attributes: ['id', 'title', 'post_text', 'created_at'],
  include: [
    {
      model: User,
      attributes: ['username'],
    },
    {
      model: Comment,
      attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
      include: {
        model: User,
        attributes: ['username'],
      },
    },
  ],
});

// GET all posts
router.get('/', async (req, res) => {
  try {
    const dbPostData = await Post.findAll({
      ...getPostAttributes(),
      order: [['created_at', 'DESC']],
    });
    res.json(dbPostData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// GET a single post by id
router.get('/:id', async (req, res) => {
  try {
    const dbPostData = await Post.findOne({
      ...getPostAttributes(),
      where: { id: req.params.id },
    });

    if (!dbPostData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }

    res.json(dbPostData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// POST a new post
router.post('/', withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.create({
      title: req.body.title,
      post_text: req.body.post_text,
      user_id: req.session.user_id,
    });

    res.json(dbPostData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// PUT to update a post
router.put('/:id', withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.update(req.body, {
      where: { id: req.params.id },
    });

    if (!dbPostData[0]) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }

    res.json(dbPostData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// DELETE a post
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.destroy({
      where: { id: req.params.id },
    });

    if (!dbPostData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
