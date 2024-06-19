const jwt = require('jsonwebtoken');
const User = require('../models/Users'); // Correct path to the User model

const JWT_SECRET = process.env.JWT_SECRET || 'Secret-ecom';

const authenticateUser = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Token:', token);  // Debug log

  if (!token) {
    console.log('No token provided');  // Debug log
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET,{expiresIn: "1h"});
    console.log('Decoded:', decoded);  // Debug log

    const user = await User.findById(decoded.user.id); // Correct method usage
    console.log('User:', user);  // Debug log

    if (!user) {
      console.log('User not found');  // Debug log
      return res.status(401).json({ message: 'User not found, authorization denied' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('JWT Error:', error);  // Debug log
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { authenticateUser };
