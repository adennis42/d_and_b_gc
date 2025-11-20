/**
 * Image upload API route
 * Handles multipart/form-data uploads and optimizes images
 */

import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/blob';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Generate filename
    const timestamp = Date.now();
    const extension = 'webp';
    const filename = `gallery/${timestamp}-${file.name.replace(/\.[^/.]+$/, '')}.${extension}`;

    // Upload and optimize
    const result = await uploadImage(file, filename);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

