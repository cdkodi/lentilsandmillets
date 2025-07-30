'use client'

import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Edit, Eye, Trash2, Plus, Star } from 'lucide-react';

interface ContentItem {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  category: 'lentils' | 'millets';
  status: 'draft' | 'published' | 'archived';
  author: string;
  created_at: string;
  updated_at: string;
  hero_image_url?: string;
  card_position?: string;
  display_pages: string[];
  factoid_data?: any;
  // Recipe specific fields
  prep_time?: number;
  cook_time?: number;
  servings?: number;
  difficulty?: string;
  is_featured?: boolean;
  dietary_tags?: string[];
}

interface ContentLibraryProps {
  contentType: 'articles' | 'recipes';
  onCreateContent: () => void;
  onEditContent: (id: number) => void;
}

export default function ContentLibrary({ contentType, onCreateContent, onEditContent }: ContentLibraryProps) {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all' as 'all' | 'lentils' | 'millets',
    status: 'all' as 'all' | 'draft' | 'published' | 'archived',
    assignment: 'all' as 'all' | 'assigned' | 'unassigned',
    featured: 'all' as 'all' | 'featured' | 'regular'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'updated_at' | 'created_at' | 'title'>('updated_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchContent();
  }, [contentType]);

  useEffect(() => {
    applyFilters();
  }, [content, searchQuery, filters, sortBy, sortOrder]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/cms/${contentType}?limit=1000`);
      const data = await response.json();
      
      if (data.success) {
        setContent(data.data[contentType]);
      }
    } catch (error) {
      console.error(`Failed to fetch ${contentType}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...content];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    // Assignment filter
    if (filters.assignment !== 'all') {
      if (filters.assignment === 'assigned') {
        filtered = filtered.filter(item => item.card_position);
      } else {
        filtered = filtered.filter(item => !item.card_position);
      }
    }

    // Featured filter (recipes only)
    if (contentType === 'recipes' && filters.featured !== 'all') {
      if (filters.featured === 'featured') {
        filtered = filtered.filter(item => item.is_featured);
      } else {
        filtered = filtered.filter(item => !item.is_featured);
      }
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (sortBy === 'title') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      } else {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredContent(filtered);
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/cms/${contentType}/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchContent();
      } else {
        alert('Failed to delete content');
      }
    } catch (error) {
      console.error('Failed to delete content:', error);
      alert('Failed to delete content');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    return category === 'lentils' 
      ? 'bg-orange-100 text-orange-800'
      : 'bg-yellow-100 text-yellow-800';
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredContent.map(item => (
        <div key={item.id} className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
          {item.hero_image_url && (
            <img
              src={item.hero_image_url}
              alt={item.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
          )}
          
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                {item.title}
              </h3>
              {item.is_featured && (
                <Star size={16} className="text-yellow-500 fill-current flex-shrink-0 ml-2" />
              )}
            </div>
            
            {item.excerpt && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {item.excerpt}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                {item.category}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                {item.status}
              </span>
              {item.card_position && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {item.card_position}
                </span>
              )}
            </div>

            {contentType === 'recipes' && (
              <div className="text-xs text-gray-500 mb-3">
                {item.prep_time && `Prep: ${item.prep_time}min`}
                {item.prep_time && item.cook_time && ' • '}
                {item.cook_time && `Cook: ${item.cook_time}min`}
                {(item.prep_time || item.cook_time) && item.servings && ' • '}
                {item.servings && `Serves ${item.servings}`}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <span>By {item.author}</span>
              <span>{formatDate(item.updated_at)}</span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex space-x-2">
                <button
                  onClick={() => onEditContent(item.id)}
                  className="flex items-center space-x-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit size={12} />
                  <span>Edit</span>
                </button>
                <button className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 rounded">
                  <Eye size={12} />
                  <span>Preview</span>
                </button>
              </div>
              <button
                onClick={() => handleDelete(item.id, item.title)}
                className="flex items-center space-x-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 size={12} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white rounded-lg border overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Card Position
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Updated
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredContent.map(item => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {item.hero_image_url && (
                    <img
                      src={item.hero_image_url}
                      alt={item.title}
                      className="w-10 h-10 rounded object-cover mr-3"
                    />
                  )}
                  <div>
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {item.title}
                      </div>
                      {item.is_featured && (
                        <Star size={14} className="text-yellow-500 fill-current ml-2" />
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      By {item.author}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                  {item.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.card_position || '—'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(item.updated_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEditContent(item.id)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit size={16} />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading {contentType}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 capitalize">
            {contentType} Library
          </h1>
          <p className="text-gray-600">
            {filteredContent.length} of {content.length} {contentType}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex rounded-lg border">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
            >
              <List size={16} />
            </button>
          </div>

          <button
            onClick={onCreateContent}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            <span>New {contentType.slice(0, -1)}</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search content..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as any }))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="lentils">Lentils</option>
              <option value="millets">Millets</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Assignment Filter */}
          <div>
            <select
              value={filters.assignment}
              onChange={(e) => setFilters(prev => ({ ...prev, assignment: e.target.value as any }))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Cards</option>
              <option value="assigned">Assigned</option>
              <option value="unassigned">Unassigned</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field as any);
                setSortOrder(order as any);
              }}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="updated_at-desc">Recently Updated</option>
              <option value="created_at-desc">Recently Created</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
            </select>
          </div>
        </div>

        {/* Featured Filter (Recipes Only) */}
        {contentType === 'recipes' && (
          <div className="mt-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Featured:</span>
              <div className="flex space-x-2">
                {(['all', 'featured', 'regular'] as const).map(option => (
                  <button
                    key={option}
                    onClick={() => setFilters(prev => ({ ...prev, featured: option }))}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      filters.featured === option
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {option === 'all' ? 'All' : option === 'featured' ? 'Featured' : 'Regular'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {filteredContent.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="text-gray-400 mb-4">
              <Filter size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {contentType} found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || Object.values(filters).some(f => f !== 'all')
                ? 'Try adjusting your search or filters'
                : `No ${contentType} have been created yet`
              }
            </p>
            {!searchQuery && Object.values(filters).every(f => f === 'all') && (
              <button
                onClick={onCreateContent}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create your first {contentType.slice(0, -1)}
              </button>
            )}
          </div>
        </div>
      ) : (
        viewMode === 'grid' ? renderGridView() : renderListView()
      )}
    </div>
  );
}