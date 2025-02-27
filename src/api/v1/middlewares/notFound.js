const ApiError = require('../../../utils/apiError');

/**
 * 404 Not Found middleware
 */
const notFound = (req, res, next) => {
  const error = new ApiError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

module.exports = { notFound };
