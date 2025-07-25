'use client'

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import SearchBar from './SearchBar';

interface HeaderProps {
  currentSection?: 'home' | 'lentils' | 'millets' | 'recipes' | 'recipe' | 'article';
  onNavigate?: (section: string) => void;
  onSearch?: (query: string) => void;
}

export default function Header({ currentSection = 'home', onNavigate, onSearch }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', id: 'home' },
    { name: 'Lentils', id: 'lentils' },
    { name: 'Millets', id: 'millets' },
    { name: 'Recipes', id: 'recipes' },
  ];

  // Determine active section for navigation highlighting
  const getActiveSection = () => {
    if (currentSection === 'recipe' || currentSection === 'article') {
      return 'recipes'; // Treat recipe and article pages as part of recipes section
    }
    return currentSection;
  };

  const handleSearch = (query: string) => {
    console.log('Header search:', query);
    onSearch?.(query);
    // Navigate to search results page
    onNavigate?.('recipes'); // For now, redirect to recipes page
  };

  const handleSuggestionClick = (suggestion: any) => {
    console.log('Suggestion clicked:', suggestion);
    // Navigate based on suggestion type
    if (suggestion.type === 'recipe') {
      onNavigate?.('recipes');
    } else if (suggestion.type === 'article') {
      onNavigate?.(suggestion.category || 'home');
    } else {
      onNavigate?.(suggestion.category || 'home');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate?.('home')}>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400"></div>
              <span className="hidden sm:block text-xl">
                Lentils & Millets
              </span>
              <span className="sm:hidden text-lg">
                L&M
              </span>
            </div>
          </div>

          {/* Desktop Search & Navigation */}
          <div className="hidden lg:flex items-center space-x-8 flex-1 max-w-2xl mx-8">
            <SearchBar
              variant="header"
              theme="neutral"
              placeholder="Search recipes, varieties, nutrition..."
              onSearch={handleSearch}
              onSuggestionClick={handleSuggestionClick}
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate?.(item.id)}
                className={`px-3 py-2 rounded-md text-sm transition-colors ${
                  getActiveSection() === item.id
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-orange-600 hover:bg-orange-50"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            {/* Mobile Search */}
            <div className="p-4 border-b border-gray-100">
              <SearchBar
                variant="section"
                theme="neutral"
                placeholder="Search..."
                onSearch={handleSearch}
                onSuggestionClick={handleSuggestionClick}
              />
            </div>

            {/* Mobile Menu Items */}
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate?.(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                    getActiveSection() === item.id
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}