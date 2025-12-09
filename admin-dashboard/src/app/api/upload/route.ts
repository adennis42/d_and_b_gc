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
    
    logger.operationFailure('image upload', err, {
      userId,
      userEmail,
      metadata: {
        durationMs: duration,
        hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
        errorType: err.name,
      },
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to upload image',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined,
      },
      { status: 500 }
    );
  }
}

