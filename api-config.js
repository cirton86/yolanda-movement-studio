// ============================================
// API CONFIGURATION
// Manages API keys securely
// ============================================

const API_CONFIG = {
  // Get Gemini API key from localStorage
  // User will be prompted to enter their key on first visit
  get GEMINI_API_KEY() {
    // Check localStorage first
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
    return null;
  }
};

export default API_CONFIG;
