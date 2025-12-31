# Yolanda Movement Studio

A modern, luxury-minimalist website for Yolanda R., a Movement & Longevity Coach in Chicago, featuring an AI-powered chat assistant built with Google Gemini.

![Website Preview](images/yolanda-professional/bridge-pose-bw.jpg)

## 🌟 Features

- **Luxury Minimalist Design** - Clean, professional aesthetic with smooth animations
- **AI Chat Agent** - Gemini-powered conversational assistant ("Ask Yolanda AI")
- **Mobile Responsive** - Optimized for all devices
- **SEO Optimized** - Comprehensive meta tags and schema markup
- **Performance Focused** - Fast loading, optimized images

## 🚀 Live Demo

**GitHub Pages**: [https://cirton86.github.io/yolanda-movement-studio/](https://cirton86.github.io/yolanda-movement-studio/)

## 📋 Pages

- **Home** (`index.html`) - Hero, programs overview, testimonials
- **About** (`about.html`) - Yolanda's background and philosophy
- **Services** (`services.html`) - Detailed program information
- **Contact** (`contact.html`) - Booking and contact form

## 🤖 AI Chat Agent

The site features "Ask Yolanda AI", a conversational assistant powered by Google Gemini that:
- Answers questions about programs and training approach
- Provides personalized recommendations
- Guides visitors toward booking assessments
- Maintains Yolanda's authentic voice and personality

### AI Agent Files
- `ai-agent.js` - Main widget controller
- `ai-engine.js` - Gemini API integration
- `ai-config.js` - Knowledge base & personality
- `ai-conversation.js` - Session management
- `ai-widget.css` - Widget styling
- `api-config.js` - API key configuration (**NOT included in repo for security**)

## 🔧 Setup Instructions

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/cirton86/yolanda-movement-studio.git
   cd yolanda-movement-studio
   ```

2. **Create API configuration**
   ```bash
   cp .env.example api-config.js
   ```
   
3. **Add your Gemini API key**
   - Get a free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Edit `api-config.js` and add your key:
     ```javascript
     export const API_KEY = 'YOUR_API_KEY_HERE';
     ```

4. **Start local server**
   ```bash
   python3 -m http.server 8000
   ```
   
5. **Open in browser**
   ```
   http://localhost:8000
   ```

### Deploy to GitHub Pages

1. **Push to GitHub** (already done if you cloned)

2. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from branch → `main`
   - Save

3. **Add API Key as GitHub Secret** (for production)
   - Go to Settings → Secrets and variables → Actions
   - New repository secret: `GEMINI_API_KEY`
   - Paste your API key

4. **Your site will be live at:**
   ```
   https://yourusername.github.io/yolanda-movement-studio/
   ```

## 📁 Project Structure

```
yolanda-movement-studio/
├── index.html              # Homepage
├── about.html              # About page
├── services.html           # Services page
├── contact.html            # Contact page
├── index.css               # Main stylesheet
├── script.js               # Main JavaScript
├── site.js                 # Site utilities
├── ai-agent.js             # AI widget controller
├── ai-engine.js            # Gemini integration
├── ai-config.js            # AI knowledge base
├── ai-conversation.js      # Session management
├── ai-widget.css           # AI widget styles
├── api-config.js           # API keys (gitignored)
├── .gitignore              # Git ignore rules
├── README.md               # This file
├── AI_SETUP_GUIDE.md       # AI agent documentation
└── images/                 # Image assets
    ├── yolanda-professional/
    ├── icons/
    └── videos/
```

## 🎨 Design System

- **Colors**: Deep blacks (#0A0A0A), warm grays, accent red (#F73718)
- **Typography**: Cormorant Garamond (headings), Inter (body)
- **Animations**: Smooth, subtle, performance-optimized
- **Layout**: CSS Grid, Flexbox, mobile-first

## 🔐 Security Notes

- **Never commit `api-config.js`** - Contains sensitive API keys
- **Use environment variables** for production deployments
- **Rotate API keys** regularly (every 90 days recommended)
- **Monitor API usage** in Google AI Studio

## 📊 Analytics

The AI agent tracks these events in Google Analytics 4:
- `ai_widget_opened` - User opens chat
- `ai_message_sent` - Message sent/received
- `ai_booking_suggested` - Booking recommended
- `ai_conversation_completed` - Conversation ends

## 🛠️ Technologies

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6 modules)
- **AI**: Google Gemini 1.5 Flash
- **Hosting**: GitHub Pages (static)
- **Analytics**: Google Analytics 4

## 📖 Documentation

- [AI Setup Guide](AI_SETUP_GUIDE.md) - Complete AI agent documentation
- [Implementation Plan](implementation_plan.md) - Development roadmap
- [Walkthrough](walkthrough.md) - Phase 1 completion summary

## 🤝 Contributing

This is a personal project for Yolanda R. Movement & Longevity Training. For inquiries, contact:
- **Email**: myofitpt@gmail.com
- **Instagram**: [@myofit_pt](https://www.instagram.com/myofit_pt/)

## 📄 License

© 2025 Yolanda R. Movement & Longevity Training. All rights reserved.

---

**Built with ❤️ for sustainable movement and longevity**
