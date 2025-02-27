const Appointment = require('../models/appointment.model');
const ApiError = require('../../../utils/apiError');
const ApiResponse = require('../../../utils/apiResponse');
const logger = require('../../../utils/logger');

/**
 * Get all appointments
 * @route GET /api/v1/appointments
 */
exports.getAllAppointments = async (req, res, next) => {
  try {
    // Build query
    const query = {};
    
    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    // Filter by date range if provided
    if (req.query.startDate && req.query.endDate) {
      query.scheduledTime = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }
    
    // Filter by partner if provided
    if (req.query.partnerId) {
      query.partnerId = req.query.partnerId;
    }
    
    // Filter by hub if provided
    if (req.query.hubId) {
      query.hubId = req.query.hubId;
    }
    
    const appointments = await Appointment.find(query)
      .populate('partnerId', 'name email phone')
      .populate('hubId', 'name location')
      .populate('slotId', 'startTime endTime');
    
    res.status(200).json(
      ApiResponse.success(200, 'Appointments retrieved successfully', {
        count: appointments.length,
        appointments
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new appointment
 * @route POST /api/v1/appointments
 */
exports.createAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.create({
      ...req.body,
      userId: req.user._id
    });
    
    logger.info(`New appointment created: ${appointment._id}`);
    
    res.status(201).json(
      ApiResponse.success(201, 'Appointment created successfully', {
        appointment
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get an appointment by ID
 * @route GET /api/v1/appointments/:id
 */
exports.getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('partnerId', 'name email phone')
      .populate('hubId', 'name location')
      .populate('slotId', 'startTime endTime');
    
    if (!appointment) {
      return next(new ApiError('Appointment not found', 404));
    }
    
    res.status(200).json(
      ApiResponse.success(200, 'Appointment retrieved successfully', {
        appointment
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update an appointment
 * @route PUT /api/v1/appointments/:id
 */
exports.updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!appointment) {
      return next(new ApiError('Appointment not found', 404));
    }
    
    logger.info(`Appointment updated: ${appointment._id}`);
    
    res.status(200).json(
      ApiResponse.success(200, 'Appointment updated successfully', {
        appointment
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an appointment
 * @route DELETE /api/v1/appointments/:id
 */
exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    
    if (!appointment) {
      return next(new ApiError('Appointment not found', 404));
    }
    
    logger.info(`Appointment deleted: ${appointment._id}`);
    
    res.status(200).json(
      ApiResponse.success(200, 'Appointment deleted successfully', null)
    );
  } catch (error) {
    next(error);
  }
};
