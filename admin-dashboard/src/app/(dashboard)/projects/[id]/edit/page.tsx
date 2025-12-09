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
import { Plus, Video } from "lucide-react";
import Image from "next/image";
import { ImageUpload, type UploadedImage } from "@/components/ui/image-upload";
import { DraggableImageList, type DraggableImage } from "@/components/ui/draggable-image-list";

// Use UploadedImage type from component
type ImageData = UploadedImage;

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
  const handleImageUpload = async (files: FileList): Promise<UploadedImage[]> => {
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
      return uploadedImages;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
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
    const newImages = images.filter((_, i) => i !== index).map((img, i) => ({ ...img, order: i }));
    setImages(newImages);
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center animate-fade-in">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-800 border-t-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-400 font-medium">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent mb-2">
          Edit Project
        </h1>
        <p className="text-slate-400">Update project details and media</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-slate-900/80 backdrop-blur-sm shadow-lg border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4 text-slate-100">Basic Information</h2>

          <div>
            <Label htmlFor="title" className="text-slate-300">Project Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Modern Kitchen Renovation"
              required
              className="mt-1 bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-slate-300">Category *</Label>
            <Select value={category} onValueChange={(value: any) => setCategory(value)}>
              <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="kitchen" className="text-slate-100 hover:bg-slate-700">Kitchen</SelectItem>
                <SelectItem value="bathroom" className="text-slate-100 hover:bg-slate-700">Bathroom</SelectItem>
                <SelectItem value="sunroom" className="text-slate-100 hover:bg-slate-700">Sunroom</SelectItem>
                <SelectItem value="millwork" className="text-slate-100 hover:bg-slate-700">Millwork</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description" className="text-slate-300">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the project..."
              rows={4}
              className="mt-1 bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={featured}
              onCheckedChange={(checked) => setFeatured(checked === true)}
            />
            <Label htmlFor="featured" className="cursor-pointer text-slate-300">
              Featured Project
            </Label>
          </div>
        </div>

        {/* Images */}
        <div className="bg-slate-900/80 backdrop-blur-sm shadow-lg border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4 text-slate-100">Images</h2>
          <p className="text-sm text-slate-400 mb-4">
            Upload images and drag to reorder them. The order determines how they appear in the gallery.
          </p>

          {/* Upload Component */}
          <ImageUpload
            images={images}
            onImagesChange={setImages}
            onUpload={handleImageUpload}
            uploading={uploading}
            maxSizeMB={10}
          />

          {/* Draggable Image List */}
          {images.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">
                Reorder Images (drag to change order)
              </h3>
              <DraggableImageList
                images={images}
                onImagesChange={setImages}
                onRemove={removeImage}
              />
            </div>
          )}
        </div>

        {/* Videos */}
        <div className="bg-slate-900/80 backdrop-blur-sm shadow-lg border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4 text-slate-100">Videos</h2>

          {/* Video URL Input */}
          <div className="flex gap-2">
            <Input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Enter YouTube URL (e.g., https://www.youtube.com/watch?v=...)"
              className="flex-1 bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500"
            />
            <Button
              type="button"
              onClick={handleAddVideo}
              disabled={!videoUrl.trim()}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30"
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
                  <div className="aspect-video relative rounded-lg overflow-hidden border-2 border-slate-700">
                    <Image
                      src={video.thumbnailUrl || getYouTubeThumbnail(video.videoId)}
                      alt={video.alt}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Video className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVideo(index)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
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
                      className="text-xs bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={saving}
            className="px-6 py-2.5 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-100 hover:border-slate-600 transition-all"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={saving || uploading}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}

