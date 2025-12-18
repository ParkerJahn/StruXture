#!/bin/bash

# Image Optimization Script for StruXture Website
# This script converts images to WebP and compresses them

echo "🖼️  Starting image optimization..."

# Check if required tools are installed
if ! command -v cwebp &> /dev/null; then
    echo "❌ cwebp not found. Installing..."
    echo "Run: brew install webp"
    exit 1
fi

if ! command -v jpegoptim &> /dev/null; then
    echo "⚠️  jpegoptim not found. Installing..."
    echo "Run: brew install jpegoptim"
fi

# Navigate to public directory
cd "$(dirname "$0")/website/public" || exit

echo "📁 Working in: $(pwd)"

# Backup original images
echo "💾 Creating backup..."
mkdir -p originals_backup
cp -n *.jpg *.jpeg *.png originals_backup/ 2>/dev/null || true

# Convert JPG/JPEG to WebP
echo "🔄 Converting images to WebP..."
for file in *.jpg *.jpeg; do
    if [ -f "$file" ]; then
        filename="${file%.*}"
        echo "  Converting: $file → ${filename}.webp"
        cwebp -q 85 "$file" -o "${filename}.webp"
    fi
done

# Convert PNG to WebP
for file in *.png; do
    if [ -f "$file" ]; then
        filename="${file%.*}"
        echo "  Converting: $file → ${filename}.webp"
        cwebp -q 90 "$file" -o "${filename}.webp"
    fi
done

# Compress original JPEGs (keep as fallback)
if command -v jpegoptim &> /dev/null; then
    echo "🗜️  Compressing JPEG files..."
    jpegoptim --max=85 --strip-all *.jpg *.jpeg 2>/dev/null || true
fi

# Show file sizes
echo ""
echo "📊 File sizes after optimization:"
echo "================================"
ls -lh *.{jpg,jpeg,png,webp} 2>/dev/null | awk '{print $9, $5}'

echo ""
echo "✅ Optimization complete!"
echo ""
echo "📝 Next steps:"
echo "1. Update image references to use WebP with fallback"
echo "2. Test the website locally"
echo "3. Deploy: firebase deploy --only hosting"

