import React, { useState, useRef } from 'react';
import { Upload, X, Video } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'react-hot-toast';

interface VideoUploadProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VideoUpload({ isOpen, onClose }: VideoUploadProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth0();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if it's a video file
      if (!file.type.startsWith('video/')) {
        toast.error("Please select a video file");
        return;
      }
      
      // Check file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        toast.error("Please select a video file smaller than 100MB");
        return;
      }
      
      setVideoFile(file);
    }
  };

  const handleUpload = async () => {
    if (!user || !videoFile || !title.trim()) {
      toast.error("Please fill in all required fields and select a video");
      return;
    }

    setUploading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('userId', user.sub || '');

      const response = await fetch('/api/videos/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      toast.success("Video uploaded successfully!");

      // Reset form and close dialog
      setTitle('');
      setDescription('');
      setVideoFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onClose();

    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : "An error occurred during upload");
    } finally {
      setUploading(false);
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center gap-2 mb-4">
          <Video className="w-5 h-5 text-blue-500" />
          <h2 className="text-xl font-semibold text-white">Upload Video</h2>
        </div>
        
        <p className="text-gray-400 text-sm mb-6">
          Upload a new video to share with the community.
        </p>

        <div className="space-y-4">
          {/* Video File Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Video File *</label>
            {!videoFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-400">
                  Click to select a video file
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Max size: 100MB
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-white truncate max-w-xs">
                    {videoFile.name}
                  </span>
                </div>
                <button
                  onClick={removeVideo}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title..."
              maxLength={100}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your video..."
              maxLength={500}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Upload Button */}
          <div className="flex justify-end gap-2 pt-4">
            <button 
              onClick={onClose} 
              disabled={uploading}
              className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!videoFile || !title.trim() || uploading}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload Video'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoUpload;
