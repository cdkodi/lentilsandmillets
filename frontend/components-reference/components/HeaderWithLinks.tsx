'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import SearchBar from './SearchBar';

interface HeaderWithLinksProps {
  onSearch?: (query: string) => void;
}

export default function HeaderWithLinks({ onSearch }: HeaderWithLinksProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Home', href: '/', id: 'home' },
    { name: 'Lentils', href: '/lentils', id: 'lentils' },
    { name: 'Millets', href: '/millets', id: 'millets' },
    { name: 'Recipes', href: '/recipes', id: 'recipes' },
  ];

  // Determine active section based on current pathname
  const getActiveSection = () => {
    if (!pathname) return 'home';
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/lentils')) return 'lentils';
    if (pathname.startsWith('/millets')) return 'millets';
    if (pathname.startsWith('/recipes') || pathname.startsWith('/recipe')) return 'recipes';
    if (pathname.startsWith('/articles') || pathname.startsWith('/article')) {
      // For articles, determine based on URL or return recipes as fallback
      return 'recipes';
    }
    return 'home';
  };

  const activeSection = getActiveSection();

  const handleSearch = (query: string) => {
    console.log('Header search:', query);
    onSearch?.(query);
    // TODO: Navigate to search results page when implemented
    // For now, could redirect to recipes page or implement search results
  };

  const handleSuggestionClick = (suggestion: any) => {
    console.log('Suggestion clicked:', suggestion);
    // TODO: Handle suggestion navigation
    // This would navigate to specific article or recipe pages
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400"></div>
              <span className="hidden sm:block text-xl">
                Lentils & Millets
              </span>
              <span className="sm:hidden text-lg">
                L&M
              </span>
            </div>
          </Link>

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
              <Link
                key={item.id}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm transition-colors ${
                  activeSection === item.id
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors"
              aria-label="Toggle mobile menu"
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
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md transition-colors ${
                    activeSection === item.id
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}