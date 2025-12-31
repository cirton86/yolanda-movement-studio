# Ask Yolanda AI - Setup Guide

## Quick Start

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure the AI Agent

**Option A: For Development/Testing**

When you first open the website, you'll be prompted to enter your API key. The key will be stored in your browser's localStorage for convenience.

**Option B: For Production**

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. Update `ai-agent.js` to read from environment variable instead of localStorage (requires build system)

### 3. Test the AI Agent

1. Open `index.html` in your browser
2. Look for the red chat button in the bottom-right corner
3. Click to open the chat
4. Try asking: "What programs do you offer?"

## Files Overview

### Core AI Files

- **`ai-config.js`** - Configuration, system prompts, knowledge base
- **`ai-engine.js`** - Gemini API integration and conversation logic
- **`ai-conversation.js`** - Session management and analytics
- **`ai-agent.js`** - Widget UI controller
- **`ai-widget.css`** - Widget styling

### Integration Files

- **`index.html`** - Homepage (AI widget included)
- **`about.html`** - About page (AI widget included)
- **`contact.html`** - Contact page (AI widget included)
- **`services.html`** - Services page (AI widget included)

## Features

### ✅ Implemented (Phase 1)

- [x] Google Gemini 2.0 Flash integration
- [x] Comprehensive knowledge base (programs, approach, logistics)
- [x] Yolanda's personality framework
- [x] 3-phase conversation strategy (Listen → Educate → Guide)
- [x] 24-hour session persistence
- [x] Conversation context and memory
- [x] Suggested quick-reply questions
- [x] Typing indicators
- [x] Mobile-responsive design
- [x] Basic analytics tracking (GA4 events)
- [x] Fallback error handling
- [x] Clear conversation option

### 🚧 Coming in Phase 2

- [ ] Proactive messaging (after 30s on page)
- [ ] Email capture for resource delivery
- [ ] Conversation handoff to Yolanda (high-value leads)
- [ ] A/B testing framework
- [ ] Admin dashboard for conversation review

### 🔮 Coming in Phase 3

- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Sentiment analysis
- [ ] Predictive lead scoring
- [ ] CRM integration

## Customization

### Updating the Knowledge Base

Edit `ai-config.js` and modify the `knowledgeBase` section:

```javascript
knowledgeBase: `
PROGRAMS OFFERED:

1. YOUR PROGRAM NAME
   - For: Target audience
   - Focus: Main benefits
   ...
`
```

### Changing the Personality

Edit `ai-config.js` and modify the `systemPrompt` section:

```javascript
systemPrompt: `You are "Ask Yolanda AI"...

CORE PERSONALITY TRAITS:
- Your trait here
- Another trait
...`
```

### Adjusting Conversation Flow

Edit `ai-config.js` and modify the `conversationStrategy` section to change when booking is suggested, how phases work, etc.

### Styling the Widget

Edit `ai-widget.css` to change colors, sizes, animations, etc.

**Key CSS Variables:**
- `--color-accent` - Brand red color
- `--spacing-*` - Spacing scale
- `--font-size-*` - Typography scale
- `--border-radius` - Corner rounding

## Analytics

### Google Analytics 4 Events

The AI agent tracks these events automatically:

- `ai_widget_opened` - User opens chat widget
- `ai_message_sent` - User or AI sends message
- `ai_booking_suggested` - AI suggests booking
- `ai_conversation_completed` - Conversation ends

### Viewing Analytics

1. Go to Google Analytics 4
2. Navigate to Events
3. Filter by events starting with `ai_`
4. View metrics: engagement rate, conversion rate, etc.

## Troubleshooting

### "I'm currently unable to connect to my AI service"

**Cause**: Missing or invalid API key

**Solution**:
1. Check that you entered your API key correctly
2. Verify the key is active in Google AI Studio
3. Clear localStorage and re-enter the key

### AI responses are slow or timing out

**Cause**: Network issues or API rate limits

**Solution**:
1. Check your internet connection
2. Verify you haven't exceeded free tier limits (15 RPM)
3. Consider upgrading to paid tier for higher limits

### Conversation not persisting

**Cause**: localStorage disabled or cleared

**Solution**:
1. Check browser settings allow localStorage
2. Don't use private/incognito mode
3. Check for browser extensions blocking storage

### Widget not appearing

**Cause**: JavaScript errors or missing files

**Solution**:
1. Open browser console (F12) and check for errors
2. Verify all files are present and paths are correct
3. Check that scripts are loaded in correct order

## API Costs

### Free Tier
- **Rate Limit**: 15 requests per minute
- **Cost**: $0
- **Best for**: Testing, low-traffic sites

### Paid Tier
- **Input**: $0.075 per 1M tokens
- **Output**: $0.30 per 1M tokens
- **Estimated**: $20-50/month for 500 conversations
- **Best for**: Production sites

## Security Best Practices

### Never Commit API Keys

Add `.env` to `.gitignore`:
```
.env
```

### Use Environment Variables in Production

Don't hardcode API keys in JavaScript files that are publicly accessible.

### Rotate Keys Regularly

Generate new API keys every 90 days and revoke old ones.

## Support

For issues or questions:

1. Check this documentation
2. Review the implementation plan (`implementation_plan.md`)
3. Check browser console for errors
4. Contact the development team

## Next Steps

After Phase 1 is working:

1. Monitor conversation quality for 1-2 weeks
2. Review analytics to identify common questions
3. Refine knowledge base based on real conversations
4. Plan Phase 2 features (proactive messaging, email capture)

---

**Version**: 1.0.0 (Phase 1)  
**Last Updated**: 2025-12-31  
**Status**: Ready for Testing
