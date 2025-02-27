const Hub = require('../models/hub.model');
const ApiError = require('../../../utils/apiError');
const ApiResponse = require('../../../utils/apiResponse');
const logger = require('../../../utils/logger');

/**
 * Get all hubs
 * @route GET /api/v1/hubs
 */
exports.getAllHubs = async (req, res, next) => {
  try {
    // Build query
    const query = {};
    
    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    // Filter by type if provided
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    // Filter by service area if provided
    if (req.query.zipCode) {
      query['serviceArea.zipCode'] = req.query.zipCode;
    }
    
    const hubs = await Hub.find(query);
    
    res.status(200).json(
      ApiResponse.success(200, 'Hubs retrieved successfully', {
        count: hubs.length,
        hubs
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new hub
 * @route POST /api/v1/hubs
 */
exports.createHub = async (req, res, next) => {
  try {
    const hub = await Hub.create(req.body);
    
    logger.info(`New hub created: ${hub.name} (${hub.code})`);
    
    res.status(201).json(
      ApiResponse.success(201, 'Hub created successfully', {
        hub
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get a hub by ID
 * @route GET /api/v1/hubs/:id
 */
exports.getHubById = async (req, res, next) => {
  try {
    const hub = await Hub.findById(req.params.id);
    
    if (!hub) {
      return next(new ApiError('Hub not found', 404));
    }
    
    res.status(200).json(
      ApiResponse.success(200, 'Hub retrieved successfully', {
        hub
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update a hub
 * @route PUT /api/v1/hubs/:id
 */
exports.updateHub = async (req, res, next) => {
  try {
    const hub = await Hub.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!hub) {
      return next(new ApiError('Hub not found', 404));
    }
    
    logger.info(`Hub updated: ${hub.name} (${hub.code})`);
    
    res.status(200).json(
      ApiResponse.success(200, 'Hub updated successfully', {
        hub
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a hub
 * @route DELETE /api/v1/hubs/:id
 */
exports.deleteHub = async (req, res, next) => {
  try {
    const hub = await Hub.findByIdAndDelete(req.params.id);
    
    if (!hub) {
      return next(new ApiError('Hub not found', 404));
    }
    
    logger.info(`Hub deleted: ${hub.name} (${hub.code})`);
    
    res.status(200).json(
      ApiResponse.success(200, 'Hub deleted successfully', null)
    );
  } catch (error) {
    next(error);
  }
};
