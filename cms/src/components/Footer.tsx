import React from 'react'
import Link from 'next/link'

interface FooterProps {
  theme?: 'lentils' | 'millets'
}

export default function Footer({ theme = 'millets' }: FooterProps) {
  const isLentils = theme === 'lentils'
  
  const themeColors = isLentils ? {
    background: '#2C1810',
    text: '#ffffff',
    accent: '#c7511f',
    muted: '#8B4513'
  } : {
    background: '#2C1810', 
    text: '#ffffff',
    accent: '#f39c12',
    muted: '#B8860B'
  }

  return (
    <footer 
      className="py-16 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: themeColors.background }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: themeColors.accent }}
              >
                <span className="text-white font-bold text-sm">L&M</span>
              </div>
              <h3 
                className="text-lg font-semibold"
                style={{ color: themeColors.text }}
              >
                Lentils & Millets
              </h3>
            </div>
            <p 
              className="text-sm leading-relaxed mb-6"
              style={{ color: themeColors.text, opacity: 0.8 }}
            >
              Premium organic grains for modern healthy living. From quick family meals to gourmet superfood experiences.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 
              className="text-sm font-semibold mb-4 uppercase tracking-wide"
              style={{ color: themeColors.accent }}
            >
              Products
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/lentils"
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: themeColors.text, opacity: 0.8 }}
                >
                  Lentil Varieties
                </Link>
              </li>
              <li>
                <Link 
                  href="/millets"
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: themeColors.text, opacity: 0.8 }}
                >
                  Ancient Millets
                </Link>
              </li>
              <li>
                <Link 
                  href="/recipes"
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: themeColors.text, opacity: 0.8 }}
                >
                  Recipe Collection
                </Link>
              </li>
              <li>
                <Link 
                  href="/nutrition"
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: themeColors.text, opacity: 0.8 }}
                >
                  Nutrition Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 
              className="text-sm font-semibold mb-4 uppercase tracking-wide"
              style={{ color: themeColors.accent }}
            >
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/cooking-guides"
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: themeColors.text, opacity: 0.8 }}
                >
                  Cooking Guides
                </Link>
              </li>
              <li>
                <Link 
                  href="/health-benefits"
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: themeColors.text, opacity: 0.8 }}
                >
                  Health Benefits
                </Link>
              </li>
              <li>
                <Link 
                  href="/sustainability"
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: themeColors.text, opacity: 0.8 }}
                >
                  Sustainability
                </Link>
              </li>
              <li>
                <Link 
                  href="/research"
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: themeColors.text, opacity: 0.8 }}
                >
                  Research & Studies
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 
              className="text-sm font-semibold mb-4 uppercase tracking-wide"
              style={{ color: themeColors.accent }}
            >
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/about"
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: themeColors.text, opacity: 0.8 }}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact"
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: themeColors.text, opacity: 0.8 }}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  href="/careers"
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: themeColors.text, opacity: 0.8 }}
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog"
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: themeColors.text, opacity: 0.8 }}
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div 
          className="border-t pt-8"
          style={{ borderColor: themeColors.text, opacity: 0.2 }}
        >
          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div 
              className="text-sm mb-4 md:mb-0"
              style={{ color: themeColors.text, opacity: 0.6 }}
            >
              © 2024 Lentils & Millets. All rights reserved.
            </div>
            
            <div className="flex space-x-6">
              <Link 
                href="/privacy"
                className="text-sm transition-colors hover:opacity-80"
                style={{ color: themeColors.text, opacity: 0.6 }}
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms"
                className="text-sm transition-colors hover:opacity-80"
                style={{ color: themeColors.text, opacity: 0.6 }}
              >
                Terms of Service
              </Link>
              <Link 
                href="/cookies"
                className="text-sm transition-colors hover:opacity-80"
                style={{ color: themeColors.text, opacity: 0.6 }}
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}