const Partner = require('../models/partner.model');
const ApiError = require('../../../utils/apiError');
const ApiResponse = require('../../../utils/apiResponse');
const logger = require('../../../utils/logger');

/**
 * Get all partners
 * @route GET /api/v1/partners
 */
exports.getAllPartners = async (req, res, next) => {
  try {
    const partners = await Partner.find();
    
    res.status(200).json(
      ApiResponse.success(200, 'Partners retrieved successfully', {
        count: partners.length,
        partners
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new partner
 * @route POST /api/v1/partners
 */
exports.createPartner = async (req, res, next) => {
  try {
    const partner = await Partner.create({
      ...req.body,
      userId: req.user._id
    });
    
    logger.info(`New partner created: ${partner.name}`);
    
    res.status(201).json(
      ApiResponse.success(201, 'Partner created successfully', {
        partner
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get a partner by ID
 * @route GET /api/v1/partners/:id
 */
exports.getPartnerById = async (req, res, next) => {
  try {
    const partner = await Partner.findById(req.params.id);
    
    if (!partner) {
      return next(new ApiError('Partner not found', 404));
    }
    
    res.status(200).json(
      ApiResponse.success(200, 'Partner retrieved successfully', {
        partner
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update a partner
 * @route PUT /api/v1/partners/:id
 */
exports.updatePartner = async (req, res, next) => {
  try {
    const partner = await Partner.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!partner) {
      return next(new ApiError('Partner not found', 404));
    }
    
    logger.info(`Partner updated: ${partner.name}`);
    
    res.status(200).json(
      ApiResponse.success(200, 'Partner updated successfully', {
        partner
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a partner
 * @route DELETE /api/v1/partners/:id
 */
exports.deletePartner = async (req, res, next) => {
  try {
    const partner = await Partner.findByIdAndDelete(req.params.id);
    
    if (!partner) {
      return next(new ApiError('Partner not found', 404));
    }
    
    logger.info(`Partner deleted: ${partner.name}`);
    
    res.status(200).json(
      ApiResponse.success(200, 'Partner deleted successfully', null)
    );
  } catch (error) {
    next(error);
  }
};
