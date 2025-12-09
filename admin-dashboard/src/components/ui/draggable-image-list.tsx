/**
 * Draggable Image List Component
 * Allows reordering images via drag and drop
 */

"use client";

import { useState, DragEvent } from "react";
import { GripVertical, X } from "lucide-react";
import Image from "next/image";
import { Input } from "./input";

export interface DraggableImage {
  id?: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
  order: number;
}

interface DraggableImageListProps {
  images: DraggableImage[];
  onImagesChange: (images: DraggableImage[]) => void;
  onRemove?: (index: number) => void;
}

export function DraggableImageList({
  images,
  onImagesChange,
  onRemove,
}: DraggableImageListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    
    // Remove dragged item
    newImages.splice(draggedIndex, 1);
    
    // Insert at new position
    newImages.splice(dropIndex, 0, draggedImage);
    
    // Update order property
    const reorderedImages = newImages.map((img, i) => ({
      ...img,
      order: i,
    }));

    onImagesChange(reorderedImages);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const updateImageAlt = (index: number, alt: string) => {
    const newImages = [...images];
    newImages[index].alt = alt;
    onImagesChange(newImages);
  };

  const removeImage = (index: number) => {
    if (onRemove) {
      onRemove(index);
    } else {
      const newImages = images
        .filter((_, i) => i !== index)
        .map((img, i) => ({ ...img, order: i }));
      onImagesChange(newImages);
    }
  };

  return (
    <div className="space-y-3">
      {images.map((image, index) => (
        <div
          key={index}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          className={`group relative flex items-center gap-4 p-3 rounded-lg border-2 transition-all ${
            draggedIndex === index
              ? "opacity-50 border-blue-500 bg-blue-500/10"
              : dragOverIndex === index
              ? "border-blue-500 bg-blue-500/20"
              : "border-slate-700 hover:border-slate-600 bg-slate-800/50"
          } cursor-move`}
        >
          {/* Drag Handle */}
          <div className="flex-shrink-0 text-slate-500 hover:text-slate-300 transition-colors">
            <GripVertical className="h-5 w-5" />
          </div>

          {/* Image Preview */}
          <div className="flex-shrink-0 w-24 h-16 relative rounded overflow-hidden border border-slate-700">
            <Image
              src={image.url}
              alt={image.alt}
              fill
              className="object-cover"
            />
          </div>

          {/* Order Number */}
          <div className="flex-shrink-0 w-8 text-center">
            <span className="text-sm font-semibold text-slate-400">
              #{index + 1}
            </span>
          </div>

          {/* Alt Text Input */}
          <div className="flex-1">
            <Input
              value={image.alt}
              onChange={(e) => updateImageAlt(index, e.target.value)}
              placeholder="Image description"
              className="text-sm bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500"
            />
          </div>

          {/* Remove Button */}
          <button
            type="button"
            onClick={() => removeImage(index)}
            className="flex-shrink-0 bg-red-500 hover:bg-red-600 text-white rounded p-1.5 opacity-0 group-hover:opacity-100 transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      
      {images.length === 0 && (
        <p className="text-sm text-slate-500 text-center py-4">
          No images added yet. Upload images above to get started.
        </p>
      )}
    </div>
  );
}

