const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partner.controller');
const { protect, restrictTo } = require('../middlewares/auth');

/**
 * @route   GET /api/v1/partners
 * @desc    Get all partners
 * @access  Private
 */
router.get('/', protect, partnerController.getAllPartners);

/**
 * @route   POST /api/v1/partners
 * @desc    Create a new partner
 * @access  Private/Admin
 */
router.post('/', protect, restrictTo('admin'), partnerController.createPartner);

/**
 * @route   GET /api/v1/partners/:id
 * @desc    Get a partner by ID
 * @access  Private
 */
router.get('/:id', protect, partnerController.getPartnerById);

/**
 * @route   PUT /api/v1/partners/:id
 * @desc    Update a partner
 * @access  Private/Admin
 */
router.put('/:id', protect, restrictTo('admin'), partnerController.updatePartner);

/**
 * @route   DELETE /api/v1/partners/:id
 * @desc    Delete a partner
 * @access  Private/Admin
 */
router.delete('/:id', protect, restrictTo('admin'), partnerController.deletePartner);

module.exports = router;
