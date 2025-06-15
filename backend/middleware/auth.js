const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization header' });
    }

    // Check if token is in correct format
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    // Extract token
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Check if token has required fields
      if (!decoded.userId || !decoded.role) {
        return res.status(401).json({ message: 'Invalid token payload' });
      }

      // Find user
      const user = await User.findOne({ 
        _id: decoded.userId,
        isActive: true 
      }).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'User not found or account is deactivated' });
      }

      // Add user info to request
      req.user = {
        userId: decoded.userId,
        role: decoded.role
      };
      req.token = token;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token has expired' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Authentication error' });
  }
};

// Role-based access control middleware
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. This action requires one of the following roles: ${roles.join(', ')}` 
      });
    }
    next();
  };
};

module.exports = {
  auth,
  checkRole
}; 