/**
 * Standard API response format
 */
class ApiResponse {
  /**
   * Create a standard API success response
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Success message
   * @param {*} data - Response data
   * @returns {Object} Formatted response object
   */
  static success(statusCode, message, data = null) {
    return {
      status: 'success',
      code: statusCode,
      message,
      data
    };
  }

  /**
   * Create a standard API error response
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {*} errors - Error details
   * @returns {Object} Formatted error response object
   */
  static error(statusCode, message, errors = null) {
    return {
      status: 'error',
      code: statusCode,
      message,
      errors
    };
  }
}

module.exports = ApiResponse;
