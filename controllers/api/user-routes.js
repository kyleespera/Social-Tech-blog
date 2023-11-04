const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Exclude password attribute from responses
const userAttributes = { exclude: ['password'] };

// Handle errors centrally
const handleErrors = (res, err) => {
  console.error(err);
  res.status(500).json(err);
};

// GET all users
router.get('/', async (req, res) => {
  try {
    const dbUserData = await User.findAll({ attributes: userAttributes });
    res.json(dbUserData);
  } catch (err) {
    handleErrors(res, err);
  }
});

// GET a single user by id
router.get('/:id', async (req, res) => {
  try {
    const dbUserData = await User.findOne({
      attributes: userAttributes,
      where: { id: req.params.id },
      include: [
        { model: Post, attributes: ['id', 'title', 'post_text', 'created_at'] },
        { model: Comment, attributes: ['id', 'comment_text', 'created_at'] },
      ],
    });

    if (!dbUserData) {
      res.status(404).json({ message: 'No User found with this id' });
      return;
    }
    res.json(dbUserData);
  } catch (err) {
    handleErrors(res, err);
  }
});

// Create a new user
router.post('/', async (req, res) => {
  try {
    const dbUserData = await User.create({
      username: req.body.username,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;

      res.json(dbUserData);
    });
  } catch (err) {
    handleErrors(res, err);
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const dbUserData = await User.findOne({ where: { username: req.body.username } });

    if (!dbUserData) {
      res.status(400).json({ message: 'Username not found' });
      return;
    }

    const validPassword = dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;

      res.json({ user: dbUserData, message: 'You are now logged in!' });
    });
  } catch (err) {
    handleErrors(res, err);
  }
});

// Logout route
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// Update a user by id
router.put('/:id', async (req, res) => {
  try {
    const dbUserData = await User.update(req.body, {
      individualHooks: true,
      where: { id: req.params.id },
    });

    if (!dbUserData[0]) {
      res.status(404).json({ message: 'No User found with this id' });
      return;
    }

    res.json(dbUserData);
  } catch (err) {
    handleErrors(res, err);
  }
});

// Delete a user by id
router.delete('/:id', async (req, res) => {
  try {
    const dbUserData = await User.destroy({ where: { id: req.params.id } });

    if (!dbUserData) {
      res.status(404).json({ message: 'No User found with this id' });
      return;
    }

    res.json(dbUserData);
  } catch (err) {
    handleErrors(res, err);
  }
});

module.exports = router;
