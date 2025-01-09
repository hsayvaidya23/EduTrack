// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (allowedRoles) => (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (!allowedRoles || !Array.isArray(allowedRoles)) {
      return res.status(403).json({ message: 'Invalid role configuration.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Permission denied.' });
    }

    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;