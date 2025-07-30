'use client'

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import CardDashboard from '@/components/admin/CardDashboard';
import ArticleForm from '@/components/admin/ArticleForm';
import RecipeForm from '@/components/admin/RecipeForm';
import ContentLibrary from '@/components/admin/ContentLibrary';

export default function CMSPage() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [editingContent, setEditingContent] = useState<{
    type: 'article' | 'recipe';
    id?: number;
  } | null>(null);

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    setEditingContent(null);
  };

  const handleCreateContent = (type: 'article' | 'recipe') => {
    setEditingContent({ type });
    setCurrentPage(type === 'article' ? 'articles' : 'recipes');
  };

  const handleEditContent = (type: 'article' | 'recipe', id: number) => {
    setEditingContent({ type, id });
    setCurrentPage(type === 'article' ? 'articles' : 'recipes');
  };

  const handleSaveArticle = async (articleData: any) => {
    try {
      const endpoint = articleData.id ? `/api/cms/articles/${articleData.id}` : '/api/cms/articles';
      const method = articleData.id ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData)
      });
      
      if (response.ok) {
        // Success - go back to dashboard
        setCurrentPage('dashboard');
        setEditingContent(null);
      } else {
        const error = await response.json();
        alert(`Failed to save article: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to save article:', error);
      alert('Failed to save article. Please try again.');
    }
  };

  const handleSaveRecipe = async (recipeData: any) => {
    try {
      const endpoint = recipeData.id ? `/api/cms/recipes/${recipeData.id}` : '/api/cms/recipes';
      const method = recipeData.id ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeData)
      });
      
      if (response.ok) {
        // Success - go back to dashboard
        setCurrentPage('dashboard');
        setEditingContent(null);
      } else {
        const error = await response.json();
        alert(`Failed to save recipe: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to save recipe:', error);
      alert('Failed to save recipe. Please try again.');
    }
  };

  const handleCancelForm = () => {
    setEditingContent(null);
    setCurrentPage('dashboard');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <CardDashboard 
            onCreateContent={handleCreateContent}
            onEditContent={handleEditContent}
          />
        );
      
      case 'articles':
        return editingContent?.type === 'article' ? (
          <ArticleForm
            articleId={editingContent.id}
            onSave={handleSaveArticle}
            onCancel={handleCancelForm}
          />
        ) : (
          <ContentLibrary
            contentType="articles"
            onCreateContent={() => handleCreateContent('article')}
            onEditContent={(id) => handleEditContent('article', id)}
          />
        );
      
      case 'recipes':
        return editingContent?.type === 'recipe' ? (
          <RecipeForm
            recipeId={editingContent.id}
            onSave={handleSaveRecipe}
            onCancel={handleCancelForm}
          />
        ) : (
          <ContentLibrary
            contentType="recipes"
            onCreateContent={() => handleCreateContent('recipe')}
            onEditContent={(id) => handleEditContent('recipe', id)}
          />
        );
      
      case 'analytics':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600">Content performance and engagement metrics</p>
            </div>
            
            <div className="bg-white rounded-lg border p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600 mb-4">Content performance tracking coming soon</p>
              <div className="text-sm text-gray-500">
                Future features:
                <ul className="mt-2 space-y-1">
                  <li>• Card engagement metrics</li>
                  <li>• Content popularity rankings</li>
                  <li>• User interaction heatmaps</li>
                  <li>• A/B testing results</li>
                </ul>
              </div>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">System configuration and preferences</p>
            </div>
            
            <div className="bg-white rounded-lg border p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">System Settings</h3>
              <p className="text-gray-600 mb-4">Configuration options coming soon</p>
              <div className="text-sm text-gray-500">
                Future settings:
                <ul className="mt-2 space-y-1">
                  <li>• User management</li>
                  <li>• Content approval workflows</li>
                  <li>• SEO defaults</li>
                  <li>• Cache management</li>
                </ul>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <AdminLayout currentPage={currentPage} onNavigate={handleNavigation}>
      {renderContent()}
    </AdminLayout>
  );
}