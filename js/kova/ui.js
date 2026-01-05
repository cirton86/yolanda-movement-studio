import { KOVA_CONFIG } from './config.js';
import { KovaCore } from './core.js';
import API_CONFIG from '../../api-config.js';

class KovaUI {
  constructor() {
    this.core = new KovaCore(API_CONFIG.GEMINI_API_KEY);
    this.isOpen = false;
    this.init();
  }

  async init() {
    this.renderWidget();
    this.attachListeners();
    this.setLoadingState(true); // Lock UI immediately
    
    // Initialize Core (Timeout protected)
    const success = await this.core.initialize();
    
    if (success) {
      this.setLoadingState(false);
      this.addOpeningMessage(); // RULE 18: Mandatory Opening
    } else {
      this.showErrorState();
    }
  }

  renderWidget() {
    const html = `
      <div id="kova-widget" class="kova-widget">
        <!-- LAUNCHER -->
        <button id="kova-launcher" class="kova-launcher">
          <div class="kova-avatar">YR</div>
          <span class="kova-label">Ask Yolanda</span>
        </button>

        <!-- CHAT WINDOW -->
        <div id="kova-window" class="kova-window">
          <!-- HEADER (RULE 17: VISIBLE IDENTITY) -->
          <div class="kova-header">
            <div class="kova-header-info">
              <h3 class="kova-title">${KOVA_CONFIG.identity.brandName}</h3>
              <p class="kova-role">${KOVA_CONFIG.identity.roleTitle}</p>
              <p class="kova-powered">${KOVA_CONFIG.identity.poweredBy}</p>
            </div>
            <button id="kova-close" class="kova-close">&times;</button>
          </div>

          <!-- MESSAGES -->
          <div id="kova-messages" class="kova-messages"></div>

          <!-- INPUT AREA -->
          <div class="kova-input-area">
             <textarea id="kova-input" placeholder="Initializing..." disabled></textarea>
             <button id="kova-send" disabled>
               <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
             </button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  }

  attachListeners() {
    document.getElementById('kova-launcher').addEventListener('click', () => this.toggle());
    document.getElementById('kova-close').addEventListener('click', () => this.toggle());
    
    const sendBtn = document.getElementById('kova-send');
    const input = document.getElementById('kova-input');

    const handleSend = () => {
      const text = input.value.trim();
      if (text) this.sendMessage(text);
    };

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;
    document.getElementById('kova-window').classList.toggle('active', this.isOpen);
    document.getElementById('kova-launcher').classList.toggle('hidden', this.isOpen);
  }

  // RULE 18: REQUIRED OPENING MESSAGE
  addOpeningMessage() {
    if (this.core.getHistory().length > 0) return; // Don't double add

    // Format the mandatory message
    this.addMessage({
      role: 'model',
      text: KOVA_CONFIG.openingMessage.body
    });
  }

  addMessage({ role, text }) {
    const container = document.getElementById('kova-messages');
    const div = document.createElement('div');
    div.className = `kova-message kova-${role}`;
    
    // Simple markdown parsing
    let formatted = text.replace(/\n/g, '<br>');
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\* (.*?)(<br>|$)/g, '<li>$1</li>'); // Lists
    
    div.innerHTML = formatted;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  async sendMessage(text) {
    const input = document.getElementById('kova-input');
    input.value = '';
    
    // User Message
    this.addMessage({ role: 'user', text });
    this.setLoadingState(true, "Kova AI is thinking...");

    // Get Response
    const result = await this.core.sendMessage(text);
    
    this.setLoadingState(false);
    
    if (result.success) {
      this.addMessage({ role: 'model', text: result.text });
    } else {
      this.addMessage({ role: 'model', text: result.text }); // Error message
    }
  }

  setLoadingState(isLoading, placeholder = "Ask me anything...") {
    const input = document.getElementById('kova-input');
    const btn = document.getElementById('kova-send');
    
    if (isLoading) {
      input.disabled = true;
      btn.disabled = true;
      if (input.placeholder !== "Kova AI is thinking...") {
          input.placeholder = "Initializing...";
      } else {
           input.placeholder = placeholder;
      }
    } else {
      input.disabled = false;
      btn.disabled = false;
      input.placeholder = placeholder;
      input.focus();
    }
  }

  showErrorState() {
     const input = document.getElementById('kova-input');
     input.placeholder = "Connection Failed. Please Refresh.";
     this.addMessage({ role: 'model', text: "CRITICAL: Unable to initialize Kova AI Core. Please refresh the page." });
  }
}

// Auto-init
new KovaUI();
