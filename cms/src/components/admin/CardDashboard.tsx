'use client'

import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, Star } from 'lucide-react';

interface CardContent {
  id: number;
  title: string;
  slug: string;
  hero_image_url?: string;
  category: 'lentils' | 'millets';
  factoid_data?: any;
  prep_time?: number;
  cook_time?: number;
  servings?: number;
  difficulty?: string;
  is_featured?: boolean;
}

interface Card {
  position: string;
  content_type: 'article' | 'recipe' | null;
  content: CardContent | null;
}

interface CardDashboardProps {
  onCreateContent: (type: 'article' | 'recipe') => void;
  onEditContent: (type: 'article' | 'recipe', id: number) => void;
}

export default function CardDashboard({ onCreateContent, onEditContent }: CardDashboardProps) {
  const [currentPage, setCurrentPage] = useState<'home' | 'lentils' | 'millets'>('home');
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableContent, setAvailableContent] = useState<{
    articles: CardContent[];
    recipes: CardContent[];
  }>({ articles: [], recipes: [] });

  useEffect(() => {
    fetchCards();
    fetchAvailableContent();
  }, [currentPage]);

  const fetchCards = async () => {
    try {
      const response = await fetch(`/api/cms/cards?page=${currentPage}`);
      const data = await response.json();
      
      if (data.success) {
        setCards(data.data.cards);
      }
    } catch (error) {
      console.error('Failed to fetch cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableContent = async () => {
    try {
      const [articlesRes, recipesRes] = await Promise.all([
        fetch('/api/cms/articles?status=published&limit=100'),
        fetch('/api/cms/recipes?status=published&limit=100')
      ]);
      
      const articlesData = await articlesRes.json();
      const recipesData = await recipesRes.json();
      
      setAvailableContent({
        articles: articlesData.success ? articlesData.data.articles : [],
        recipes: recipesData.success ? recipesData.data.recipes : []
      });
    } catch (error) {
      console.error('Failed to fetch available content:', error);
    }
  };

  const getCardSectionInfo = (position: string) => {
    if (currentPage === 'home') {
      if (['H0', 'H1', 'H2', 'H3'].includes(position)) {
        return { section: 'Hero Section', allowedTypes: ['article', 'recipe'], allowedCategories: ['lentils', 'millets'] };
      } else if (['H4', 'H5', 'H6'].includes(position)) {
        return { section: 'Lentils Facts', allowedTypes: ['article'], allowedCategories: ['lentils'] };
      } else if (['H7', 'H8', 'H9'].includes(position)) {
        return { section: 'Lentils Collection', allowedTypes: ['article', 'recipe'], allowedCategories: ['lentils'] };
      } else if (['H10', 'H11'].includes(position)) {
        return { section: 'Featured Lentil Recipes', allowedTypes: ['recipe'], allowedCategories: ['lentils'], featuredOnly: true };
      } else if (['H12', 'H13', 'H14'].includes(position)) {
        return { section: 'Millets Facts', allowedTypes: ['article'], allowedCategories: ['millets'] };
      } else if (['H15', 'H16', 'H17'].includes(position)) {
        return { section: 'Millets Collection', allowedTypes: ['article', 'recipe'], allowedCategories: ['millets'] };
      } else if (['H18', 'H19'].includes(position)) {
        return { section: 'Featured Millet Recipes', allowedTypes: ['recipe'], allowedCategories: ['millets'], featuredOnly: true };
      }
    } else if (currentPage === 'lentils') {
      if (['L1', 'L2', 'L3'].includes(position)) {
        return { section: 'Lentils Facts', allowedTypes: ['article'], allowedCategories: ['lentils'] };
      } else if (['L4', 'L5', 'L6'].includes(position)) {
        return { section: 'Lentils Collection', allowedTypes: ['article', 'recipe'], allowedCategories: ['lentils'] };
      } else if (['L7', 'L8'].includes(position)) {
        return { section: 'Featured Recipes', allowedTypes: ['recipe'], allowedCategories: ['lentils'], featuredOnly: true };
      }
    } else if (currentPage === 'millets') {
      if (['M1', 'M2', 'M3'].includes(position)) {
        return { section: 'Millets Facts', allowedTypes: ['article'], allowedCategories: ['millets'] };
      } else if (['M4', 'M5', 'M6'].includes(position)) {
        return { section: 'Millets Collection', allowedTypes: ['article', 'recipe'], allowedCategories: ['millets'] };
      } else if (['M7', 'M8'].includes(position)) {
        return { section: 'Featured Recipes', allowedTypes: ['recipe'], allowedCategories: ['millets'], featuredOnly: true };
      }
    }
    
    return { section: 'Unknown', allowedTypes: [], allowedCategories: [] };
  };

  const getFilteredContent = (position: string) => {
    const sectionInfo = getCardSectionInfo(position);
    
    const filteredArticles = availableContent.articles.filter(article => 
      sectionInfo.allowedTypes.includes('article') && 
      sectionInfo.allowedCategories.includes(article.category) &&
      !article.card_position // Only show unassigned content
    );
    
    const filteredRecipes = availableContent.recipes.filter(recipe => 
      sectionInfo.allowedTypes.includes('recipe') && 
      sectionInfo.allowedCategories.includes(recipe.category) &&
      (!sectionInfo.featuredOnly || recipe.is_featured) &&
      !recipe.card_position // Only show unassigned content
    );
    
    return { articles: filteredArticles, recipes: filteredRecipes };
  };

  const assignContent = async (position: string, contentType: 'article' | 'recipe', contentId: number) => {
    try {
      const response = await fetch('/api/cms/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content_type: contentType,
          content_id: contentId,
          card_position: position,
          display_pages: [currentPage]
        })
      });
      
      if (response.ok) {
        fetchCards();
        fetchAvailableContent();
      }
    } catch (error) {
      console.error('Failed to assign content:', error);
    }
  };

  const unassignContent = async (position: string, contentType: 'article' | 'recipe', contentId: number) => {
    try {
      const endpoint = contentType === 'article' ? 'articles' : 'recipes';
      const response = await fetch(`/api/cms/${endpoint}/${contentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card_position: null,
          display_pages: []
        })
      });
      
      if (response.ok) {
        fetchCards();
        fetchAvailableContent();
      }
    } catch (error) {
      console.error('Failed to unassign content:', error);
    }
  };

  const renderCard = (card: Card) => {
    const sectionInfo = getCardSectionInfo(card.position);
    const filteredContent = getFilteredContent(card.position);
    
    return (
      <div key={card.position} className="bg-white rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors">
        <div className="p-4">
          {/* Card Header */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-sm text-gray-900">{card.position}</h3>
              <p className="text-xs text-gray-500">{sectionInfo.section}</p>
            </div>
            <div className="flex items-center space-x-1">
              {sectionInfo.featuredOnly && <Star size={14} className="text-yellow-500" />}
              <span className={`px-2 py-1 rounded-full text-xs ${
                card.content 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {card.content ? 'Assigned' : 'Empty'}
              </span>
            </div>
          </div>

          {/* Card Content */}
          {card.content ? (
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                {card.content.hero_image_url && (
                  <img 
                    src={card.content.hero_image_url} 
                    alt={card.content.title}
                    className="w-12 h-12 rounded object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-gray-900 truncate">
                    {card.content.title}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      card.content.category === 'lentils' 
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {card.content.category}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">
                      {card.content_type}
                    </span>
                    {card.content.is_featured && (
                      <Star size={12} className="text-yellow-500 fill-current" />
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEditContent(card.content_type!, card.content!.id)}
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
                  onClick={() => unassignContent(card.position, card.content_type!, card.content!.id)}
                  className="flex items-center space-x-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={12} />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Empty State */}
              <div className="text-center py-4 border-2 border-dashed border-gray-200 rounded">
                <Plus size={20} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">No content assigned</p>
              </div>

              {/* Content Assignment */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-700">Assign Content:</p>
                
                {/* Available Articles */}
                {filteredContent.articles.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Articles:</p>
                    <select 
                      className="w-full text-xs border rounded px-2 py-1"
                      onChange={(e) => {
                        if (e.target.value) {
                          assignContent(card.position, 'article', parseInt(e.target.value));
                          e.target.value = '';
                        }
                      }}
                    >
                      <option value="">Select article...</option>
                      {filteredContent.articles.map(article => (
                        <option key={article.id} value={article.id}>
                          {article.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Available Recipes */}
                {filteredContent.recipes.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Recipes:</p>
                    <select 
                      className="w-full text-xs border rounded px-2 py-1"
                      onChange={(e) => {
                        if (e.target.value) {
                          assignContent(card.position, 'recipe', parseInt(e.target.value));
                          e.target.value = '';
                        }
                      }}
                    >
                      <option value="">Select recipe...</option>
                      {filteredContent.recipes.map(recipe => (
                        <option key={recipe.id} value={recipe.id}>
                          {recipe.title} {recipe.is_featured ? '⭐' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* No available content */}
                {filteredContent.articles.length === 0 && filteredContent.recipes.length === 0 && (
                  <div className="text-center py-2">
                    <p className="text-xs text-gray-500 mb-2">No available content</p>
                    <button
                      onClick={() => onCreateContent(sectionInfo.allowedTypes[0] as 'article' | 'recipe')}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Create new {sectionInfo.allowedTypes[0]}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading card dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Card Dashboard</h1>
          <p className="text-gray-600">Manage content assignments across all pages</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            {(['home', 'lentils', 'millets'] as const).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {page.charAt(0).toUpperCase() + page.slice(1)} Page
              </button>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onCreateContent('article')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              <span>New Article</span>
            </button>
            <button
              onClick={() => onCreateContent('recipe')}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus size={16} />
              <span>New Recipe</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map(renderCard)}
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Page Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {cards.filter(c => c.content).length}
            </div>
            <div className="text-sm text-gray-600">Assigned Cards</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-400">
              {cards.filter(c => !c.content).length}
            </div>
            <div className="text-sm text-gray-600">Empty Cards</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {cards.filter(c => c.content_type === 'article').length}
            </div>
            <div className="text-sm text-gray-600">Articles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {cards.filter(c => c.content_type === 'recipe').length}
            </div>
            <div className="text-sm text-gray-600">Recipes</div>
          </div>
        </div>
      </div>
    </div>
  );
}