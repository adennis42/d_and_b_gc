#!/bin/bash
# Quick script to set up Vercel Blob Storage and get the token

echo "🚀 Setting up Vercel Blob Storage..."
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Navigate to admin-dashboard
cd admin-dashboard || exit 1

# Check if logged in
echo "📋 Checking Vercel login status..."
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel:"
    vercel login
fi

# Link project if not already linked
if [ ! -f ".vercel/project.json" ]; then
    echo "🔗 Linking to Vercel project..."
    vercel link
fi

# Create Blob Storage
echo ""
echo "📦 Creating Blob Storage..."
echo "   (This will show you the BLOB_READ_WRITE_TOKEN)"
echo ""
vercel blob create

echo ""
echo "✅ Copy the token shown above and add it to admin-dashboard/.env.local:"
echo "   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx"
echo ""
echo "Then run: npm run migrate-images"

