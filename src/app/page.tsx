'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import LentilsSection from '@/components/LentilsSection'
import MilletsSection from '@/components/MilletsSection'
import FactoidsSection from '@/components/FactoidsSection'

export default function HomePage() {
  const [currentSection, setCurrentSection] = useState<'home' | 'lentils' | 'millets' | 'recipes'>('home')
  const [searchQuery, setSearchQuery] = useState('')

  const handleNavigation = (section: string) => {
    setCurrentSection(section as 'home' | 'lentils' | 'millets' | 'recipes')
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentSection('recipes') // Navigate to search results
  }

  return (
    <main className="min-h-screen">
      <Header 
        currentSection={currentSection}
        onNavigate={handleNavigation}
        onSearch={handleSearch}
      />
      {currentSection === 'home' && (
        <>
          <HeroSection 
            onNavigate={handleNavigation}
            onSearch={handleSearch}
          />
          <LentilsSection />
          <MilletsSection />
          <FactoidsSection category="lentils" />
        </>
      )}
      {currentSection === 'lentils' && <LentilsSection />}
      {currentSection === 'millets' && <MilletsSection />}
      {currentSection === 'recipes' && (
        <div className="min-h-screen pt-16 px-4">
          <div className="max-w-4xl mx-auto text-center py-20">
            <h2 className="text-3xl font-bold mb-4">Recipes Coming Soon</h2>
            <p className="text-gray-600">We&apos;re working on bringing you amazing recipes!</p>
          </div>
        </div>
      )}
    </main>
  )
}