const jwt = require('jsonwebtoken');

/**
 * Middleware: verify JWT token from Authorization header.
 * Attaches decoded user payload to req.user.
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    if (!process.env.JWT_SECRET) {
      console.error('CRITICAL: JWT_SECRET missing in middleware');
      throw new Error('JWT_SECRET missing');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT Verification error:', err.message);
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

/**
 * Middleware: allow only admin role.
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ error: 'Admin access required.' });
};

/**
 * Middleware: allow instructors or admins.
 */
const isInstructor = (req, res, next) => {
  if (req.user && (req.user.role === 'instructor' || req.user.role === 'admin')) {
    return next();
  }
  return res.status(403).json({ error: 'Instructor access required.' });
};

module.exports = { authenticate, isAdmin, isInstructor };
