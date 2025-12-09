/**
 * Image upload API route
 * Handles multipart/form-data uploads and optimizes images
 */

import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/blob';
import { auth } from '@/lib/auth';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let userId: string | undefined;
  let userEmail: string | undefined;

  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      logger.warn('Image upload attempted without authentication');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    userId = session.user?.id;
    userEmail = session.user?.email;
    
    logger.operationStart('image upload', {
      userId,
      userEmail,
      metadata: { hasSession: true },
    });

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      logger.warn('Image upload attempted without file', { userId, userEmail });
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size (Vercel limit is 4.5MB, use 4MB to be safe)
    const maxSizeBytes = 4 * 1024 * 1024; // 4MB
    const fileSizeMB = file.size / (1024 * 1024);
    
    if (file.size > maxSizeBytes) {
      logger.warn('File too large for upload', {
        userId,
        userEmail,
        metadata: {
          fileName: file.name,
          fileSizeMB: fileSizeMB.toFixed(2),
          maxSizeMB: 4,
        },
      });
      return NextResponse.json(
        { 
          error: 'File too large',
          message: `File size (${fileSizeMB.toFixed(1)}MB) exceeds maximum allowed size (4MB). Please compress the image before uploading.`,
        },
        { status: 413 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      logger.warn('Invalid file type attempted for upload', {
        userId,
        userEmail,
        metadata: { fileType: file.type, fileName: file.name },
      });
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Generate filename
    const timestamp = Date.now();
    const extension = 'webp';
    const filename = `gallery/${timestamp}-${file.name.replace(/\.[^/.]+$/, '')}.${extension}`;

    logger.debug('Starting image upload and optimization', {
      userId,
      userEmail,
      metadata: {
        originalFileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        targetFilename: filename,
      },
    });

    // Upload and optimize
    const result = await uploadImage(file, filename);

    const duration = Date.now() - startTime;
    logger.operationSuccess('image upload', {
      userId,
      userEmail,
      metadata: {
        filename: result.url,
        width: result.width,
        height: result.height,
        durationMs: duration,
        fileSize: file.size,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    const duration = Date.now() - startTime;
    const err = error instanceof Error ? error : new Error(String(error));
    
    // Check for 413 or body size errors
    const isSizeError = 
      err.message?.includes('413') ||
      err.message?.includes('too large') ||
      err.message?.includes('PayloadTooLargeError') ||
      err.message?.includes('request entity too large');
    
    logger.operationFailure('image upload', err, {
      userId,
      userEmail,
      metadata: {
        durationMs: duration,
        hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
        errorType: err.name,
        isSizeError,
      },
    });
    
    if (isSizeError) {
      return NextResponse.json(
        { 
          error: 'File too large',
          message: 'The image file is too large. Maximum size is 4MB. Large images are automatically compressed before upload - if you see this error, the image may be extremely large. Please compress it manually or use a smaller image.',
        },
        { status: 413 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to upload image',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined,
      },
      { status: 500 }
    );
  }
}

