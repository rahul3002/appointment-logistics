const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['pickup', 'delivery'],
      required: [true, 'Appointment type is required']
    },
    status: {
      type: String,
      enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'failed'],
      default: 'scheduled'
    },
    scheduledTime: {
      type: Date,
      required: [true, 'Scheduled time is required']
    },
    completedTime: {
      type: Date
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
    customer: {
      name: String,
      phone: String,
      email: String
    },
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partner'
    },
    hubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hub'
    },
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Slot'
    },
    package: {
      size: {
        type: String,
        enum: ['small', 'medium', 'large', 'extra-large']
      },
      weight: Number, // in kg
      description: String,
      specialHandling: Boolean
    },
    priority: {
      type: Number,
      default: 0 // Higher number means higher priority
    },
    notes: String,
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
appointmentSchema.virtual('fullAddress').get(function() {
  return `${this.location.address.street}, ${this.location.address.city}, ${this.location.address.state} ${this.location.address.zipCode}, ${this.location.address.country}`;
});

// Index for queries
appointmentSchema.index({ scheduledTime: 1 });
appointmentSchema.index({ partnerId: 1 });
appointmentSchema.index({ hubId: 1 });
appointmentSchema.index({ status: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
