const fs = require('fs');
const path = require('path');

const galleryDataPath = path.join(__dirname, '..', 'src', 'lib', 'gallery-data.ts');
const reportPath = path.join(__dirname, '..', 'optimization-report.json');

// Read the optimization report
const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

// Create a map of old filename to new filename and dimensions
const fileMap = new Map();
report.files.forEach(file => {
  // Convert "kitchen-001-1.webp" back to original pattern
  // The original was "kitchen-001-1.jpg", now it's "kitchen-001-1.webp"
  const oldName = file.filename.replace('.webp', '.jpg');
  fileMap.set(oldName, {
    newName: file.filename,
    width: 1920,
    height: 1440,
  });
});

// Read gallery-data.ts
let content = fs.readFileSync(galleryDataPath, 'utf-8');

// Update all image URLs from .jpg to .webp and dimensions to 1920x1440
// Pattern: url: "/images/gallery/kitchens/kitchen-001-1.jpg"
// Replace with: url: "/images/gallery/kitchens/kitchen-001-1.webp"

// Also update width and height
let updated = 0;

// Replace .jpg/.jpeg extensions with .webp
content = content.replace(/url:\s*"\/images\/gallery\/([^"]+)\.(jpg|jpeg)"/gi, (match, pathPart) => {
  updated++;
  return `url: "/images/gallery/${pathPart}.webp"`;
});

// Update dimensions to 1920x1440
// Pattern: width: 1234, height: 5678
content = content.replace(/width:\s*\d+,\s*height:\s*\d+/g, (match) => {
  // Check if this is inside an images array (not videos)
  const context = content.substring(Math.max(0, content.indexOf(match) - 200), content.indexOf(match) + 200);
  if (context.includes('images:') || context.includes('url:')) {
    return 'width: 1920, height: 1440';
  }
  return match;
});

// Write back
fs.writeFileSync(galleryDataPath, content, 'utf-8');

console.log(`✅ Updated ${updated} image URLs to WebP format`);
console.log(`✅ Updated all image dimensions to 1920x1440`);
console.log(`\n📝 File updated: ${galleryDataPath}`);

