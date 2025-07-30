'use client'

import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Plus } from 'lucide-react';
import ImageUpload from './ImageUpload';
import ImageLibrary from './ImageLibrary';

interface ImageRecord {
  id: number;
  filename: string;
  original_name: string;
  file_size: number;
  mime_type: string;
  width: number;
  height: number;
  public_url: string;
  variants: {
    urls: Record<string, string>;
    metadata: Record<string, any>;
    blur_placeholder: string;
  };
  alt_text: string | null;
  category: string;
  created_at: string;
}

interface ImageManagerProps {
  onSelectImage?: (image: ImageRecord) => void;
  onClose?: () => void;
  isModal?: boolean;
  category?: 'lentils' | 'millets' | 'general';
  className?: string;
}

export default function ImageManager({ 
  onSelectImage, 
  onClose, 
  isModal = false, 
  category = 'general',
  className = '' 
}: ImageManagerProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'library'>('library');
  const [refreshLibrary, setRefreshLibrary] = useState(0);

  // Handle successful upload - switch to library and refresh
  const handleUploadComplete = (image: ImageRecord) => {
    console.log('Image uploaded successfully:', image);
    setActiveTab('library');
    setRefreshLibrary(prev => prev + 1); // Trigger library refresh
    
    // If this is a selection modal, auto-select the uploaded image
    if (onSelectImage) {
      onSelectImage(image);
      if (isModal && onClose) {
        onClose();
      }
    }
  };

  const containerClass = isModal 
    ? "fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
    : `w-full ${className}`;

  const contentClass = isModal
    ? "bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
    : "w-full bg-white rounded-lg border border-gray-200";

  return (
    <div className={containerClass}>
      <div className={contentClass}>
        {/* Tab Header */}
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {isModal ? 'Select Image' : 'Image Manager'}
            </h2>
            {isModal && onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ×
              </button>
            )}
          </div>
          
          <div className="flex">
            <button
              onClick={() => setActiveTab('library')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'library'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <ImageIcon size={18} className="inline mr-2" />
              Image Library
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Upload size={18} className="inline mr-2" />
              Upload New
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="relative">
          {activeTab === 'library' ? (
            <ImageLibrary
              onSelectImage={onSelectImage}
              onClose={isModal ? onClose : undefined}
              isModal={false} // We're handling the modal wrapper here
              category="all" // Allow all categories in library
              key={refreshLibrary} // Force refresh when upload completes
            />
          ) : (
            <div className="p-6">
              <ImageUpload
                onUploadComplete={handleUploadComplete}
                category={category}
              />
              
              {/* Upload Tips */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Upload Tips:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Upload high-quality images for best results</li>
                  <li>• Images will be automatically optimized and resized</li>
                  <li>• Multiple formats (JPEG, WebP) will be generated</li>
                  <li>• Add descriptive alt text for accessibility</li>
                  <li>• Choose the correct category for better organization</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Quick Upload Button (when in library tab) */}
        {activeTab === 'library' && !isModal && (
          <div className="absolute bottom-6 right-6">
            <button
              onClick={() => setActiveTab('upload')}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition-colors"
              title="Upload New Image"
            >
              <Plus size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}