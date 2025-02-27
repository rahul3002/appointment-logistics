require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/appointment_logistics',
    options: {
    }
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your_default_jwt_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }
};
