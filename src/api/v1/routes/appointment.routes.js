const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const { protect } = require('../middlewares/auth');

/**
 * @route   GET /api/v1/appointments
 * @desc    Get all appointments
 * @access  Private
 */
router.get('/', protect, appointmentController.getAllAppointments);

/**
 * @route   POST /api/v1/appointments
 * @desc    Create a new appointment
 * @access  Private
 */
router.post('/', protect, appointmentController.createAppointment);

/**
 * @route   GET /api/v1/appointments/:id
 * @desc    Get an appointment by ID
 * @access  Private
 */
router.get('/:id', protect, appointmentController.getAppointmentById);

/**
 * @route   PUT /api/v1/appointments/:id
 * @desc    Update an appointment
 * @access  Private
 */
router.put('/:id', protect, appointmentController.updateAppointment);

/**
 * @route   DELETE /api/v1/appointments/:id
 * @desc    Delete an appointment
 * @access  Private
 */
router.delete('/:id', protect, appointmentController.deleteAppointment);

module.exports = router;
