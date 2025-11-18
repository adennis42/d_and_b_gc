const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const galleryDir = path.join(__dirname, '..', 'public', 'images', 'gallery');
const backupDir = path.join(__dirname, '..', 'public', 'images', 'gallery-backup');
const categories = ['kitchens', 'bathrooms', 'sunrooms', 'millwork'];

// Target dimensions
const TARGET_WIDTH = 1920;
const TARGET_HEIGHT = 1440;
const TARGET_ASPECT_RATIO = TARGET_WIDTH / TARGET_HEIGHT; // 4:3
const WEBP_QUALITY = 85;
const MAX_FILE_SIZE_KB = 500;

// Statistics
const stats = {
  total: 0,
  processed: 0,
  skipped: 0,
  errors: 0,
  totalOriginalSize: 0,
  totalOptimizedSize: 0,
  files: [],
};

/**
 * Create backup of original image
 */
function backupImage(originalPath, category) {
  const backupCategoryDir = path.join(backupDir, category);
  if (!fs.existsSync(backupCategoryDir)) {
    fs.mkdirSync(backupCategoryDir, { recursive: true });
  }
  
  const filename = path.basename(originalPath);
  const backupPath = path.join(backupCategoryDir, filename);
  
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(originalPath, backupPath);
  }
}

/**
 * Optimize a single image
 */
async function optimizeImage(imagePath, category) {
  const filename = path.basename(imagePath);
  const ext = path.extname(imagePath).toLowerCase();
  
  // Skip if not an image file
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    return { skipped: true, reason: 'Not an image file' };
  }

  try {
    // Get original file size
    const originalStats = fs.statSync(imagePath);
    const originalSizeKB = originalStats.size / 1024;
    
    // Read image metadata (before auto-rotate to get original dimensions)
    const metadata = await sharp(imagePath).metadata();
    let { width, height, orientation } = metadata;
    
    // Create backup
    backupImage(imagePath, category);
    
    // Calculate resize dimensions based on actual image dimensions
    // Note: After auto-rotate, dimensions may swap if image was rotated 90/270 degrees
    let resizeWidth = TARGET_WIDTH;
    let resizeHeight = TARGET_HEIGHT;
    
    // Check if image needs rotation (orientation 5, 6, 7, 8 need rotation)
    // Orientation 6 and 8 swap width/height
    const needsDimensionSwap = orientation && (orientation === 6 || orientation === 8);
    if (needsDimensionSwap) {
      // Swap dimensions for rotated images
      [width, height] = [height, width];
    }
    
    // Maintain aspect ratio, then crop to 4:3
    const imageAspectRatio = width / height;
    
    if (imageAspectRatio > TARGET_ASPECT_RATIO) {
      // Image is wider than 4:3, fit to height then crop width
      resizeHeight = TARGET_HEIGHT;
      resizeWidth = Math.round(TARGET_HEIGHT * imageAspectRatio);
    } else {
      // Image is taller than 4:3, fit to width then crop height
      resizeWidth = TARGET_WIDTH;
      resizeHeight = Math.round(TARGET_WIDTH / imageAspectRatio);
    }
    
    // Create WebP output path (replace extension)
    const webpPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    
    // Process image with auto-rotation based on EXIF orientation
    await sharp(imagePath)
      .rotate() // Auto-rotate based on EXIF orientation (removes orientation tag)
      .resize(resizeWidth, resizeHeight, {
        fit: 'cover',
        position: 'center',
      })
      .webp({ quality: WEBP_QUALITY })
      .toFile(webpPath);
    
    // Get optimized file size
    const optimizedStats = fs.statSync(webpPath);
    const optimizedSizeKB = optimizedStats.size / 1024;
    
    // Check if file size is acceptable
    if (optimizedSizeKB > MAX_FILE_SIZE_KB) {
      console.warn(`  ⚠️  ${filename}: ${optimizedSizeKB.toFixed(1)}KB (exceeds ${MAX_FILE_SIZE_KB}KB target)`);
    }
    
    // Remove original JPG/PNG file (keep WebP)
    fs.unlinkSync(imagePath);
    
    // Rename WebP back to original filename (but with .webp extension)
    // Actually, let's keep .webp extension - Next.js handles it
    // But we need to update gallery-data.ts to use .webp
    
    const reduction = ((originalSizeKB - optimizedSizeKB) / originalSizeKB * 100).toFixed(1);
    
    return {
      success: true,
      originalSize: originalSizeKB,
      optimizedSize: optimizedSizeKB,
      reduction: parseFloat(reduction),
      originalDimensions: `${width}x${height}`,
      optimizedDimensions: `${TARGET_WIDTH}x${TARGET_HEIGHT}`,
      filename: path.basename(webpPath),
    };
  } catch (error) {
    console.error(`  ✗ Error processing ${filename}:`, error.message);
    return { error: error.message };
  }
}

/**
 * Process all images in a category
 */
async function processCategory(category) {
  const categoryDir = path.join(galleryDir, category);
  
  if (!fs.existsSync(categoryDir)) {
    console.log(`\n⚠️  Category ${category} directory not found, skipping...`);
    return;
  }

  const files = fs.readdirSync(categoryDir)
    .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
    .map(file => path.join(categoryDir, file));

  if (files.length === 0) {
    console.log(`\n📁 ${category}: No images found`);
    return;
  }

  console.log(`\n📁 Processing ${category}: ${files.length} images`);
  
  for (const file of files) {
    stats.total++;
    const result = await optimizeImage(file, category);
    
    if (result.skipped) {
      stats.skipped++;
    } else if (result.error) {
      stats.errors++;
    } else if (result.success) {
      stats.processed++;
      stats.totalOriginalSize += result.originalSize;
      stats.totalOptimizedSize += result.optimizedSize;
      stats.files.push({
        category,
        filename: result.filename,
        originalSize: result.originalSize,
        optimizedSize: result.optimizedSize,
        reduction: result.reduction,
        originalDimensions: result.originalDimensions,
        optimizedDimensions: result.optimizedDimensions,
      });
      
      console.log(`  ✓ ${path.basename(file)}: ${result.originalSize.toFixed(1)}KB → ${result.optimizedSize.toFixed(1)}KB (${result.reduction}% reduction)`);
    }
  }
}

/**
 * Generate optimization report
 */
function generateReport() {
  const totalReduction = ((stats.totalOriginalSize - stats.totalOptimizedSize) / stats.totalOriginalSize * 100).toFixed(1);
  const avgOriginalSize = (stats.totalOriginalSize / stats.processed).toFixed(1);
  const avgOptimizedSize = (stats.totalOptimizedSize / stats.processed).toFixed(1);
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 OPTIMIZATION REPORT');
  console.log('='.repeat(60));
  console.log(`Total images: ${stats.total}`);
  console.log(`Processed: ${stats.processed}`);
  console.log(`Skipped: ${stats.skipped}`);
  console.log(`Errors: ${stats.errors}`);
  console.log(`\nOriginal total size: ${(stats.totalOriginalSize / 1024).toFixed(2)}MB`);
  console.log(`Optimized total size: ${(stats.totalOptimizedSize / 1024).toFixed(2)}MB`);
  console.log(`Total reduction: ${totalReduction}%`);
  console.log(`\nAverage original size: ${avgOriginalSize}KB`);
  console.log(`Average optimized size: ${avgOptimizedSize}KB`);
  console.log(`Average reduction: ${((parseFloat(avgOriginalSize) - parseFloat(avgOptimizedSize)) / parseFloat(avgOriginalSize) * 100).toFixed(1)}%`);
  
  // Save detailed report to file
  const reportPath = path.join(__dirname, '..', 'optimization-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    summary: {
      total: stats.total,
      processed: stats.processed,
      skipped: stats.skipped,
      errors: stats.errors,
      totalOriginalSizeMB: (stats.totalOriginalSize / 1024).toFixed(2),
      totalOptimizedSizeMB: (stats.totalOptimizedSize / 1024).toFixed(2),
      totalReductionPercent: totalReduction,
    },
    files: stats.files,
  }, null, 2));
  
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting image optimization...');
  console.log(`Target dimensions: ${TARGET_WIDTH}x${TARGET_HEIGHT} (4:3)`);
  console.log(`Format: WebP (quality: ${WEBP_QUALITY}%)`);
  console.log(`Target file size: < ${MAX_FILE_SIZE_KB}KB`);
  
  // Create backup directory
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    console.log(`\n📦 Created backup directory: ${backupDir}`);
  }
  
  // Process each category
  for (const category of categories) {
    await processCategory(category);
  }
  
  // Generate report
  generateReport();
  
  console.log('\n✅ Optimization complete!');
  console.log(`\n⚠️  IMPORTANT: Update gallery-data.ts to use .webp extensions`);
  console.log(`   All images have been converted to WebP format.`);
}

// Run the script
main().catch(console.error);

