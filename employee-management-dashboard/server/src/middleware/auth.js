import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Route guard: verifies the Bearer token, loads the user, and attaches
 * it to req.user. Any protected route mounts this before its handler.
 */
export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    // Covers expired / malformed / tampered tokens.
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
};
