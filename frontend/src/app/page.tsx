'use client'

import HeroSection from '@/components/HeroSection';
import LentilsSection from '@/components/LentilsSection';
import MilletsSection from '@/components/MilletsSection';
import FactoidsSection from '@/components/FactoidsSection';

export default function HomePage() {
  // Dummy handlers for components that expect navigation functions
  const handleNavigation = (section: string, data?: any) => {
    console.log('Navigation requested:', section, data);
    // This will be handled by Next.js routing instead of client-side state
  };

  const handleSearch = (query: string) => {
    console.log('Search requested:', query);
    // TODO: Implement search functionality
  };

  return (
    <div className="min-h-screen">
      <HeroSection onNavigate={handleNavigation} onSearch={handleSearch} />
      <FactoidsSection category="lentils" onNavigate={handleNavigation} />
      <LentilsSection onNavigate={handleNavigation} onSearch={handleSearch} />
      <FactoidsSection category="millets" onNavigate={handleNavigation} />
      <MilletsSection onNavigate={handleNavigation} onSearch={handleSearch} />
      
      {/* Footer */}
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
                <li><a href="/lentils" className="hover:text-white transition-colors">Lentils Collection</a></li>
                <li><a href="/millets" className="hover:text-white transition-colors">Millets Collection</a></li>
                <li><a href="/recipes" className="hover:text-white transition-colors">All Recipes</a></li>
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
    </div>
  );
}