const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const logger = require('./utils/logger');
const errorHandler = require('./api/v1/middlewares/errorHandler');
const { notFound } = require('./api/v1/middlewares/notFound');

// Import routes
const healthcheckRoutes = require('./api/v1/routes/healthcheck.routes');
const authRoutes = require('./api/v1/routes/auth.routes');
const partnerRoutes = require('./api/v1/routes/partner.routes');
const appointmentRoutes = require('./api/v1/routes/appointment.routes');
const hubRoutes = require('./api/v1/routes/hub.routes');
const slotRoutes = require('./api/v1/routes/slot.routes');

// Initialize express app
const app = express();

// Apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } })); // HTTP request logging
app.use(limiter); // Apply rate limiting

// API Routes
app.use('/api/v1/healthcheck', healthcheckRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/partners', partnerRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/hubs', hubRoutes);
app.use('/api/v1/slots', slotRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Appointment Logistics API is running',
    version: '1.0.0',
    endpoints: {
      healthcheck: '/api/v1/healthcheck',
      auth: '/api/v1/auth',
      partners: '/api/v1/partners',
      appointments: '/api/v1/appointments',
      hubs: '/api/v1/hubs',
      slots: '/api/v1/slots'
    }
  });
});

// Handle 404 errors
app.use(notFound);

// Global error handler
app.use(errorHandler);

module.exports = app;
