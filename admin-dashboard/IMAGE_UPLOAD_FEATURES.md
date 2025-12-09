# Image Upload & Reordering Features

## New Features

### 1. Drag and Drop Upload ✅

You can now drag and drop image files directly onto the upload area:

- **Visual Feedback**: The upload area highlights when you drag files over it
- **Multiple Files**: Drag multiple images at once
- **File Validation**: Automatically filters to image files only
- **Size Validation**: Checks file size (10MB limit per file)
- **Error Handling**: Shows clear error messages for invalid files

### 2. Drag and Drop Reordering ✅

Reorder images by dragging them up or down in the list:

- **Drag Handle**: Grip icon on the left for easy dragging
- **Visual Feedback**: Highlights when dragging over a drop zone
- **Order Numbers**: Shows current position (#1, #2, etc.)
- **Auto-Update**: Order property automatically updates when reordered
- **Persistent**: Order is saved when you save the project

## How to Use

### Uploading Images

1. **Click Upload**:
   - Click the upload area
   - Select one or more image files
   - Files upload automatically

2. **Drag and Drop**:
   - Drag image files from your computer
   - Drop them onto the upload area
   - Files upload automatically

### Reordering Images

1. **Find the Image List**: Below the upload area, you'll see a list of uploaded images
2. **Drag to Reorder**:
   - Click and hold the grip icon (⋮⋮) on the left
   - Drag the image up or down
   - Drop it in the desired position
3. **Save**: Click "Create Project" or "Save Changes" to save the new order

## Features

### Upload Area
- ✅ Drag and drop support
- ✅ Click to browse files
- ✅ Visual feedback when dragging
- ✅ File type validation (images only)
- ✅ File size validation (10MB max)
- ✅ Multiple file upload
- ✅ Upload progress indicator

### Image List
- ✅ Drag and drop reordering
- ✅ Visual feedback during drag
- ✅ Order numbers displayed
- ✅ Edit alt text inline
- ✅ Remove images
- ✅ Responsive layout

## Technical Details

### Components Created

1. **`ImageUpload`** (`src/components/ui/image-upload.tsx`):
   - Handles file uploads (click and drag & drop)
   - Validates files
   - Shows upload progress
   - Displays uploaded images in a grid

2. **`DraggableImageList`** (`src/components/ui/draggable-image-list.tsx`):
   - Displays images in a draggable list
   - Handles drag and drop reordering
   - Updates order property automatically
   - Shows order numbers

### How Order Works

- Each image has an `order` property (0, 1, 2, ...)
- When you drag and drop, the order is automatically recalculated
- The order determines how images appear in the gallery
- Lower numbers appear first

### Browser Support

- ✅ Chrome/Edge (full support)
- ✅ Firefox (full support)
- ✅ Safari (full support)
- ✅ Mobile browsers (touch-friendly)

## Troubleshooting

### Drag and Drop Not Working

1. **Check Browser**: Make sure you're using a modern browser
2. **Try Click Upload**: If drag & drop doesn't work, use the click upload
3. **Check File Types**: Only image files are accepted
4. **Check File Size**: Files must be under 10MB

### Reordering Not Working

1. **Use Grip Icon**: Click and hold the grip icon (⋮⋮) on the left
2. **Drag Slowly**: Drag slowly to see the drop zones
3. **Check Order Numbers**: Order numbers should update as you drag
4. **Save Changes**: Make sure to save after reordering

### Images Not Uploading

1. **Check File Size**: Must be under 10MB per file
2. **Check File Type**: Must be an image (PNG, JPG, WEBP)
3. **Check Network**: Make sure you have internet connection
4. **Check Console**: Open browser console for error messages
5. **Check Admin Logs**: Check Vercel function logs for upload errors

## Future Enhancements

Potential improvements:
- [ ] Image preview before upload
- [ ] Image cropping/editing
- [ ] Bulk image operations
- [ ] Image search/filter
- [ ] Keyboard shortcuts for reordering
- [ ] Undo/redo for reordering

