// ============================================
// CONVERSATION SESSION MANAGER
// Handles conversation state, persistence, and analytics
// ============================================

import AI_CONFIG from './ai-config.js';

class ConversationSession {
  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.messages = [];
    this.startTime = Date.now();
    this.metadata = {
      pageContext: this.detectPageContext(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
    };
    
    this.load();
  }

  /**
   * Get or create unique session ID
   */
  getOrCreateSessionId() {
    let sessionId = localStorage.getItem('yolanda_ai_session_id');
    
    if (!sessionId || this.isSessionExpired()) {
      sessionId = this.generateSessionId();
      localStorage.setItem('yolanda_ai_session_id', sessionId);
      localStorage.setItem('yolanda_ai_session_start', Date.now().toString());
    }
    
    return sessionId;
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Check if current session is expired (24 hours)
   */
  isSessionExpired() {
    const startTime = localStorage.getItem('yolanda_ai_session_start');
    if (!startTime) return true;
    
    const elapsed = Date.now() - parseInt(startTime);
    return elapsed > AI_CONFIG.conversation.sessionDuration;
  }

  /**
   * Load conversation from localStorage
   */
  load() {
    if (this.isSessionExpired()) {
      this.clear();
      return;
    }

    try {
      const saved = localStorage.getItem('yolanda_ai_conversation');
      if (saved) {
        const data = JSON.parse(saved);
        this.messages = data.messages || [];
        this.startTime = data.startTime || Date.now();
        this.metadata = { ...this.metadata, ...data.metadata };
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      this.clear();
    }
  }

  /**
   * Save conversation to localStorage
   */
  save() {
    try {
      const data = {
        sessionId: this.sessionId,
        messages: this.messages,
        startTime: this.startTime,
        metadata: this.metadata,
        lastUpdated: Date.now(),
      };
      
      localStorage.setItem('yolanda_ai_conversation', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  }

  /**
   * Add message to conversation
   */
  addMessage(role, content) {
    const message = {
      role, // 'user' or 'ai'
      content,
      timestamp: Date.now(),
    };
    
    this.messages.push(message);
    this.save();
    
    // Track analytics
    this.trackMessage(message);
    
    return message;
  }

  /**
   * Get all messages
   */
  getMessages() {
    return this.messages;
  }

  /**
   * Get message count
   */
  getMessageCount() {
    return this.messages.length;
  }

  /**
   * Get conversation duration in seconds
   */
  getDuration() {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  /**
   * Determine current conversation phase
   */
  getConversationPhase() {
    const count = this.getMessageCount();
    if (count <= 3) return 1; // Listen & Understand
    if (count <= 8) return 2; // Educate & Support
    return 3; // Guide to Action
  }

  /**
   * Analyze conversation for patterns
   */
  analyzeConversation() {
    const userMessages = this.messages.filter(m => m.role === 'user');
    const allText = userMessages.map(m => m.content.toLowerCase()).join(' ');
    
    return {
      messageCount: this.getMessageCount(),
      userMessageCount: userMessages.length,
      duration: this.getDuration(),
      mentionedPain: /pain|hurt|injury|injured|sore/.test(allText),
      mentionedAge: /\b\d{2}\b|old|age|aging/.test(allText),
      askedAboutPrograms: /program|training|longevity|rebuild|performance/.test(allText),
      askedAboutPricing: /price|cost|how much|pricing|afford/.test(allText),
      expressedInterest: /interested|sounds good|i think|i need|want to/.test(allText),
      askedAboutBooking: /book|schedule|appointment|assessment|start|get started/.test(allText),
      leadScore: this.calculateLeadScore(allText, this.getMessageCount()),
      dropOffRisk: this.detectDropOff(),
    };
  }

  /**
   * Calculate Real-Time Lead Score (0-100)
   * Based on AI Employee Directive #15
   */
  calculateLeadScore(allText, messageCount) {
    let score = 0;
    
    // 1. Urgency (High impact)
    if (/tomorrow|asap|immediately|urgent|pain|hurts/.test(allText)) score += 25;
    
    // 2. Fit (Keywords match niche)
    if (/40\+|senior|older|injury|pt|physical therapy|marathon|hyrox/.test(allText)) score += 20;
    
    // 3. Readiness (Booking intent)
    if (/price|cost|schedule|book|start|where are you/.test(allText)) score += 30;
    
    // 4. Engagement (Depth)
    if (messageCount > 5) score += 15;
    if (messageCount > 10) score += 10;
    
    return Math.min(score, 100);
  }

  /**
   * Detect Drop-Off Risk
   * Based on AI Employee Directive #16
   */
  detectDropOff() {
    const lastMessageTime = this.messages.length > 0 
      ? this.messages[this.messages.length - 1].timestamp 
      : Date.now();
      
    const secondsSinceLastMessage = (Date.now() - lastMessageTime) / 1000;
    
    // Flag if user is silent for > 45 seconds during active chat
    if (this.messages.length > 0 && secondsSinceLastMessage > 45) {
      return true;
    }
    
    return false;
  }

  /**
   * Check if booking should be suggested
   */
  shouldSuggestBooking() {
    const analysis = this.analyzeConversation();
    
    // Must have minimum messages
    if (analysis.userMessageCount < AI_CONFIG.conversation.bookingSuggestionThreshold) {
      return false;
    }

    // High-intent signals
    if (analysis.askedAboutBooking || analysis.askedAboutPricing) {
      return true;
    }

    // Medium-intent signals (need multiple)
    const mediumSignals = [
      analysis.expressedInterest,
      analysis.askedAboutPrograms,
      analysis.userMessageCount >= 5,
    ].filter(Boolean).length;

    return mediumSignals >= 2;
  }

  /**
   * Detect current page context
   */
  detectPageContext() {
    const path = window.location.pathname;
    
    if (path.includes('about')) return 'about';
    if (path.includes('program') || path.includes('service')) return 'programs';
    if (path.includes('contact')) return 'contact';
    if (path === '/' || path.includes('index')) return 'home';
    
    return 'home';
  }

  /**
   * Clear conversation and start fresh
   */
  clear() {
    this.messages = [];
    this.startTime = Date.now();
    this.sessionId = this.generateSessionId();
    
    localStorage.removeItem('yolanda_ai_conversation');
    localStorage.setItem('yolanda_ai_session_id', this.sessionId);
    localStorage.setItem('yolanda_ai_session_start', this.startTime.toString());
    
    this.save();
  }

  /**
   * Track message analytics
   */
  trackMessage(message) {
    // Google Analytics 4 event tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'ai_message_sent', {
        message_role: message.role,
        message_count: this.getMessageCount(),
        session_id: this.sessionId,
        conversation_phase: this.getConversationPhase(),
        page_context: this.metadata.pageContext,
      });
    }
  }

  /**
   * Track widget opened
   */
  trackWidgetOpened() {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'ai_widget_opened', {
        page_path: window.location.pathname,
        session_id: this.sessionId,
        existing_conversation: this.getMessageCount() > 0,
      });
    }
  }

  /**
   * Track booking suggested
   */
  trackBookingSuggested() {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'ai_booking_suggested', {
        conversation_length: this.getMessageCount(),
        duration_seconds: this.getDuration(),
        session_id: this.sessionId,
      });
    }
  }

  /**
   * Track conversation completed
   */
  trackConversationCompleted(resultedInBooking = false) {
    if (typeof gtag !== 'undefined') {
      const analysis = this.analyzeConversation();
      
      gtag('event', 'ai_conversation_completed', {
        total_messages: this.getMessageCount(),
        user_messages: analysis.userMessageCount,
        duration_seconds: this.getDuration(),
        resulted_in_booking: resultedInBooking,
        mentioned_pain: analysis.mentionedPain,
        asked_about_programs: analysis.askedAboutPrograms,
        asked_about_pricing: analysis.askedAboutPricing,
        session_id: this.sessionId,
      });
    }
  }

  /**
   * Export conversation for admin review
   */
  export() {
    return {
      sessionId: this.sessionId,
      messages: this.messages,
      startTime: this.startTime,
      duration: this.getDuration(),
      metadata: this.metadata,
      analysis: this.analyzeConversation(),
    };
  }
}

export default ConversationSession;
