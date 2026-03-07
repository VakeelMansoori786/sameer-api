// middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();  // load .env

const secret = process.env.JWT_SECRET;

const auth = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token.split(' ')[1], secret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = auth;