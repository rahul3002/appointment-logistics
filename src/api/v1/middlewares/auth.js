const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const config = require('../../../config');
const ApiError = require('../../../utils/apiError');
const User = require('../models/user.model');

/**
 * Authentication middleware
 * Protects routes by verifying JWT token
 */
const protect = async (req, res, next) => {
  try {
    // 1) Check if token exists
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new ApiError('You are not logged in. Please log in to get access.', 401)
      );
    }

    // 2) Verify token
    const decoded = await promisify(jwt.verify)(token, config.jwt.secret);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new ApiError('The user belonging to this token no longer exists.', 401)
      );
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Authorization middleware
 * Restricts routes to specific roles
 * @param {...string} roles - Allowed roles
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

module.exports = {
  protect,
  restrictTo
};
