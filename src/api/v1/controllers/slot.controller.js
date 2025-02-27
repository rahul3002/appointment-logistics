const Slot = require('../models/slot.model');
const ApiError = require('../../../utils/apiError');
const ApiResponse = require('../../../utils/apiResponse');
const logger = require('../../../utils/logger');

/**
 * Get all slots
 * @route GET /api/v1/slots
 */
exports.getAllSlots = async (req, res, next) => {
  try {
    // Build query
    const query = {};
    
    // Filter by hub if provided
    if (req.query.hubId) {
      query.hubId = req.query.hubId;
    }
    
    // Filter by date if provided
    if (req.query.date) {
      const date = new Date(req.query.date);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      query.startTime = {
        $gte: date,
        $lt: nextDay
      };
    }
    
    // Filter by date range if provided
    if (req.query.startDate && req.query.endDate) {
      query.startTime = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }
    
    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    // Filter by type if provided
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    const slots = await Slot.find(query).populate('hubId', 'name code location');
    
    res.status(200).json(
      ApiResponse.success(200, 'Slots retrieved successfully', {
        count: slots.length,
        slots
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new slot
 * @route POST /api/v1/slots
 */
exports.createSlot = async (req, res, next) => {
  try {
    const slot = await Slot.create(req.body);
    
    logger.info(`New slot created: ${slot._id}`);
    
    res.status(201).json(
      ApiResponse.success(201, 'Slot created successfully', {
        slot
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get a slot by ID
 * @route GET /api/v1/slots/:id
 */
exports.getSlotById = async (req, res, next) => {
  try {
    const slot = await Slot.findById(req.params.id).populate('hubId', 'name code location');
    
    if (!slot) {
      return next(new ApiError('Slot not found', 404));
    }
    
    res.status(200).json(
      ApiResponse.success(200, 'Slot retrieved successfully', {
        slot
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update a slot
 * @route PUT /api/v1/slots/:id
 */
exports.updateSlot = async (req, res, next) => {
  try {
    const slot = await Slot.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!slot) {
      return next(new ApiError('Slot not found', 404));
    }
    
    logger.info(`Slot updated: ${slot._id}`);
    
    res.status(200).json(
      ApiResponse.success(200, 'Slot updated successfully', {
        slot
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a slot
 * @route DELETE /api/v1/slots/:id
 */
exports.deleteSlot = async (req, res, next) => {
  try {
    const slot = await Slot.findByIdAndDelete(req.params.id);
    
    if (!slot) {
      return next(new ApiError('Slot not found', 404));
    }
    
    logger.info(`Slot deleted: ${slot._id}`);
    
    res.status(200).json(
      ApiResponse.success(200, 'Slot deleted successfully', null)
    );
  } catch (error) {
    next(error);
  }
};
