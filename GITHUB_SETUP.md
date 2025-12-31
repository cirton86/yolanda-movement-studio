# 🚀 Quick GitHub Setup Guide

Follow these steps to get your Yolanda Movement Studio website on GitHub and accessible from any computer.

## Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon (top right) → **"New repository"**
3. Repository name: `yolanda-movement-studio`
4. Description: `Movement & Longevity Coach website with AI chat assistant`
5. **Public** (required for free GitHub Pages)
6. ✅ Check "Add a README file" (we'll replace it)
7. Click **"Create repository"**

## Step 2: Upload Files

### Option A: Upload via Web (Easiest)

1. In your new repository, click **"Add file"** → **"Upload files"**
2. Drag and drop ALL files from your project folder:
   ```
   /Users/alphonzocirton/.gemini/antigravity/scratch/yolanda-movement-studio/
   ```
3. **IMPORTANT**: Do NOT upload `api-config.js` (contains your API key!)
4. Commit message: `Initial commit - Yolanda Movement Studio`
5. Click **"Commit changes"**

### Option B: Use Git Command Line

```bash
cd /Users/alphonzocirton/.gemini/antigravity/scratch/yolanda-movement-studio

# Initialize git
git init

# Add all files (api-config.js is already in .gitignore)
git add .

# Commit
git commit -m "Initial commit - Yolanda Movement Studio"

# Add remote (replace 'yourusername' with your GitHub username)
git remote add origin https://github.com/yourusername/yolanda-movement-studio.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Scroll down to **Pages** (left sidebar)
4. Under "Source":
   - Branch: **main**
   - Folder: **/ (root)**
5. Click **Save**
6. Wait 1-2 minutes for deployment
7. Your site will be live at:
   ```
   https://yourusername.github.io/yolanda-movement-studio/
   ```

## Step 4: Configure API Key (Important!)

Since `api-config.js` is not in the repository (for security), you need to handle the API key differently:

### For GitHub Pages (Client-Side)

Create a new file `api-config.js` directly on GitHub:

1. In your repo, click **Add file** → **Create new file**
2. Name: `api-config.js`
3. Content:
   ```javascript
   // ============================================
   // API CONFIGURATION
   // Gemini API Key for Myo Fit AI Agent
   // ============================================
   
   export const API_KEY = 'AIzaSyAlJKraVkK8mVjNlQwx-mcqgkO8mjQi9e8';
   
   export const GA4_MEASUREMENT_ID = ''; // Add your GA4 ID here if you have one
   
   export default {
     GEMINI_API_KEY: API_KEY,
     GA4_MEASUREMENT_ID,
   };
   ```
4. Commit directly to main branch

⚠️ **Note**: This exposes your API key in the browser. For production, consider using a backend proxy or Netlify/Vercel with environment variables.

## Step 5: Test Your Live Site

1. Visit: `https://yourusername.github.io/yolanda-movement-studio/`
2. Click the red "Ask Yolanda AI" button
3. Test the chat agent
4. Verify all pages work

## Step 6: Edit from Any Computer

Now you can edit from anywhere:

### Method 1: GitHub Web Editor
1. Go to your repository
2. Press `.` (period key) to open VS Code in browser
3. Edit files
4. Commit changes

### Method 2: GitHub.dev
1. Go to: `https://github.dev/yourusername/yolanda-movement-studio`
2. Full VS Code experience in browser

### Method 3: Direct File Edit
1. Click any file in your repo
2. Click the pencil icon (Edit)
3. Make changes
4. Scroll down → Commit changes

### Method 4: Genspark Browser
1. Open Genspark browser
2. Go to your GitHub repo
3. Use any of the methods above

## 🎉 You're Done!

Your website is now:
- ✅ Live on the internet
- ✅ Editable from any computer
- ✅ Backed up on GitHub
- ✅ Version controlled
- ✅ Free to host

## 📝 Next Steps

1. **Custom Domain** (optional):
   - Settings → Pages → Custom domain
   - Add your domain (e.g., `yolandar-movement.com`)

2. **Enable HTTPS**:
   - Automatically enabled by GitHub Pages
   - Check "Enforce HTTPS" in Settings → Pages

3. **Monitor AI Usage**:
   - Check [Google AI Studio](https://aistudio.google.com/usage)
   - Monitor API costs and quota

## 🆘 Troubleshooting

**Site not loading?**
- Wait 2-3 minutes after enabling Pages
- Check Settings → Pages for deployment status
- Ensure branch is set to `main`

**AI not working?**
- Verify `api-config.js` exists in repo
- Check browser console for errors
- Confirm API key is valid in Google AI Studio

**Images not showing?**
- Ensure `images/` folder was uploaded
- Check file paths are relative (not absolute)

## 📞 Need Help?

- GitHub Pages Docs: https://pages.github.com
- GitHub Support: https://support.github.com

---

**Happy coding! 🚀**
