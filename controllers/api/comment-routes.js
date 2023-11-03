const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Helper function for handling errors
const handleErrors = (res, err) => {
  console.error(err); // Using console.error for logging errors is a better practice
  res.status(500).json({
    message: 'An error occurred', // It's good to provide a generic error message rather than exposing the error details
    error: err.toString(), // Send a string version of the error for client-side handling if needed
  });
};

// Route to get all comments
router.get('/', async (req, res) => {
  try {
    const dbCommentData = await Comment.findAll();
    res.json(dbCommentData);
  } catch (err) {
    handleErrors(res, err);
  }
});

// Route to create a new comment with authentication
router.post('/', withAuth, async (req, res) => {
  try {
    const newComment = {
      comment_text: req.body.comment_text,
      post_id: req.body.post_id,
      // Ensuring that user_id is obtained from the session which is supposed to be set after authentication
      user_id: req.session.user_id,
    };

    const dbCommentData = await Comment.create(newComment);
    res.status(201).json(dbCommentData); // Respond with 201 status code on successful creation
  } catch (err) {
    handleErrors(res, err);
  }
});

// Route to delete a comment by id
router.delete('/:id', withAuth, async (req, res) => { // Assuming deletion should also be protected by auth
  try {
    const dbCommentData = await Comment.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!dbCommentData) {
      return res.status(404).json({ message: 'No comment found with this id' });
    }

    res.status(200).json({ message: 'Comment deleted successfully' }); // Send a confirmation message on successful deletion
  } catch (err) {
    handleErrors(res, err);
  }
});

module.exports = router;
