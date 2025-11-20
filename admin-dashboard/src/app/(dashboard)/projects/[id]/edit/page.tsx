"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/video-utils";
import { Upload, X, Plus, Video } from "lucide-react";
import Image from "next/image";

interface ImageData {
  id?: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
  order: number;
}

interface VideoData {
  id?: string;
  videoId: string;
  alt: string;
  width: number;
  height: number;
  thumbnailUrl?: string;
  order: number;
}

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"kitchen" | "bathroom" | "sunroom" | "millwork">("kitchen");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);
  
  // Media state
  const [images, setImages] = useState<ImageData[]>([]);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [videoUrl, setVideoUrl] = useState("");

  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`);
        if (!response.ok) {
          throw new Error("Failed to load project");
        }

        const project = await response.json();
        setTitle(project.title);
        setCategory(project.category);
        setDescription(project.description || "");
        setFeatured(project.featured || false);
        setImages(project.images || []);
        setVideos(project.videos || []);
      } catch (error) {
        console.error("Error loading project:", error);
        alert("Failed to load project");
        router.push("/projects");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadProject();
    }
  }, [projectId, router]);

  // Handle image upload
  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const result = await response.json();
        return {
          url: result.url,
          alt: file.name.replace(/\.[^/.]+$/, ""),
          width: result.width,
          height: result.height,
          blurDataURL: result.blurDataURL,
          order: images.length,
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      setImages([...images, ...uploadedImages]);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Handle video URL addition
  const handleAddVideo = () => {
    if (!videoUrl.trim()) return;

    const videoId = extractYouTubeId(videoUrl.trim());
    if (!videoId || videoId.length !== 11) {
      alert("Invalid YouTube URL. Please enter a valid YouTube video URL.");
      return;
    }

    const newVideo: VideoData = {
      videoId,
      alt: `Video ${videos.length + 1}`,
      width: 1920,
      height: 1080,
      thumbnailUrl: getYouTubeThumbnail(videoId, "hq"),
      order: videos.length,
    };

    setVideos([...videos, newVideo]);
    setVideoUrl("");
  };

  // Remove image
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index).map((img, i) => ({ ...img, order: i })));
  };

  // Remove video
  const removeVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index).map((vid, i) => ({ ...vid, order: i })));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a project title");
      return;
    }

    if (images.length === 0 && videos.length === 0) {
      alert("Please add at least one image or video");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          category,
          description: description.trim() || null,
          featured,
          images,
          videos,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update project");
      }

      router.push("/projects");
      router.refresh();
    } catch (error: any) {
      console.error("Error updating project:", error);
      alert(error.message || "Failed to update project. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Project</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

          <div>
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Modern Kitchen Renovation"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={(value: any) => setCategory(value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kitchen">Kitchen</SelectItem>
                <SelectItem value="bathroom">Bathroom</SelectItem>
                <SelectItem value="sunroom">Sunroom</SelectItem>
                <SelectItem value="millwork">Millwork</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the project..."
              rows={4}
              className="mt-1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={featured}
              onCheckedChange={(checked) => setFeatured(checked === true)}
            />
            <Label htmlFor="featured" className="cursor-pointer">
              Featured Project
            </Label>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Images</h2>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              id="image-upload"
              multiple
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files)}
              className="hidden"
              disabled={uploading}
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <span className="text-sm text-gray-600">
                {uploading ? "Uploading..." : "Click to upload images or drag and drop"}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                PNG, JPG, WEBP up to 10MB each
              </span>
            </label>
          </div>

          {/* Image List */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-[4/3] relative rounded-lg overflow-hidden border">
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="mt-2">
                    <Input
                      value={image.alt}
                      onChange={(e) => {
                        const newImages = [...images];
                        newImages[index].alt = e.target.value;
                        setImages(newImages);
                      }}
                      placeholder="Image description"
                      className="text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Videos */}
        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Videos</h2>

          {/* Video URL Input */}
          <div className="flex gap-2">
            <Input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Enter YouTube URL (e.g., https://www.youtube.com/watch?v=...)"
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleAddVideo}
              disabled={!videoUrl.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Video
            </Button>
          </div>

          {/* Video List */}
          {videos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {videos.map((video, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-video relative rounded-lg overflow-hidden border">
                    <Image
                      src={video.thumbnailUrl || getYouTubeThumbnail(video.videoId)}
                      alt={video.alt}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Video className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVideo(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="mt-2">
                    <Input
                      value={video.alt}
                      onChange={(e) => {
                        const newVideos = [...videos];
                        newVideos[index].alt = e.target.value;
                        setVideos(newVideos);
                      }}
                      placeholder="Video description"
                      className="text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving || uploading}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}

