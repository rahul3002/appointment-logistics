const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Partner name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required']
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    serviceArea: [{
      city: String,
      state: String,
      zipCode: String
    }],
    serviceState: {
      type: String,
      enum: ['available', 'busy', 'offline', 'maintenance'],
      default: 'available'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    priority: {
      type: Number,
      default: 0 // Higher number means higher priority
    },
    vehicleType: {
      type: String,
      enum: ['bike', 'car', 'van', 'truck'],
      required: true
    },
    vehicleCapacity: {
      weight: Number, // in kg
      volume: Number  // in cubic meters
    },
    active: {
      type: Boolean,
      default: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for full address
partnerSchema.virtual('fullAddress').get(function() {
  return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipCode}, ${this.address.country}`;
});

// Index for geospatial queries
partnerSchema.index({ 'serviceArea.zipCode': 1 });

const Partner = mongoose.model('Partner', partnerSchema);

module.exports = Partner;
