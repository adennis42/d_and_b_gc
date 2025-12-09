# Fix: 413 Content Too Large Error

## Problem

Vercel has a **4.5MB body size limit** for serverless functions. When uploading large images, you may get a 413 "Content Too Large" error.

## Solution Implemented

### 1. Automatic Client-Side Compression ✅

Images over 4MB are now automatically compressed before upload:

- **Resizes** to max 1920x1440px (maintains aspect ratio)
- **Converts** to WebP format (better compression)
- **Reduces quality** if still too large
- **Target size**: Under 4MB (safe margin below Vercel's 4.5MB limit)

### 2. Better Error Handling ✅

- Clear error messages for 413 errors
- File size validation before upload
- Helpful suggestions when files are too large

### 3. Server-Side Validation ✅

- API route validates file size (4MB max)
- Returns clear error messages
- Logs file size information

## How It Works

### Automatic Compression Flow

1. **User selects/drops image file**
2. **Check file size**:
   - If < 4MB: Upload directly
   - If ≥ 4MB: Compress first
3. **Compression process**:
   - Resize to max 1920x1440px
   - Convert to WebP format
   - Apply 85% quality
   - If still > 4MB, reduce quality further
4. **Upload compressed file**

### Error Handling

If compression fails or file is still too large:
- Clear error message shown to user
- Suggests manual compression
- Logs error details for debugging

## File Size Limits

- **Client-side check**: 10MB (warns but doesn't block)
- **Automatic compression**: Files over 4MB
- **Server-side limit**: 4MB (hard limit)
- **Vercel limit**: 4.5MB (we use 4MB to be safe)

## User Experience

### Normal Flow
1. User uploads image
2. If large, compression happens automatically
3. Upload succeeds
4. User sees image in gallery

### If File is Extremely Large
1. User uploads very large image (>10MB+)
2. Compression attempts to reduce size
3. If still too large after compression:
   - Error message shown
   - Suggests manual compression
   - User can try again with smaller file

## Manual Compression Tips

If automatic compression isn't enough:

1. **Use image editing software**:
   - Resize to 1920x1440px or smaller
   - Save as WebP or high-quality JPEG
   - Target file size under 4MB

2. **Online tools**:
   - [Squoosh](https://squoosh.app/) - Google's image compressor
   - [TinyPNG](https://tinypng.com/) - PNG/JPEG compressor
   - [Compressor.io](https://compressor.io/) - Multiple formats

3. **Command line** (if you have ImageMagick):
   ```bash
   convert input.jpg -resize 1920x1440 -quality 85 output.webp
   ```

## Technical Details

### Compression Settings

- **Max dimensions**: 1920x1440px
- **Format**: WebP
- **Initial quality**: 85%
- **Fallback quality**: 65% (if still too large)
- **Target size**: < 4MB

### Browser Support

- ✅ Chrome/Edge (full support)
- ✅ Firefox (full support)
- ✅ Safari (full support)
- ⚠️ Older browsers: May fall back to original file (might fail with 413)

## Troubleshooting

### Still Getting 413 Errors

1. **Check file size**: Make sure file is under 4MB after compression
2. **Check browser console**: Look for compression errors
3. **Try manual compression**: Use external tool to compress first
4. **Check network**: Slow connections might timeout on large files

### Compression Not Working

1. **Check browser support**: Make sure you're using a modern browser
2. **Check console**: Look for JavaScript errors
3. **Try smaller file**: Test with a smaller image first
4. **Disable browser extensions**: Some extensions interfere with file operations

### Images Look Low Quality

- Compression uses 85% quality (high quality)
- If you need higher quality, compress manually before upload
- Original images are preserved if compression fails

## Future Improvements

Potential enhancements:
- [ ] Progressive compression (multiple quality levels)
- [ ] Image preview before upload
- [ ] Batch compression progress indicator
- [ ] Option to adjust compression quality
- [ ] Support for more image formats

