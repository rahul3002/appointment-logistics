require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb+srv://rahulbagal7171:8UQgwSQ5g6pYT84A@cluster0.ot6nw.mongodb.net/appointment_logistics',
    options: {
       useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase the timeout to 30 seconds
      socketTimeoutMS: 45000, // Increase the socket timeout to 45 seconds
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
