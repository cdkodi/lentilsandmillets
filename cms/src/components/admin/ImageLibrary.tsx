'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Grid, List, Filter, X, Eye, Copy, Trash2, Download, Calendar } from 'lucide-react';

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

interface ImageLibraryProps {
  onSelectImage?: (image: ImageRecord) => void;
  onClose?: () => void;
  isModal?: boolean;
  category?: 'all' | 'lentils' | 'millets' | 'general';
  className?: string;
}

export default function ImageLibrary({ 
  onSelectImage, 
  onClose, 
  isModal = false, 
  category = 'all',
  className = '' 
}: ImageLibraryProps) {
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(category);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedImage, setSelectedImage] = useState<ImageRecord | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Load images from the database
  const loadImages = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/cms/images?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to load images');
      }

      const data = await response.json();
      setImages(data.data?.images || data.images || []);
    } catch (error) {
      console.error('Error loading images:', error);
      setError('Failed to load images');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle image selection
  const handleSelectImage = (image: ImageRecord) => {
    if (onSelectImage) {
      onSelectImage(image);
      if (isModal && onClose) {
        onClose();
      }
    } else {
      setSelectedImage(image);
      setShowPreview(true);
    }
  };

  // Copy URL to clipboard
  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  // Delete image
  const handleDeleteImage = async (imageId: number) => {
    if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/cms/images/${imageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      // Reload images after deletion
      await loadImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      setError('Failed to delete image');
    }
  };

  // Filter images based on search term
  const filteredImages = images.filter(image => {
    const searchLower = searchTerm.toLowerCase();
    return (
      image.original_name.toLowerCase().includes(searchLower) ||
      image.filename.toLowerCase().includes(searchLower) ||
      (image.alt_text && image.alt_text.toLowerCase().includes(searchLower))
    );
  });

  const containerClass = isModal 
    ? "fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
    : `w-full ${className}`;

  const contentClass = isModal
    ? "bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
    : "w-full";

  return (
    <div className={containerClass}>
      <div className={contentClass}>
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Image Library</h2>
            {isModal && onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search images by name or alt text..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="lentils">Lentils</option>
              <option value="millets">Millets</option>
              <option value="general">General</option>
            </select>

            {/* View mode toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: isModal ? 'calc(90vh - 140px)' : 'auto' }}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={loadImages}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Try Again
              </button>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'No images found matching your criteria.'
                  : 'No images uploaded yet. Upload your first image to get started!'
                }
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredImages.map(image => (
                <div
                  key={image.id}
                  className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleSelectImage(image)}
                >
                  {/* Image */}
                  <div className="aspect-square relative">
                    <img
                      src={image.variants.urls.thumbnail || image.public_url}
                      alt={image.alt_text || image.original_name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    
                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(image);
                            setShowPreview(true);
                          }}
                          className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                          title="Preview"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(image.public_url);
                          }}
                          className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                          title="Copy URL"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 truncate" title={image.original_name}>
                      {image.original_name}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        image.category === 'lentils' ? 'bg-orange-100 text-orange-800' :
                        image.category === 'millets' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {image.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatFileSize(image.file_size)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-2">
              {filteredImages.map(image => (
                <div
                  key={image.id}
                  className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow cursor-pointer"
                  onClick={() => handleSelectImage(image)}
                >
                  {/* Thumbnail */}
                  <img
                    src={image.variants.urls.thumbnail || image.public_url}
                    alt={image.alt_text || image.original_name}
                    className="w-12 h-12 object-cover rounded-lg mr-4"
                    loading="lazy"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {image.original_name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {image.alt_text || 'No alt text'}
                    </p>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className={`px-2 py-1 rounded-full font-medium ${
                      image.category === 'lentils' ? 'bg-orange-100 text-orange-800' :
                      image.category === 'millets' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {image.category}
                    </span>
                    <span>{image.width}×{image.height}</span>
                    <span>{formatFileSize(image.file_size)}</span>
                    <span>{formatDate(image.created_at)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(image);
                        setShowPreview(true);
                      }}
                      className="p-2 hover:bg-gray-100 rounded transition-colors"
                      title="Preview"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(image.public_url);
                      }}
                      className="p-2 hover:bg-gray-100 rounded transition-colors"
                      title="Copy URL"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteImage(image.id);
                      }}
                      className="p-2 hover:bg-red-100 text-red-600 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Image Preview Modal */}
        {showPreview && selectedImage && (
          <div className="fixed inset-0 z-60 bg-black bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <div>
                  <h3 className="text-lg font-semibold">{selectedImage.original_name}</h3>
                  <p className="text-sm text-gray-600">{selectedImage.width}×{selectedImage.height} • {formatFileSize(selectedImage.file_size)}</p>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-4">
                <img
                  src={selectedImage.variants.urls.hero_large || selectedImage.public_url}
                  alt={selectedImage.alt_text || selectedImage.original_name}
                  className="max-w-full max-h-[60vh] mx-auto rounded-lg"
                />
                
                {selectedImage.alt_text && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm"><strong>Alt Text:</strong> {selectedImage.alt_text}</p>
                  </div>
                )}

                <div className="flex justify-center space-x-2 mt-4">
                  <button
                    onClick={() => copyToClipboard(selectedImage.public_url)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2"
                  >
                    <Copy size={16} />
                    <span>Copy URL</span>
                  </button>
                  {onSelectImage && (
                    <button
                      onClick={() => {
                        onSelectImage(selectedImage);
                        setShowPreview(false);
                        if (isModal && onClose) onClose();
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Select Image
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}