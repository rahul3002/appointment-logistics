const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

// Start the server
const server = app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
});

// Try to connect to MongoDB, but don't stop server if it fails
mongoose
  .connect(config.mongodb.uri, config.mongodb.options)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((err) => {
    logger.error('MongoDB connection error:', err);
    logger.warn('Server running without MongoDB connection. Some endpoints may not work.');
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});
