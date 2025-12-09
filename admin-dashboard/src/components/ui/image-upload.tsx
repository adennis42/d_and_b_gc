/**
 * Image Upload Component with Drag and Drop Support
 */

"use client";

import { useState, useRef, DragEvent } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { Input } from "./input";
import { compressImage, shouldCompress } from "@/lib/image-compression";

export interface UploadedImage {
  id?: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
  order: number;
}

interface ImageUploadProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  onUpload: (files: FileList) => Promise<UploadedImage[]>;
  uploading?: boolean;
  maxSizeMB?: number;
}

export function ImageUpload({
  images,
  onImagesChange,
  onUpload,
  uploading = false,
  maxSizeMB = 10,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    // Filter image files
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length === 0) {
      alert("Please drop image files only");
      return;
    }

    // Check file sizes - warn but don't block (will compress if needed)
    const oversizedFiles = imageFiles.filter(
      (file) => file.size > maxSizeMB * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      // Don't block, just inform that compression will happen
      console.log(
        `Large files detected, will compress: ${oversizedFiles
          .map((f) => `${f.name} (${(f.size / (1024 * 1024)).toFixed(1)}MB)`)
          .join(", ")}`
      );
    }

    // Create FileList from filtered files
    const dataTransfer = new DataTransfer();
    imageFiles.forEach((file) => dataTransfer.items.add(file));
    
    await handleFileUpload(dataTransfer.files);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFileUpload(files);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileUpload = async (files: FileList) => {
    try {
      // Process files: compress if needed
      const fileArray = Array.from(files);
      const processedFiles: File[] = [];

      for (const file of fileArray) {
        // Check if compression is needed (files over 4MB)
        if (shouldCompress(file, 4)) {
          try {
            const compressed = await compressImage(file, {
              maxWidth: 1920,
              maxHeight: 1440,
              quality: 0.85,
              maxSizeMB: 4,
            });
            processedFiles.push(compressed);
          } catch (compressionError) {
            console.warn(`Failed to compress ${file.name}, uploading original:`, compressionError);
            // If compression fails, try original (might fail with 413, but worth trying)
            processedFiles.push(file);
          }
        } else {
          processedFiles.push(file);
        }
      }

      // Create new FileList from processed files
      const dataTransfer = new DataTransfer();
      processedFiles.forEach((file) => dataTransfer.items.add(file));

      const uploadedImages = await onUpload(dataTransfer.files);
      // Update order for new images based on current images length
      const newImages = uploadedImages.map((img, i) => ({
        ...img,
        order: images.length + i,
      }));
      onImagesChange([...images, ...newImages]);
    } catch (error: any) {
      console.error("Upload error:", error);
      
      // Check for 413 error specifically
      const errorMessage = error?.message || String(error);
      if (errorMessage.includes('413') || errorMessage.includes('too large') || errorMessage.includes('too large')) {
        alert(
          errorMessage || 
          "File is too large. Maximum size is 4MB. Large images are automatically compressed, " +
          "but this image may be extremely large. Please compress it manually or use a smaller image."
        );
      } else {
        alert(errorMessage || "Failed to upload images. Please try again.");
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = images
      .filter((_, i) => i !== index)
      .map((img, i) => ({ ...img, order: i }));
    onImagesChange(newImages);
  };

  const updateImageAlt = (index: number, alt: string) => {
    const newImages = [...images];
    newImages[index].alt = alt;
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-500/10"
            : "border-slate-700 hover:border-blue-500/50"
        } ${uploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          id="image-upload"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={uploading}
        />
        <label
          htmlFor="image-upload"
          className="flex flex-col items-center cursor-pointer"
        >
          <Upload
            className={`h-12 w-12 mb-4 transition-colors ${
              isDragging ? "text-blue-500" : "text-slate-500"
            }`}
          />
          <span className="text-sm text-slate-300">
            {uploading
              ? "Uploading..."
              : isDragging
              ? "Drop images here"
              : "Click to upload images or drag and drop"}
          </span>
          <span className="text-xs text-slate-500 mt-1">
            PNG, JPG, WEBP up to {maxSizeMB}MB each (large images will be automatically compressed)
          </span>
        </label>
      </div>

      {/* Image List */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-[4/3] relative rounded-lg overflow-hidden border-2 border-slate-700">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 left-2 bg-slate-900/80 text-slate-300 text-xs px-2 py-1 rounded">
                  #{index + 1}
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="mt-2">
                <Input
                  value={image.alt}
                  onChange={(e) => updateImageAlt(index, e.target.value)}
                  placeholder="Image description"
                  className="text-xs bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

