// ============================================
// API CONFIGURATION
// Manages API keys securely
// ============================================

const API_CONFIG = {
  // Get Gemini API key from localStorage
  // User will be prompted to enter their key on first visit
  get GEMINI_API_KEY() {
    // Check localStorage first
        // Default API key if none is stored
    const DEFAULT_API_KEY = 'AIzaSyDFU3tOheW2JebgoAadr5F1-TyXLXwvfyU';
    
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      return storedKey;
    }
    
    // If no key found, prompt user to enter it
    const apiKey = prompt(
      'Please enter your Gemini API key:\n\n' +
      'Get your free API key at:\n' +
      'https://makersuite.google.com/app/apikey\n\n' +
      'Your key will be stored securely in your browser.'
    );
    
    if (apiKey) {
      // Store the key for future use
      localStorage.setItem('gemini_api_key', apiKey.trim());
      return apiKey.trim();
    }
    
    // Return null if user cancels
    // Use default API key if user cancels
    return DEFAULT_API_KEY;  }
};

export default API_CONFIG;
