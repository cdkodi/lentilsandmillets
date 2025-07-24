import React, { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import LentilsSection from './components/LentilsSection';
import MilletsSection from './components/MilletsSection';
import RecipePage from './components/RecipePage';
import ArticlePage from './components/ArticlePage';
import FactoidsSection from './components/FactoidsSection';

type Section = 'home' | 'lentils' | 'millets' | 'recipes' | 'recipe' | 'article';

interface Recipe {
  id: string;
  title: string;
  image: string;
  time: string;
  serves: string;
  rating: number;
  type: 'lentils' | 'millets';
}

interface Article {
  id: string;
  title: string;
  category: 'lentils' | 'millets';
  author: string;
  publishDate: string;
  readTime: string;
  views: string;
  heroImage: string;
  content: {
    introduction: string;
    sections: Array<{
      heading: string;
      content: string;
      image?: string;
    }>;
    conclusion: string;
  };
  tags: string[];
}

export default function App() {
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleNavigation = (section: string, data?: any) => {
    if (section === 'recipe' && data) {
      setSelectedRecipe(data);
      setSelectedArticle(null);
      setCurrentSection('recipe');
    } else if (section === 'article' && data) {
      setSelectedArticle(data);
      setSelectedRecipe(null);
      setCurrentSection('article');
    } else {
      setCurrentSection(section as Section);
      setSelectedRecipe(null);
      setSelectedArticle(null);
    }

    // Smooth scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Global search query:', query);
    
    // For demo purposes, navigate to recipes page with search
    // In a real app, this would trigger search results
    handleNavigation('recipes');
    
    // You could implement search results state here
    // setSearchResults(filteredResults);
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return (
          <>
            <HeroSection onNavigate={handleNavigation} onSearch={handleSearch} />
            <FactoidsSection category="lentils" onNavigate={handleNavigation} />
            <LentilsSection onNavigate={handleNavigation} onSearch={handleSearch} />
            <FactoidsSection category="millets" onNavigate={handleNavigation} />
            <MilletsSection onNavigate={handleNavigation} onSearch={handleSearch} />
          </>
        );
      case 'lentils':
        return (
          <>
            <FactoidsSection category="lentils" onNavigate={handleNavigation} />
            <LentilsSection onNavigate={handleNavigation} onSearch={handleSearch} />
          </>
        );
      case 'millets':
        return (
          <>
            <FactoidsSection category="millets" onNavigate={handleNavigation} />
            <MilletsSection onNavigate={handleNavigation} onSearch={handleSearch} />
          </>
        );
      case 'recipes':
        return (
          <>
            {searchQuery && (
              <div className="pt-20 pb-8 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center">
                    <h2 className="text-2xl mb-2">Search Results</h2>
                    <p className="text-gray-600">
                      Showing results for "{searchQuery}"
                    </p>
                  </div>
                </div>
              </div>
            )}
            <LentilsSection onNavigate={handleNavigation} onSearch={handleSearch} />
            <MilletsSection onNavigate={handleNavigation} onSearch={handleSearch} />
          </>
        );
      case 'recipe':
        return <RecipePage recipe={selectedRecipe} onNavigate={handleNavigation} />;
      case 'article':
        return <ArticlePage article={selectedArticle} onNavigate={handleNavigation} />;
      default:
        return <HeroSection onNavigate={handleNavigation} onSearch={handleSearch} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Header 
        currentSection={currentSection} 
        onNavigate={handleNavigation}
        onSearch={handleSearch}
      />
      <main>
        {renderSection()}
      </main>
      
      {/* Footer */}
      {!['recipe', 'article'].includes(currentSection) && (
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400"></div>
                  <span className="text-xl">Lentils & Millets</span>
                </div>
                <p className="text-gray-400 mb-4">
                  Premium organic lentils and ancient millets for modern healthy living. 
                  Sourced directly from sustainable farms, crafted for your kitchen.
                </p>
              </div>
              
              <div>
                <h4 className="mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><button onClick={() => handleNavigation('lentils')} className="hover:text-white transition-colors">Lentils Collection</button></li>
                  <li><button onClick={() => handleNavigation('millets')} className="hover:text-white transition-colors">Millets Collection</button></li>
                  <li><button onClick={() => handleNavigation('recipes')} className="hover:text-white transition-colors">All Recipes</button></li>
                </ul>
              </div>
              
              <div>
                <h4 className="mb-4">Learn More</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Nutrition Science</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Sustainable Farming</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Health Benefits</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Research Articles</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2025 Lentils & Millets. All rights reserved. Crafted with care for healthy living.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}