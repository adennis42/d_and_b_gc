const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const galleryDir = path.join(__dirname, '..', 'public', 'images', 'gallery');
const backupDir = path.join(__dirname, '..', 'public', 'images', 'gallery-backup');
const categories = ['kitchens', 'bathrooms', 'sunrooms', 'millwork'];

const TARGET_WIDTH = 1920;
const TARGET_HEIGHT = 1440;
const TARGET_ASPECT_RATIO = TARGET_WIDTH / TARGET_HEIGHT; // 4:3
const WEBP_QUALITY = 85;

let fixed = 0;
let skipped = 0;
let errors = 0;

/**
 * Fix orientation for a single image
 */
async function fixImageOrientation(backupPath, outputPath, category) {
  try {
    // Read metadata to check orientation
    const metadata = await sharp(backupPath).metadata();
    const { orientation, width: origWidth, height: origHeight } = metadata;
    
    // Calculate dimensions accounting for rotation
    let width = origWidth;
    let height = origHeight;
    
    // Orientation 6 and 8 swap dimensions (90/270 degree rotations)
    if (orientation && (orientation === 6 || orientation === 8)) {
      [width, height] = [height, width];
    }
    
    // Calculate resize dimensions
    let resizeWidth = TARGET_WIDTH;
    let resizeHeight = TARGET_HEIGHT;
    
    const imageAspectRatio = width / height;
    
    if (imageAspectRatio > TARGET_ASPECT_RATIO) {
      resizeHeight = TARGET_HEIGHT;
      resizeWidth = Math.round(TARGET_HEIGHT * imageAspectRatio);
    } else {
      resizeWidth = TARGET_WIDTH;
      resizeHeight = Math.round(TARGET_WIDTH / imageAspectRatio);
    }
    
    // Process with auto-rotation
    await sharp(backupPath)
      .rotate() // Auto-rotate based on EXIF orientation
      .resize(resizeWidth, resizeHeight, {
        fit: 'cover',
        position: 'center',
      })
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputPath);
    
    return { success: true, hadOrientation: !!orientation };
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    return { error: error.message };
  }
}

/**
 * Process category
 */
async function processCategory(category) {
  const backupCategoryDir = path.join(backupDir, category);
  const galleryCategoryDir = path.join(galleryDir, category);
  
  if (!fs.existsSync(backupCategoryDir)) {
    console.log(`\n⚠️  Backup directory for ${category} not found, skipping...`);
    return;
  }
  
  // Get all JPG files from backup
  const backupFiles = fs.readdirSync(backupCategoryDir)
    .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
    .map(file => ({
      backup: path.join(backupCategoryDir, file),
      output: path.join(galleryCategoryDir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp')),
      filename: file,
    }));
  
  if (backupFiles.length === 0) {
    console.log(`\n📁 ${category}: No backup images found`);
    return;
  }
  
  console.log(`\n📁 Processing ${category}: ${backupFiles.length} images`);
  
  for (const { backup, output, filename } of backupFiles) {
    const result = await fixImageOrientation(backup, output, category);
    
    if (result.error) {
      errors++;
    } else if (result.success) {
      fixed++;
      if (result.hadOrientation) {
        console.log(`  ✓ ${filename}: Fixed orientation`);
      } else {
        skipped++;
      }
    }
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🔄 Fixing image orientations...');
  console.log('Processing images from backup with EXIF orientation correction\n');
  
  // Process each category
  for (const category of categories) {
    await processCategory(category);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 ORIENTATION FIX REPORT');
  console.log('='.repeat(60));
  console.log(`Fixed: ${fixed}`);
  console.log(`Skipped (no orientation issue): ${skipped}`);
  console.log(`Errors: ${errors}`);
  console.log('\n✅ Orientation fix complete!');
}

main().catch(console.error);

