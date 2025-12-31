// ============================================
// "ASK YOLANDA" AI AGENT - GEMINI POWERED
// Main widget controller and UI
// ============================================

import GeminiAIEngine from './ai-engine.js';
import ConversationSession from './ai-conversation.js';
import AI_CONFIG from './ai-config.js';
import API_CONFIG from './api-config.js';

class YolandaAI {
  constructor() {
    this.isOpen = false;
    this.isTyping = false;
    this.engine = null;
    this.session = null;
    this.apiKey = API_CONFIG.GEMINI_API_KEY;
    
    this.init();
  }

  /**
   * Initialize the AI widget
   */
  async init() {
    if (document.getElementById('ai-widget')) return;
    
    // Create widget UI
    this.createWidget();
    this.attachEventListeners();
    
    // Initialize conversation session
    this.session = new ConversationSession();
    
    // Initialize AI engine
    if (this.apiKey) {
      this.engine = new GeminiAIEngine(this.apiKey);
      const initialized = await this.engine.initialize();
      
      if (initialized) {
        // Start chat with existing conversation history
        this.engine.startChat(this.session.getMessages());
        
        // Add welcome message if new conversation
        if (this.session.getMessageCount() === 0) {
          this.addWelcomeMessage();
        } else {
          // Restore previous conversation
          this.restoreConversation();
        }
      } else {
        this.showAPIError();
      }
    } else {
      this.showAPIError();
    }
    
    // Show proactive message after delay
    this.scheduleProactiveMessage();
  }

  /**
   * Create widget HTML
   */
  createWidget() {
    const widgetHTML = `
      <div class="ai-widget" id="ai-widget">
        <div class="ai-widget-label">Ask Yolanda AI</div>
        <button class="ai-launcher" id="ai-launcher" aria-label="Open Ask Yolanda AI chat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
        
        <div class="ai-chat-window" id="ai-chat-window">
          <div class="ai-chat-header">
            <div>
              <h3 class="ai-chat-title">Ask Yolanda AI</h3>
              <p class="ai-chat-subtitle">Your movement & longevity guide</p>
            </div>
            <div class="ai-chat-header-actions">
              <button class="ai-chat-clear" id="ai-chat-clear" aria-label="Clear conversation" title="Clear conversation">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
              <button class="ai-chat-close" id="ai-chat-close" aria-label="Close chat">×</button>
            </div>
          </div>
          
          <div class="ai-chat-messages" id="ai-chat-messages"></div>
          
          <div class="ai-suggested-questions" id="ai-suggested-questions"></div>
          
          <div class="ai-chat-input-container">
            <textarea 
              class="ai-chat-input" 
              id="ai-chat-input" 
              placeholder="Ask me anything about movement, programs, or getting started..."
              rows="1"
              maxlength="500"
            ></textarea>
            <button class="ai-chat-send" id="ai-chat-send" aria-label="Send message">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', widgetHTML);
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    const launcher = document.getElementById('ai-launcher');
    const closeBtn = document.getElementById('ai-chat-close');
    const clearBtn = document.getElementById('ai-chat-clear');
    const sendBtn = document.getElementById('ai-chat-send');
    const input = document.getElementById('ai-chat-input');

    launcher?.addEventListener('click', () => this.toggleChat());
    closeBtn?.addEventListener('click', () => this.toggleChat());
    clearBtn?.addEventListener('click', () => this.clearConversation());
    sendBtn?.addEventListener('click', () => this.sendMessage());
    
    input?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Auto-resize textarea
    input?.addEventListener('input', (e) => {
      e.target.style.height = 'auto';
      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
    });
  }

  /**
   * Toggle chat window open/closed
   */
  toggleChat() {
    this.isOpen = !this.isOpen;
    const chatWindow = document.getElementById('ai-chat-window');
    const launcher = document.getElementById('ai-launcher');
    
    chatWindow?.classList.toggle('active');
    launcher?.classList.toggle('hidden');
    
    if (this.isOpen) {
      document.getElementById('ai-chat-input')?.focus();
      this.session?.trackWidgetOpened();
      this.updateSuggestedQuestions();
    }
  }

  /**
   * Add welcome message
   */
  addWelcomeMessage() {
    const pageContext = this.session.metadata.pageContext;
    const greeting = AI_CONFIG.pageContext[pageContext] || AI_CONFIG.pageContext.home;
    
    const welcomeText = `Hi! I'm Ask Yolanda AI, here to help you understand my approach to movement and longevity training. ${greeting}`;
    
    this.addMessage(welcomeText, 'ai');
    this.session.addMessage('ai', welcomeText);
  }

  /**
   * Restore previous conversation
   */
  restoreConversation() {
    const messages = this.session.getMessages();
    messages.forEach(msg => {
      this.addMessage(msg.content, msg.role, false); // Don't save again
    });
    this.updateSuggestedQuestions();
  }

  /**
   * Add message to UI
   */
  addMessage(text, sender = 'ai', shouldSave = true) {
    const messagesContainer = document.getElementById('ai-chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'ai' ? 'ai-message' : 'user-message';
    
    // Format text with line breaks
    messageDiv.innerHTML = this.formatMessage(text);
    
    messagesContainer?.appendChild(messageDiv);
    messagesContainer?.scrollTo({ top: messagesContainer.scrollHeight, behavior: 'smooth' });
  }

  /**
   * Format message text (preserve line breaks, format links)
   */
  formatMessage(text) {
    return text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>'); // Italic
  }

  /**
   * Show typing indicator
   */
  showTypingIndicator() {
    const messagesContainer = document.getElementById('ai-chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-message ai-typing';
    typingDiv.id = 'ai-typing-indicator';
    typingDiv.innerHTML = `
      <div class="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    
    messagesContainer?.appendChild(typingDiv);
    messagesContainer?.scrollTo({ top: messagesContainer.scrollHeight, behavior: 'smooth' });
    
    this.isTyping = true;
  }

  /**
   * Hide typing indicator
   */
  hideTypingIndicator() {
    const typingIndicator = document.getElementById('ai-typing-indicator');
    typingIndicator?.remove();
    this.isTyping = false;
  }

  /**
   * Send user message
   */
  async sendMessage() {
    const input = document.getElementById('ai-chat-input');
    const message = input?.value.trim();
    
    if (!message || this.isTyping) return;
    
    // Add user message to UI and session
    this.addMessage(message, 'user');
    this.session.addMessage('user', message);
    
    // Clear input
    input.value = '';
    input.style.height = 'auto';
    
    // Hide suggested questions
    this.hideSuggestedQuestions();
    
    // Show typing indicator
    this.showTypingIndicator();
    
    // Get AI response
    await this.getAIResponse(message);
  }

  /**
   * Get AI response from Gemini
   */
  async getAIResponse(userMessage) {
    try {
      const pageContext = this.session.metadata.pageContext;
      const conversationPhase = this.session.getConversationPhase();
      
      const result = await this.engine.sendMessage(userMessage, pageContext, conversationPhase);
      
      // Simulate typing delay for more natural feel
      await this.delay(AI_CONFIG.conversation.typingDelay);
      
      this.hideTypingIndicator();
      
      if (result.success) {
        // Add AI response
        this.addMessage(result.message, 'ai');
        this.session.addMessage('ai', result.message);
        
        // Update suggested questions
        this.updateSuggestedQuestions();
      } else {
        // Handle errors
        this.handleAIError(result.error);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      this.hideTypingIndicator();
      this.handleAIError('api_error');
    }
  }

  /**
   * Handle AI errors
   */
  handleAIError(errorType) {
    let errorMessage;
    
    if (errorType === 'rate_limit') {
      errorMessage = `I apologize, but I'm receiving a lot of questions right now. Please wait a moment and try again, or visit the contact page to reach out directly.`;
    } else {
      errorMessage = this.engine.getFallbackResponse('');
    }
    
    this.addMessage(errorMessage, 'ai');
    this.session.addMessage('ai', errorMessage);
  }

  /**
   * Update suggested questions based on conversation state
   */
  updateSuggestedQuestions() {
    const container = document.getElementById('ai-suggested-questions');
    if (!container) return;
    
    const analysis = this.session.analyzeConversation();
    let questions = [];
    
    if (analysis.messageCount === 0) {
      questions = AI_CONFIG.suggestedQuestions.initial;
    } else if (analysis.mentionedPain) {
      questions = AI_CONFIG.suggestedQuestions.afterPainMention;
    } else if (analysis.askedAboutPrograms) {
      questions = AI_CONFIG.suggestedQuestions.afterProgramQuestion;
    }
    
    // Clear existing questions
    container.innerHTML = '';
    
    // Add new questions
    if (questions.length > 0) {
      questions.forEach(question => {
        const button = document.createElement('button');
        button.className = 'suggested-question';
        button.textContent = question;
        button.addEventListener('click', () => this.sendSuggestedQuestion(question));
        container.appendChild(button);
      });
      
      container.style.display = 'flex';
    } else {
      container.style.display = 'none';
    }
  }

  /**
   * Hide suggested questions
   */
  hideSuggestedQuestions() {
    const container = document.getElementById('ai-suggested-questions');
    if (container) {
      container.style.display = 'none';
    }
  }

  /**
   * Send suggested question
   */
  sendSuggestedQuestion(question) {
    const input = document.getElementById('ai-chat-input');
    if (input) {
      input.value = question;
      this.sendMessage();
    }
  }

  /**
   * Clear conversation
   */
  clearConversation() {
    if (confirm('Are you sure you want to clear this conversation? This cannot be undone.')) {
      this.session.clear();
      
      // Clear UI
      const messagesContainer = document.getElementById('ai-chat-messages');
      if (messagesContainer) {
        messagesContainer.innerHTML = '';
      }
      
      // Restart chat
      this.engine.startChat([]);
      this.addWelcomeMessage();
      this.updateSuggestedQuestions();
    }
  }

  /**
   * Show API error message
   */
  showAPIError() {
    const errorMessage = `I apologize, but I'm currently unable to connect to my AI service. This might be due to a missing API key or network issue.

For immediate assistance, please:
- Visit the **Contact page** to schedule a free assessment
- Explore the **Programs section** for detailed information

I should be back online shortly. Thank you for your patience!`;
    
    this.addMessage(errorMessage, 'ai');
  }

  /**
   * Schedule proactive message
   */
  scheduleProactiveMessage() {
    // Show subtle pulse after 5 seconds if widget not opened
    setTimeout(() => {
      if (!this.isOpen) {
        const launcher = document.getElementById('ai-launcher');
        launcher?.classList.add('pulse');
      }
    }, 5000);
    
    // Show badge after 30 seconds
    setTimeout(() => {
      if (!this.isOpen && this.session.getMessageCount() === 0) {
        this.showProactiveBadge();
      }
    }, 30000);
  }

  /**
   * Show proactive message badge
   */
  showProactiveBadge() {
    const widget = document.getElementById('ai-widget');
    if (!widget || widget.querySelector('.ai-proactive-badge')) return;
    
    const badge = document.createElement('div');
    badge.className = 'ai-proactive-badge';
    badge.textContent = 'Have questions? I\'m here to help!';
    badge.addEventListener('click', () => {
      this.toggleChat();
      badge.remove();
    });
    
    widget.appendChild(badge);
    
    // Auto-hide after 10 seconds
    setTimeout(() => badge.remove(), 10000);
  }

  /**
   * Utility: delay function
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Initialize AI widget when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new YolandaAI();
  });
} else {
  new YolandaAI();
}

export default YolandaAI;
