const express = require('express');
const { body } = require('express-validator');
const { signup, login, googleAuth } = require('../controllers/authcontroller');
const { authenticateUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/signup', 
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty')
  ],
  signup
);

router.post(
  '/login', 
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  login
);

router.post('/google-auth', googleAuth);


router.get('/profile', authenticateUser, (req, res) => {
  const user = req.user;
  res.json({ message: 'Access granted', user });
});

module.exports = router;