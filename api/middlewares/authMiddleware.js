const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require('../db');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Validar que el usuario aún existe en la base de datos
    const { rows } = await db.query('SELECT id FROM users WHERE id = $1', [decoded.userId]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Tu sesión ha expirado o el usuario ya no existe. Por favor, inicia sesión nuevamente.' });
    }

    req.user = decoded; // { userId, role }
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: You do not have enough permissions' });
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};
