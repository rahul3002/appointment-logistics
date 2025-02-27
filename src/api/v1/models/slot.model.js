const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    hubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hub',
      required: [true, 'Hub ID is required']
    },
    date: {
      type: Date,
      required: [true, 'Slot date is required']
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required']
    },
    endTime: {
      type: Date,
      required: [true, 'End time is required']
    },
    type: {
      type: String,
      enum: ['pickup', 'delivery', 'both'],
      required: [true, 'Slot type is required']
    },
    capacity: {
      type: Number,
      required: [true, 'Slot capacity is required'],
      min: [1, 'Capacity must be at least 1']
    },
    booked: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['available', 'limited', 'full', 'closed'],
      default: 'available'
    },
    price: {
      type: Number,
      default: 0
    },
    priority: {
      type: Number,
      default: 0 // Higher number means higher priority
    },
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

// Virtual for remaining capacity
slotSchema.virtual('remainingCapacity').get(function() {
  return this.capacity - this.booked;
});

// Virtual for utilization percentage
slotSchema.virtual('utilizationPercentage').get(function() {
  return (this.booked / this.capacity) * 100;
});

// Pre-save middleware to update status based on bookings
slotSchema.pre('save', function(next) {
  if (this.booked >= this.capacity) {
    this.status = 'full';
  } else if (this.booked >= this.capacity * 0.8) {
    this.status = 'limited';
  } else {
    this.status = 'available';
  }
  next();
});

// Index for queries
slotSchema.index({ hubId: 1, date: 1 });
slotSchema.index({ startTime: 1 });
slotSchema.index({ status: 1 });

const Slot = mongoose.model('Slot', slotSchema);

module.exports = Slot;
