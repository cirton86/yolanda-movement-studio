// ============================================
// GEMINI AI ENGINE
// Core integration with Google Gemini API
// ============================================

import AI_CONFIG from './ai-config.js';

class GeminiAIEngine {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.model = null;
    this.chat = null;
    this.initialized = false;
  }

  /**
   * Initialize the Gemini AI model
   */
  async initialize() {
    if (this.initialized) return true;

    try {
      // Dynamically import Google Generative AI SDK
      const { GoogleGenerativeAI } = await import('https://esm.run/@google/generative-ai');
      
      const genAI = new GoogleGenerativeAI(this.apiKey);
      
      // Try primary model first
      try {
        this.model = genAI.getGenerativeModel({
          model: AI_CONFIG.model.name,
          generationConfig: {
            temperature: AI_CONFIG.model.temperature,
            topP: AI_CONFIG.model.topP,
            topK: AI_CONFIG.model.topK,
            maxOutputTokens: AI_CONFIG.model.maxOutputTokens,
          },
        });
      } catch (error) {
        console.warn(`Primary model ${AI_CONFIG.model.name} unavailable, using fallback`);
        // Fallback to Gemini 1.5 Pro
        this.model = genAI.getGenerativeModel({
          model: AI_CONFIG.model.fallback,
          generationConfig: {
            temperature: AI_CONFIG.model.temperature,
            topP: AI_CONFIG.model.topP,
            topK: AI_CONFIG.model.topK,
            maxOutputTokens: AI_CONFIG.model.maxOutputTokens,
          },
        });
      }

      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Gemini AI:', error);
      return false;
    }
  }

  /**
   * Start a new chat session with system prompt
   */
  startChat(conversationHistory = []) {
    if (!this.initialized || !this.model) {
      throw new Error('AI Engine not initialized');
    }

    // Build system instruction from config (must be Content object format)
    const systemInstruction = {
      parts: [{ text: this.buildSystemInstruction() }]
    };

    // Convert conversation history to Gemini format
    const history = conversationHistory.map(msg => ({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    this.chat = this.model.startChat({
      history,
      systemInstruction,
    });

    return this.chat;
  }

  /**
   * Build complete system instruction from config
   */
  buildSystemInstruction() {
    return `${AI_CONFIG.systemPrompt}

${AI_CONFIG.knowledgeBase}

${AI_CONFIG.conversationStrategy}`;
  }

  /**
   * Send a message and get AI response
   */
  async sendMessage(userMessage, pageContext = 'home', conversationPhase = 1) {
    if (!this.chat) {
      throw new Error('Chat session not started');
    }

    try {
      // Add context to the message
      const contextualMessage = this.addContext(userMessage, pageContext, conversationPhase);
      
      // Send message to Gemini
      const result = await this.chat.sendMessage(contextualMessage);
      const response = await result.response;
      const text = response.text();

      return {
        success: true,
        message: text,
        error: null,
      };
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      
      // Handle rate limiting
      if (error.message?.includes('429') || error.message?.includes('quota')) {
        return {
          success: false,
          message: null,
          error: 'rate_limit',
        };
      }

      // Handle other errors - try to get useful response from AI
      console.warn('Non-critical error, attempting to continue:', error);
      
      // If we got this far, the API responded but with an error - use fallback
      return {
        success: false,
        message: this.getFallbackResponse(userMessage),
        error: 'api_error',
      };
    }
  }

  /**
   * Add contextual information to user message
   */
  addContext(userMessage, pageContext, conversationPhase) {
    const context = AI_CONFIG.pageContext[pageContext] || AI_CONFIG.pageContext.home;
    
    let contextualMessage = userMessage;

    // Add page context only on first message
    if (conversationPhase === 1) {
      contextualMessage = `[User is on the ${pageContext} page]\n\n${userMessage}`;
    }

    return contextualMessage;
  }

  /**
   * Get suggested questions based on conversation state
   */
  getSuggestedQuestions(conversationState) {
    const { messageCount, mentionedPain, askedAboutPrograms } = conversationState;

    if (messageCount === 0) {
      return AI_CONFIG.suggestedQuestions.initial;
    }

    if (mentionedPain) {
      return AI_CONFIG.suggestedQuestions.afterPainMention;
    }

    if (askedAboutPrograms) {
      return AI_CONFIG.suggestedQuestions.afterProgramQuestion;
    }

    return [];
  }

  /**
   * Determine conversation phase based on message count and content
   */
  determineConversationPhase(messageCount, messages) {
    if (messageCount <= 3) return 1; // Listen & Understand
    if (messageCount <= 8) return 2; // Educate & Support
    return 3; // Guide to Action
  }

  /**
   * Check if booking should be suggested
   */
  shouldSuggestBooking(messages) {
    const messageCount = messages.length;
    
    // Must have minimum messages
    if (messageCount < AI_CONFIG.conversation.bookingSuggestionThreshold) {
      return false;
    }

    // Check for booking-related keywords in recent messages
    const recentMessages = messages.slice(-3);
    const bookingKeywords = [
      'price', 'cost', 'how much', 'pricing',
      'start', 'get started', 'next step', 'sign up',
      'schedule', 'book', 'appointment', 'assessment',
      'available', 'availability', 'when can',
      'interested', 'sounds good', 'i think i need',
    ];

    const hasBookingIntent = recentMessages.some(msg => 
      bookingKeywords.some(keyword => 
        msg.content.toLowerCase().includes(keyword)
      )
    );

    return hasBookingIntent;
  }

  /**
   * Generate fallback response when API is unavailable
   */
  getFallbackResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();

    // Check for common questions
    if (lowerMessage.includes('program')) {
      return `I'd love to tell you about Yolanda's programs, but I'm experiencing technical difficulties right now. 

The three main programs are:
1. **Longevity Strength** - For adults 40+ seeking sustainable strength
2. **Rebuild & Return** - For those transitioning from physical therapy
3. **Performance Prep** - For athletes training for specific events

For detailed information, please visit the contact page or email directly. I apologize for the inconvenience!`;
    }

    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return `I'm currently experiencing technical issues, but I can tell you that pricing varies by program and frequency. The best way to get accurate pricing is to book a free movement assessment where Yolanda can discuss your specific needs. You can schedule that on the contact page.`;
    }

    // Default fallback
    return `I apologize, but I'm experiencing technical difficulties right now and can't provide a detailed response. 

For immediate assistance, please:
- Visit the **Contact page** to schedule a free assessment
- Email Yolanda directly
- Explore the Programs section for detailed information

I should be back online shortly. Thank you for your patience!`;
  }
}

export default GeminiAIEngine;
