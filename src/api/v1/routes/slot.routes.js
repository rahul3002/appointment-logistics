const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slot.controller');
const { protect, restrictTo } = require('../middlewares/auth');

/**
 * @route   GET /api/v1/slots
 * @desc    Get all slots
 * @access  Private
 */
router.get('/', protect, slotController.getAllSlots);

/**
 * @route   POST /api/v1/slots
 * @desc    Create a new slot
 * @access  Private/Admin
 */
router.post('/', protect, restrictTo('admin', 'operations'), slotController.createSlot);

/**
 * @route   GET /api/v1/slots/:id
 * @desc    Get a slot by ID
 * @access  Private
 */
router.get('/:id', protect, slotController.getSlotById);

/**
 * @route   PUT /api/v1/slots/:id
 * @desc    Update a slot
 * @access  Private/Admin
 */
router.put('/:id', protect, restrictTo('admin', 'operations'), slotController.updateSlot);

/**
 * @route   DELETE /api/v1/slots/:id
 * @desc    Delete a slot
 * @access  Private/Admin
 */
router.delete('/:id', protect, restrictTo('admin', 'operations'), slotController.deleteSlot);

module.exports = router;
