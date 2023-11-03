const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Helper function for handling errors
const handleErrors = (res, err) => {
  console.log(err);
  res.status(500).json(err);
};

router.get('/', async (req, res) => {
  try {
    const dbCommentData = await Comment.findAll();
    res.json(dbCommentData);
  } catch (err) {
    handleErrors(res, err);
  }
});

router.post('/', withAuth, async (req, res) => {
  // Check for a session
  if (req.session) {
    try {
      const dbCommentData = await Comment.create({
        comment_text: req.body.comment_text,
        post_id: req.body.post_id,
        user_id: req.session.user_id,
      });
      res.json(dbCommentData);
    } catch (err) {
      res.status(400).json(err);
    }
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const dbCommentData = await Comment.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!dbCommentData) {
      res.status(404).json({ message: 'No comment found with this id' });
      return;
    }
    res.json(dbCommentData);
  } catch (err) {
    handleErrors(res, err);
  }
});

module.exports = router;
