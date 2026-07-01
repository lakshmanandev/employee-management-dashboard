import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Sign a short-lived JWT carrying only the user id (never the password).
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });

/**
 * POST /api/auth/login
 * Validates credentials and returns a JWT plus a safe user object.
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  // password has `select: false`, so we explicitly ask for it here.
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  // Same generic message whether the email or password is wrong, so we
  // don't reveal which emails exist (avoids user enumeration).
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    token: signToken(user._id),
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

/**
 * GET /api/auth/me
 * Returns the currently authenticated user (used to restore session on refresh).
 */
export const getMe = async (req, res) => {
  const { _id, name, email, role } = req.user;
  res.json({ id: _id, name, email, role });
};
