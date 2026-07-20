const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/signup
const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'An account with that email already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed });

    res.status(201).json({ message: 'Account created — please log in' });
  } catch (err) {
    res.status(500).json({ message: 'Server error — please try again' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error — please try again' });
  }
};

module.exports = { signup, login };
