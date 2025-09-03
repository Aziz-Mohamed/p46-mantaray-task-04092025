/**
 * Error handling utility functions
 * Following clean code principles with single responsibility
 */

/**
 * Extracts user-friendly error message from various error types
 * @param error - Error object or string
 * @returns User-friendly error message
 */
export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  
  return 'An unexpected error occurred';
};

/**
 * Handles API errors and returns user-friendly messages
 * @param error - API error object
 * @returns User-friendly error message
 */
export const handleApiError = (error: unknown): string => {
  const message = getErrorMessage(error);
  
  // Handle common API error patterns
  if (message.includes('Network Error') || message.includes('fetch')) {
    return 'Network error. Please check your internet connection.';
  }
  
  if (message.includes('401') || message.includes('Unauthorized')) {
    return 'Authentication failed. Please sign in again.';
  }
  
  if (message.includes('403') || message.includes('Forbidden')) {
    return 'You do not have permission to perform this action.';
  }
  
  if (message.includes('404') || message.includes('Not Found')) {
    return 'The requested resource was not found.';
  }
  
  if (message.includes('500') || message.includes('Internal Server Error')) {
    return 'Server error. Please try again later.';
  }
  
  return message;
};

/**
 * Logs error for debugging purposes
 * @param error - Error object
 * @param context - Additional context information
 */
export const logError = (error: unknown, context?: string): void => {
  const timestamp = new Date().toISOString();
  const contextInfo = context ? ` [${context}]` : '';
  
  console.error(`[${timestamp}]${contextInfo} Error:`, error);
  
  // In production, you might want to send this to a logging service
  // Example: sendToLoggingService({ error, context, timestamp });
};
