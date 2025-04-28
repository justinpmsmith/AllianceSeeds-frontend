/**
 * Utility functions for handling API responses
 */

/**
 * Extracts data from API response if successful, otherwise returns null
 * @param {Object} response - API response object
 * @param {boolean} logErrors - Whether to log errors to console
 * @returns {any|null} - Response data if successful, null otherwise
 */
export const extractApiData = (response, logErrors = true) => {
    if (!response) {
      if (logErrors) console.error('API Error: No response received');
      return null;
    }
    
    if (!response.meta) {
      if (logErrors) console.error('API Error: Invalid response format', response);
      return null;
    }
    
    if (!response.meta.success) {
      if (logErrors) console.error(`API Error: ${response.meta.message || 'Unknown error'}`, response);
      return null;
    }
    
    return response.data;
  };
  
  /**
   * Processes an array of API responses and extracts data from successful responses
   * @param {Array} responses - Array of API response objects
   * @param {boolean} logErrors - Whether to log errors to console
   * @returns {Array} - Array of data from successful responses
   */
  export const processApiResponses = (responses, logErrors = true) => {
    if (!Array.isArray(responses)) {
      if (logErrors) console.error('API Error: Expected array of responses');
      return [];
    }
    
    return responses
      .map(response => extractApiData(response, logErrors))
      .filter(data => data !== null);
  };
  
  export default {
    extractApiData,
    processApiResponses
  };