'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, TrendingUp, Book, Utensils, Leaf } from 'lucide-react';

interface SearchSuggestion {
  id: string;
  title: string;
  type: 'recipe' | 'article' | 'variety' | 'nutrition';
  category?: 'lentils' | 'millets';
  image?: string;
}

interface SearchBarProps {
  variant?: 'header' | 'hero' | 'section';
  theme?: 'lentils' | 'millets' | 'neutral';
  placeholder?: string;
  onSearch?: (query: string) => void;
  onSuggestionClick?: (suggestion: SearchSuggestion) => void;
  className?: string;
}

export default function SearchBar({ 
  variant = 'header', 
  theme = 'neutral',
  placeholder = "Search recipes, varieties, or nutrition info...",
  onSearch,
  onSuggestionClick,
  className = ""
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock suggestions - in real app, this would come from API
  const mockSuggestions: SearchSuggestion[] = [
    {
      id: '1',
      title: 'Red Lentil Curry Recipe',
      type: 'recipe',
      category: 'lentils',
      image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    },
    {
      id: '2',
      title: 'Pearl Millet Nutrition Facts',
      type: 'article',
      category: 'millets',
      image: 'https://images.unsplash.com/photo-1603833797131-3d9e8cff5058?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    },
    {
      id: '3',
      title: 'Black Beluga Lentils',
      type: 'variety',
      category: 'lentils'
    },
    {
      id: '4',
      title: 'High Protein Foods',
      type: 'nutrition'
    },
    {
      id: '5',
      title: 'Millet Breakfast Bowl',
      type: 'recipe',
      category: 'millets',
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    }
  ];

  const getThemeColors = () => {
    if (theme === 'lentils') {
      return {
        primary: 'var(--color-lentils-primary)',
        secondary: 'var(--color-lentils-secondary)',
        background: 'var(--color-lentils-background)',
        muted: 'var(--color-lentils-muted)'
      };
    } else if (theme === 'millets') {
      return {
        primary: 'var(--color-millets-primary)',
        secondary: 'var(--color-millets-secondary)',
        background: 'var(--color-millets-background)',
        muted: 'var(--color-millets-muted)'
      };
    }
    return {
      primary: '#e67e22',
      secondary: '#f39c12',
      background: '#ffffff',
      muted: '#f8f9fa'
    };
  };

  const themeColors = getThemeColors();

  const getVariantStyles = () => {
    switch (variant) {
      case 'header':
        return {
          container: 'w-full max-w-md',
          input: 'h-10 px-4 text-sm',
          dropdown: 'mt-2'
        };
      case 'hero':
        return {
          container: 'w-full max-w-2xl',
          input: 'h-14 px-6 text-lg',
          dropdown: 'mt-4'
        };
      case 'section':
        return {
          container: 'w-full max-w-lg',
          input: 'h-12 px-5 text-base',
          dropdown: 'mt-3'
        };
      default:
        return {
          container: 'w-full max-w-md',
          input: 'h-10 px-4 text-sm',
          dropdown: 'mt-2'
        };
    }
  };

  const styles = getVariantStyles();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'recipe': return <Utensils size={16} />;
      case 'article': return <Book size={16} />;
      case 'variety': return <Leaf size={16} />;
      case 'nutrition': return <TrendingUp size={16} />;
      default: return <Search size={16} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'recipe': return 'Recipe';
      case 'article': return 'Article';
      case 'variety': return 'Variety';
      case 'nutrition': return 'Nutrition';
      default: return '';
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      // Filter suggestions based on query
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.title.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setIsOpen(false);
    onSearch?.(searchQuery);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title);
    setIsOpen(false);
    onSuggestionClick?.(suggestion);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className={`relative ${styles.container} ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search size={variant === 'hero' ? 20 : 16} className="text-gray-400" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(query);
            }
          }}
          placeholder={placeholder}
          className={`
            ${styles.input}
            w-full pl-12 pr-12 
            bg-white/90 backdrop-blur-sm 
            border border-gray-200 
            rounded-full 
            focus:outline-none focus:ring-2 focus:border-transparent
            transition-all duration-200
            placeholder:text-gray-400
          `}
          style={{
            '--tw-ring-color': themeColors.primary
          } as React.CSSProperties}
        />

        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
          >
            <X size={variant === 'hero' ? 20 : 16} />
          </button>
        )}
      </div>

      {/* Search Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div 
          className={`
            absolute left-0 right-0 ${styles.dropdown}
            bg-white/95 backdrop-blur-sm 
            border border-gray-200 
            rounded-2xl 
            shadow-2xl 
            overflow-hidden 
            z-50
          `}
        >
          <div className="p-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
              >
                {suggestion.image ? (
                  <img 
                    src={suggestion.image} 
                    alt={suggestion.title}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: themeColors.muted }}
                  >
                    {getTypeIcon(suggestion.type)}
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{suggestion.title}</div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{getTypeLabel(suggestion.type)}</span>
                    {suggestion.category && (
                      <>
                        <span>•</span>
                        <span className="capitalize">{suggestion.category}</span>
                      </>
                    )}
                  </div>
                </div>

                <Search size={14} className="text-gray-300 flex-shrink-0" />
              </button>
            ))}
          </div>

          {/* View All Results */}
          <div className="border-t border-gray-100 p-2">
            <button
              onClick={() => handleSearch(query)}
              className="w-full p-3 text-sm text-center text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
            >
              View all results for &quot;{query}&quot;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}