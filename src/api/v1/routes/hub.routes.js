const express = require('express');
const router = express.Router();
const hubController = require('../controllers/hub.controller');
const { protect, restrictTo } = require('../middlewares/auth');

/**
 * @route   GET /api/v1/hubs
 * @desc    Get all hubs
 * @access  Private
 */
router.get('/', protect, hubController.getAllHubs);

/**
 * @route   POST /api/v1/hubs
 * @desc    Create a new hub
 * @access  Private/Admin
 */
router.post('/', protect, restrictTo('admin'), hubController.createHub);

/**
 * @route   GET /api/v1/hubs/:id
 * @desc    Get a hub by ID
 * @access  Private
 */
router.get('/:id', protect, hubController.getHubById);

/**
 * @route   PUT /api/v1/hubs/:id
 * @desc    Update a hub
 * @access  Private/Admin
 */
router.put('/:id', protect, restrictTo('admin'), hubController.updateHub);

/**
 * @route   DELETE /api/v1/hubs/:id
 * @desc    Delete a hub
 * @access  Private/Admin
 */
router.delete('/:id', protect, restrictTo('admin'), hubController.deleteHub);

module.exports = router;
