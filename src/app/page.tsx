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
      <HeroSection 
        onNavigate={handleNavigation}
        onSearch={handleSearch}
      />
      <LentilsSection />
      <MilletsSection />
      <FactoidsSection category="lentils" />
    </main>
  )
}