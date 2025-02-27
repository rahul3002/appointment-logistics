const User = require('../models/user.model');
const ApiError = require('../../../utils/apiError');
const ApiResponse = require('../../../utils/apiResponse');
const logger = require('../../../utils/logger');

/**
 * Register a new user
 * @route POST /api/v1/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError('Email already in use', 400));
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });

    // Generate token
    const token = user.generateAuthToken();

    // Remove password from output
    user.password = undefined;

    logger.info(`New user registered: ${email}`);
    
    res.status(201).json(
      ApiResponse.success(201, 'User registered successfully', {
        user,
        token
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * @route POST /api/v1/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return next(new ApiError('Please provide email and password', 400));
    }

    // Check if user exists & password is correct
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new ApiError('Incorrect email or password', 401));
    }

    // Generate token
    const token = user.generateAuthToken();

    // Remove password from output
    user.password = undefined;

    logger.info(`User logged in: ${email}`);
    
    res.status(200).json(
      ApiResponse.success(200, 'Login successful', {
        user,
        token
      })
    );
  } catch (error) {
    next(error);
  }
};
