import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const getJwtSecret = () => {
  return (process.env.JWT_SECRET || 'skillswap_live_super_secret_jwt_key_2026_secure').trim();
};

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]?.trim();
      
      if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, token missing' });
      }

      const decoded = jwt.verify(token, getJwtSecret());
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User account not found' });
      }

      return next();
    } catch (error) {
      console.error('Auth verification error:', error.message);
      return res.status(401).json({ 
        success: false, 
        message: error.name === 'TokenExpiredError' 
          ? 'Session expired. Please log in again.' 
          : 'Not authorized, invalid token.' 
      });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no authentication token' });
  }
};

// Optional auth middleware (attaches user if token is present, but doesn't block)
export const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]?.trim();
      if (token) {
        const decoded = jwt.verify(token, getJwtSecret());
        req.user = await User.findById(decoded.id).select('-password');
      }
    } catch (error) {
      // Ignore token failure for optional auth
    }
  }
  next();
};
