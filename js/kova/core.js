import { KOVA_CONFIG } from './config.js';

export class KovaCore {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.history = [];
    this.leadScore = {
      urgency: 0,
      fit: 0,
      readiness: 0,
      total: 0
    };
    this.model = null;
    this.genAI = null;
    this.isInitialized = false;
  }

  /**
   * Initialize SDK and Model with Timeout Safety
   */
  async initialize() {
    if (this.isInitialized) return true;

    try {
      // Timeout Promise (10s safety)
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Kova Core Initialization Timed Out')), 10000)
      );

      const initLogic = async () => {
        const { GoogleGenerativeAI } = await import('https://esm.run/@google/generative-ai');
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        
        // ATTEMPT 1: Configured Model
        try {
            this.model = this.genAI.getGenerativeModel({ 
            model: KOVA_CONFIG.model.name,
            generationConfig: {
                temperature: KOVA_CONFIG.model.temperature,
                maxOutputTokens: KOVA_CONFIG.model.maxOutputTokens
            },
            systemInstruction: KOVA_CONFIG.systemPrompt 
            });
        } catch (e) {
            console.warn("Primary 2.0 model failed, retrying...", e);
            // ATTEMPT 2: Retry with same model (sometimes it's just a blip)
             this.model = this.genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash-exp",
            generationConfig: {
                temperature: KOVA_CONFIG.model.temperature,
                maxOutputTokens: KOVA_CONFIG.model.maxOutputTokens
            },
            systemInstruction: KOVA_CONFIG.systemPrompt 
            });
        }

        return true;
      };

      await Promise.race([initLogic(), timeout]);
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Kova Core Init Failed:', error);
      return false;
    }
  }

  /**
   * Calculate Real-Time Lead Score (Rule 15)
   */
  updateLeadScore(userMessage) {
    const lowerMsg = userMessage.toLowerCase();
    
    // Urgency Signals
    if (lowerMsg.match(/(pain|hurt|asap|now|tomorrow|suffering)/)) this.leadScore.urgency += 10;
    
    // Fit Signals
    if (lowerMsg.match(/(40|senior|aging|stiff|recovery|pt|therapy)/)) this.leadScore.fit += 10;
    
    // Readiness Signals
    if (lowerMsg.match(/(book|schedule|cost|price|where|location)/)) this.leadScore.readiness += 10;

    this.leadScore.total = this.leadScore.urgency + this.leadScore.fit + this.leadScore.readiness;
    
    console.log('[KOVA SCORING]', this.leadScore);
    return this.leadScore;
  }

  /**
   * Send Message to Gemini
   */
  async sendMessage(userMessage) {
    if (!this.model) throw new Error('AI Not Initialized');

    // 1. Update Score
    const currentScore = this.updateLeadScore(userMessage);

    // 2. Prepare Chat Context
    let chat = this.model.startChat({
      history: this.history
    });

    // 3. Inject Score Context (Hidden from user, seen by AI)
    let contextMessage = userMessage;
    if (currentScore.total > 20) {
      contextMessage += `\n[SYSTEM NOTE: LEAD SCORE ${currentScore.total} (High). URGENCY: ${currentScore.urgency}. FIT: ${currentScore.fit}. PRIME DIRECTIVE: PIVOT TO BOOKING NOW.]`;
    }

    try {
      const result = await chat.sendMessage(contextMessage);
      const response = result.response.text();
      
      // Update history manually to keep it clean (without system notes)
      this.history.push({ role: 'user', parts: [{ text: userMessage }] });
      this.history.push({ role: 'model', parts: [{ text: response }] });

      return {
        success: true,
        text: response,
        score: currentScore
      };
    } catch (error) {
      console.error('Kova Send Error:', error);
      // Fallback: If 429, say busy. Else show error.
      let msg = "I apologize, but I'm having trouble connecting to my knowledge base right now.";
      
      if (error.message && error.message.includes('429')) {
         msg = "I'm currently experiencing high traffic. Please try again in 30 seconds.";
      } else if (error.message) {
         msg += ` (Error: ${error.message})`; // Show error for debugging
      }
      
      return {
        success: false,
        text: msg, 
        error: error
      };
    }
  }

  getHistory() {
    return this.history;
  }
}
