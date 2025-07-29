'use client'

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';

interface UploadedImage {
  id: number;
  filename: string;
  original_name: string;
  file_size: number;
  width: number;
  height: number;
  public_url: string;
  variants: {
    urls: Record<string, string>;
    metadata: Record<string, any>;
    blur_placeholder: string;
  };
  alt_text: string;
  category: string;
}

interface ImageUploadProps {
  onUploadComplete: (image: UploadedImage) => void;
  category?: 'lentils' | 'millets' | 'general';
  className?: string;
}

export default function ImageUpload({ onUploadComplete, category = 'general', className = '' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [altText, setAltText] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPEG, PNG, WebP, and GIF images are allowed');
      return;
    }

    setError(null);
    setSuccess(false);
    setUploading(true);
    setUploadProgress(0);

    // Create preview URL
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      formData.append('alt_text', altText);

      // Upload the file
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      // Handle completion
      xhr.onload = () => {
        setUploading(false);
        
        if (xhr.status === 201) {
          const response = JSON.parse(xhr.responseText);
          setSuccess(true);
          onUploadComplete(response.data);
          
          // Reset form after 2 seconds
          setTimeout(() => {
            setPreviewUrl(null);
            setAltText('');
            setSuccess(false);
            setUploadProgress(0);
          }, 2000);
        } else {
          const errorResponse = JSON.parse(xhr.responseText);
          setError(errorResponse.error || 'Upload failed');
        }
      };

      // Handle errors
      xhr.onerror = () => {
        setUploading(false);
        setError('Network error occurred during upload');
      };

      // Send the request
      xhr.open('POST', '/api/cms/upload');
      xhr.send(formData);

    } catch (error) {
      setUploading(false);
      setError('An unexpected error occurred');
      console.error('Upload error:', error);
    }
  }, [category, altText, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    multiple: false,
    disabled: uploading
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Alt Text Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alt Text (for accessibility)
        </label>
        <input
          type="text"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe this image for screen readers..."
          disabled={uploading}
        />
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'cursor-not-allowed opacity-50' : ''}
          ${error ? 'border-red-300 bg-red-50' : ''}
          ${success ? 'border-green-300 bg-green-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {previewUrl && !success ? (
          <div className="space-y-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="mx-auto max-h-48 rounded-lg shadow-sm"
            />
            {uploading && (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        ) : success ? (
          <div className="space-y-3">
            <CheckCircle size={48} className="mx-auto text-green-500" />
            <div>
              <h3 className="text-lg font-medium text-green-900">Upload Successful!</h3>
              <p className="text-sm text-green-700">
                Image processed and optimized successfully
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="space-y-3">
            <AlertCircle size={48} className="mx-auto text-red-500" />
            <div>
              <h3 className="text-lg font-medium text-red-900">Upload Failed</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-sm text-red-600 hover:text-red-800 underline"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <Upload size={48} className="mx-auto text-gray-400" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {isDragActive ? 'Drop your image here' : 'Upload an Image'}
              </h3>
              <p className="text-sm text-gray-600">
                Drag & drop an image here, or click to select
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Supports JPEG, PNG, WebP, GIF • Max 10MB
              </p>
            </div>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-2 right-2">
          <span className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${category === 'lentils' ? 'bg-orange-100 text-orange-800' : 
              category === 'millets' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-gray-100 text-gray-800'}
          `}>
            {category}
          </span>
        </div>
      </div>

      {/* Upload Guidelines */}
      <div className="mt-4 text-xs text-gray-500">
        <h4 className="font-medium mb-2">Image Guidelines:</h4>
        <ul className="space-y-1">
          <li>• Best quality: 1200x675 pixels for hero images</li>
          <li>• Recipe cards work best with 4:5 aspect ratio (800x1000)</li>
          <li>• Images will be automatically resized and optimized</li>
          <li>• Multiple formats (JPEG, WebP) generated for best performance</li>
        </ul>
      </div>
    </div>
  );
}