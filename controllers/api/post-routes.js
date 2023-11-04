const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Central error handling function
const handleError = (err, res) => {
  console.error(err);
  res.status(500).json(err);
};

// GET all posts
router.get('/', async (req, res) => {
  try {
    const dbPostData = await Post.findAll({
      attributes: ['id', 'title', 'post_text', 'created_at'],
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['username']
        },
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        }
      ]
    });
    res.json(dbPostData);
  } catch (err) {
    handleError(err, res);
  }
});

// GET a single post by id
router.get('/:id', async (req, res) => {
  try {
    const dbPostData = await Post.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'title', 'post_text', 'created_at'],
      include: [
        {
          model: User,
          attributes: ['username']
        },
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        }
      ]
    });

    if (!dbPostData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }
    res.json(dbPostData);
  } catch (err) {
    handleError(err, res);
  }
});

// POST a new post
router.post('/', withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.create({
      title: req.body.title,
      post_text: req.body.post_text,
      user_id: req.session.user_id
    });
    res.json(dbPostData);
  } catch (err) {
    handleError(err, res);
  }
});

// PUT to update a post by id
router.put('/:id', withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.update(
      { title: req.body.title, post_text: req.body.post_text },
      { where: { id: req.params.id } }
    );

    if (dbPostData[0] === 0) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }
    res.json({ message: 'Post updated successfully' });
  } catch (err) {
    handleError(err, res);
  }
});

// DELETE a post by id
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.destroy({ where: { id: req.params.id } });

    if (!dbPostData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    handleError(err, res);
  }
});

module.exports = router;
