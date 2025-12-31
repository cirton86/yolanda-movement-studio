#!/bin/bash

# ============================================
# GitHub Push Script
# Run this after creating your GitHub repository
# ============================================

echo "🚀 Pushing Yolanda Movement Studio to GitHub..."
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Git not initialized. Run 'git init' first."
    exit 1
fi

# Prompt for GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME

# Set remote origin
echo "📡 Adding remote origin..."
git remote add origin https://github.com/$GITHUB_USERNAME/yolanda-movement-studio.git

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Success! Your repository is now on GitHub"
echo "🌐 View it at: https://github.com/$GITHUB_USERNAME/yolanda-movement-studio"
echo ""
echo "📋 Next steps:"
echo "1. Go to Settings → Pages"
echo "2. Set Source to 'main' branch"
echo "3. Save and wait 2 minutes"
echo "4. Your site will be live at: https://$GITHUB_USERNAME.github.io/yolanda-movement-studio/"
echo ""
