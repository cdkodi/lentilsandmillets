'use client'

import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Upload, Search } from 'lucide-react';
import { IMAGE_VARIANTS, ALIGNMENT_CLASSES } from '../../lib/markdown-processor';

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

interface ImageInsertionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (imageTag: string) => void;
}

export default function ImageInsertionModal({ isOpen, onClose, onInsert }: ImageInsertionModalProps) {
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImageRecord | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<keyof typeof IMAGE_VARIANTS>('card_medium');
  const [selectedAlignment, setSelectedAlignment] = useState<keyof typeof ALIGNMENT_CLASSES>('center');
  const [caption, setCaption] = useState('');

  // Fetch images from API
  useEffect(() => {
    if (isOpen) {
      fetchImages();
    }
  }, [isOpen]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cms/images');
      if (response.ok) {
        const data = await response.json();
        setImages(data.images || []);
      } else {
        console.error('Failed to fetch images');
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter images based on search query
  const filteredImages = images.filter(image => 
    image.original_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (image.alt_text && image.alt_text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Generate the image tag syntax
  const generateImageTag = () => {
    if (!selectedImage) return '';
    
    // Remove file extension from filename for tag
    const baseFilename = selectedImage.filename.replace(/\.[^/.]+$/, '');
    
    let tag = `{image:${baseFilename}:${selectedVariant}:${selectedAlignment}`;
    
    if (caption.trim()) {
      tag += `|${caption.trim()}`;
    }
    
    tag += '}';
    
    return tag;
  };

  const handleInsert = () => {
    const imageTag = generateImageTag();
    if (imageTag) {
      onInsert(imageTag);
      onClose();
      // Reset state
      setSelectedImage(null);
      setCaption('');
      setSelectedVariant('card_medium');
      setSelectedAlignment('center');
    }
  };

  const handleImageSelect = (image: ImageRecord) => {
    setSelectedImage(image);
    // Auto-fill caption with alt text if available
    if (image.alt_text) {
      setCaption(image.alt_text);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Insert Image</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex h-[calc(90vh-200px)]">
          {/* Image Library */}
          <div className="flex-1 p-6 border-r">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Image Grid */}
            <div className="overflow-y-auto h-full">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="text-gray-500">Loading images...</div>
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                  <ImageIcon size={48} className="mb-2" />
                  <p>No images found</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredImages.map((image) => (
                    <div
                      key={image.id}
                      onClick={() => handleImageSelect(image)}
                      className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                        selectedImage?.id === image.id
                          ? 'border-blue-500 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image.variants?.urls?.thumbnail || image.public_url}
                        alt={image.alt_text || image.original_name}
                        className="w-full h-24 object-cover"
                      />
                      <div className="p-2">
                        <p className="text-xs text-gray-600 truncate">
                          {image.original_name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Configuration Panel */}
          <div className="w-80 p-6 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration</h3>
            
            {selectedImage ? (
              <div className="space-y-4">
                {/* Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </label>
                  <img
                    src={selectedImage.variants?.urls?.[selectedVariant] || selectedImage.public_url}
                    alt={selectedImage.alt_text || selectedImage.original_name}
                    className="w-full rounded-lg border"
                  />
                </div>

                {/* Image Variant */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size Variant
                  </label>
                  <select
                    value={selectedVariant}
                    onChange={(e) => setSelectedVariant(e.target.value as keyof typeof IMAGE_VARIANTS)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Object.entries(IMAGE_VARIANTS).map(([key, config]) => (
                      <option key={key} value={key}>
                        {key.replace('_', ' ').toUpperCase()} ({config.width}x{config.height})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Alignment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alignment
                  </label>
                  <select
                    value={selectedAlignment}
                    onChange={(e) => setSelectedAlignment(e.target.value as keyof typeof ALIGNMENT_CLASSES)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Object.keys(ALIGNMENT_CLASSES).map((alignment) => (
                      <option key={alignment} value={alignment}>
                        {alignment.replace('-', ' ').toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Caption */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Caption (Optional)
                  </label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    rows={2}
                    placeholder="Enter image caption..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Generated Tag Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Generated Tag
                  </label>
                  <code className="block w-full p-2 bg-gray-100 border rounded text-xs break-all">
                    {generateImageTag()}
                  </code>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-8">
                <ImageIcon size={48} className="mx-auto mb-2" />
                <p>Select an image to configure</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            {selectedImage ? `Selected: ${selectedImage.original_name}` : 'No image selected'}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleInsert}
              disabled={!selectedImage}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Insert Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}