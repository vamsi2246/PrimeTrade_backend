const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('../utils/errors');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.access_token) {
    token = req.cookies.access_token;
  }

  if (!token) {
    return next(new AuthenticationError('Authentication token missing'));
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

    const userAccount = await User.findById(decodedToken.id);
    if (!userAccount) {
      return next(new AuthenticationError('User account not found'));
    }

    if (!userAccount.isActive) {
      return next(new AuthenticationError('User account is deactivated'));
    }

    req.user = {
      id: userAccount._id.toString(),
      name: userAccount.name,
      email: userAccount.email,
      role: userAccount.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = protect;
