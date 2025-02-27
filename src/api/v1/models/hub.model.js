const mongoose = require('mongoose');

const hubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hub name is required'],
      trim: true
    },
    code: {
      type: String,
      required: [true, 'Hub code is required'],
      unique: true,
      uppercase: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['warehouse', 'distribution-center', 'pickup-point', 'delivery-station'],
      required: [true, 'Hub type is required']
    },
    location: {
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
      },
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    capacity: {
      maxPackages: {
        type: Number,
        required: [true, 'Maximum package capacity is required']
      },
      currentPackages: {
        type: Number,
        default: 0
      },
      maxVehicles: {
        type: Number,
        required: [true, 'Maximum vehicle capacity is required']
      }
    },
    operatingHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String }
    },
    contactInfo: {
      managerName: String,
      phone: String,
      email: String
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance'],
      default: 'active'
    },
    serviceArea: [{
      city: String,
      state: String,
      zipCode: String,
      radius: Number // in km
    }],
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for full address
hubSchema.virtual('fullAddress').get(function() {
  return `${this.location.address.street}, ${this.location.address.city}, ${this.location.address.state} ${this.location.address.zipCode}, ${this.location.address.country}`;
});

// Virtual for capacity utilization percentage
hubSchema.virtual('capacityUtilization').get(function() {
  return (this.capacity.currentPackages / this.capacity.maxPackages) * 100;
});

// Index for geospatial queries
hubSchema.index({ 'serviceArea.zipCode': 1 });

const Hub = mongoose.model('Hub', hubSchema);

module.exports = Hub;
