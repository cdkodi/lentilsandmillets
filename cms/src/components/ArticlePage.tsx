'use client'

import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowLeft, Clock, User, Share2, Bookmark, Eye, Calendar } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  authorImage?: string;
  publishDate: string;
  readTime: string;
  views: string;
  category: 'lentils' | 'millets';
  heroImage: string;
  content: {
    introduction: string;
    sections: {
      heading: string;
      content: string;
      image?: string;
    }[];
    conclusion: string;
  };
  tags: string[];
  relatedArticles?: string[];
}

interface ArticlePageProps {
  article?: Article;
  onNavigate?: (section: string, data?: any) => void;
}

export default function ArticlePage({ article, onNavigate }: ArticlePageProps) {
  // Default Pearl Millet article for demo
  const defaultArticle: Article = {
    id: 'pearl-millet-complete-guide',
    title: 'Pearl Millet: The Drought-Resistant Superfood Transforming Modern Nutrition',
    subtitle: 'From ancient Saharan fields to contemporary kitchens: understanding the science behind this remarkable grain',
    author: 'Dr. Sarah Chen',
    authorImage: 'https://images.unsplash.com/photo-1494790108755-2616b79a8c29?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&face&q=80',
    publishDate: 'January 15, 2025',
    readTime: '8 min read',
    views: '2.4k views',
    category: 'millets',
    heroImage: 'https://images.unsplash.com/photo-1603833797131-3d9e8cff5058?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    content: {
      introduction: "Pearl millet (Pennisetum glaucum) stands as one of humanity's most resilient crops, thriving in environments where other grains fail. This ancient grain, cultivated for over 4,000 years in the arid regions of Africa and Asia, is experiencing a renaissance in modern nutrition science for its exceptional drought tolerance and remarkable nutritional profile.",
      sections: [
        {
          heading: "Nutritional Powerhouse",
          content: "Pearl millet contains 11-14% protein, significantly higher than rice or wheat. It's rich in essential amino acids, particularly lysine, and provides substantial amounts of iron, zinc, and B-vitamins. The high fiber content (1.2g per 100g) supports digestive health, while its low glycemic index makes it ideal for managing blood sugar levels.",
          image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
          heading: "Climate Resilience and Sustainability",
          content: "What sets pearl millet apart is its extraordinary ability to grow in marginal lands with minimal water requirements—as little as 200mm of rainfall annually. This drought tolerance, combined with its ability to withstand temperatures up to 46°C, makes it a crucial crop for climate adaptation strategies worldwide.",
          image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
          heading: "Culinary Applications and Modern Adaptations",
          content: "Traditional preparations include flatbreads, porridges, and fermented beverages. Modern culinary applications have expanded to include pearl millet flour in gluten-free baking, breakfast cereals, and even craft brewing. Its mild, slightly nutty flavor profile makes it versatile for both sweet and savory applications.",
          image: "https://images.unsplash.com/photo-1631515242350-76d3a9c87013?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
      ],
      conclusion: "As we face increasing climate challenges and growing nutritional awareness, pearl millet represents both ancient wisdom and future innovation. Its combination of resilience, nutrition, and culinary versatility positions it as a key player in sustainable food systems worldwide."
    },
    tags: ['Pearl Millet', 'Sustainable Agriculture', 'Gluten-Free', 'Climate Resilience', 'Ancient Grains'],
    relatedArticles: ['finger-millet-benefits', 'millet-recipes-collection', 'sustainable-farming-practices']
  };

  const currentArticle = article || defaultArticle;
  const isLentils = currentArticle.category === 'lentils';
  
  const themeColors = isLentils ? {
    primary: 'var(--color-lentils-primary)',
    secondary: 'var(--color-lentils-secondary)',
    background: 'var(--color-lentils-background)',
    text: 'var(--color-lentils-text)',
    muted: 'var(--color-lentils-muted)',
    accent: 'var(--color-lentils-accent)'
  } : {
    primary: 'var(--color-millets-primary)',
    secondary: 'var(--color-millets-secondary)',
    background: 'var(--color-millets-background)',
    text: 'var(--color-millets-text)',
    muted: 'var(--color-millets-muted)',
    accent: 'var(--color-millets-accent)'
  };

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: themeColors.background, color: themeColors.text }}>
      {/* Hero Section */}
      <div className="relative h-96 md:h-[32rem]">
        <ImageWithFallback
          src={currentArticle.heroImage}
          alt={currentArticle.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        {/* Back Button */}
        <button
          onClick={() => onNavigate?.(isLentils ? 'lentils' : 'millets')}
          className="absolute top-6 left-6 bg-white/10 backdrop-blur-md rounded-full p-3 text-white hover:bg-white/20 transition-colors border border-white/20"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Article Header */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block px-3 py-1 rounded-full text-xs mb-4" style={{ backgroundColor: themeColors.primary, color: 'white' }}>
              {isLentils ? 'LENTILS' : 'MILLETS'} • NUTRITION SCIENCE
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl text-white mb-4 leading-tight">
              {currentArticle.title}
            </h1>
            
            {currentArticle.subtitle && (
              <p className="text-lg md:text-xl text-white/90 mb-6 max-w-3xl">
                {currentArticle.subtitle}
              </p>
            )}

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
              <div className="flex items-center space-x-2">
                {currentArticle.authorImage && (
                  <ImageWithFallback
                    src={currentArticle.authorImage}
                    alt={currentArticle.author}
                    className="w-8 h-8 rounded-full border-2 border-white/30"
                  />
                )}
                <span>By {currentArticle.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>{currentArticle.publishDate}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock size={14} />
                <span>{currentArticle.readTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye size={14} />
                <span>{currentArticle.views}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-12 pb-6 border-b" style={{ borderColor: themeColors.muted }}>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 rounded-full transition-colors" style={{ backgroundColor: themeColors.muted, color: themeColors.text }}>
              <Bookmark size={16} />
              <span className="text-sm">Save</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 rounded-full transition-colors" style={{ backgroundColor: themeColors.muted, color: themeColors.text }}>
              <Share2 size={16} />
              <span className="text-sm">Share</span>
            </button>
          </div>
          
          {/* Reading Progress */}
          <div className="hidden md:flex items-center space-x-2 text-sm opacity-70">
            <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="w-1/3 h-full rounded-full" style={{ backgroundColor: themeColors.primary }}></div>
            </div>
            <span>3 min left</span>
          </div>
        </div>

        {/* Introduction */}
        <div className="mb-12">
          <p className="text-lg md:text-xl leading-relaxed" style={{ color: themeColors.text }}>
            {currentArticle.content.introduction}
          </p>
        </div>

        {/* Article Sections */}
        <div className="space-y-16">
          {currentArticle.content.sections.map((section, index) => (
            <section key={index} className="space-y-6">
              <h2 className="text-2xl md:text-3xl" style={{ color: themeColors.primary }}>
                {section.heading}
              </h2>
              
              <div className="grid md:grid-cols-12 gap-8">
                <div className={`${section.image ? 'md:col-span-7' : 'md:col-span-12'} space-y-4`}>
                  <p className="text-lg leading-relaxed">
                    {section.content}
                  </p>
                </div>
                
                {section.image && (
                  <div className="md:col-span-5">
                    <div className="sticky top-24">
                      <ImageWithFallback
                        src={section.image}
                        alt={section.heading}
                        className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-lg"
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>

        {/* Conclusion */}
        <div className="mt-16 pt-12 border-t" style={{ borderColor: themeColors.muted }}>
          <h2 className="text-2xl md:text-3xl mb-6" style={{ color: themeColors.primary }}>
            Looking Forward
          </h2>
          <p className="text-lg leading-relaxed mb-8">
            {currentArticle.content.conclusion}
          </p>
        </div>

        {/* Tags */}
        <div className="mt-12 pt-8 border-t" style={{ borderColor: themeColors.muted }}>
          <h3 className="mb-4 opacity-70">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {currentArticle.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm transition-colors cursor-pointer hover:opacity-80"
                style={{ backgroundColor: themeColors.muted, color: themeColors.text }}
              >
                #{tag.toLowerCase().replace(/\s+/g, '')}
              </span>
            ))}
          </div>
        </div>

        {/* Author Bio */}
        <div className="mt-16 p-8 rounded-2xl" style={{ backgroundColor: themeColors.muted }}>
          <div className="flex items-start space-x-4">
            {currentArticle.authorImage && (
              <ImageWithFallback
                src={currentArticle.authorImage}
                alt={currentArticle.author}
                className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
              />
            )}
            <div>
              <h4 className="mb-2">{currentArticle.author}</h4>
              <p className="text-sm opacity-80 leading-relaxed">
                Dr. Sarah Chen is a nutritional biochemist specializing in ancient grains and sustainable agriculture. 
                She has published over 50 research papers on crop resilience and nutritional optimization.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <button
            onClick={() => onNavigate?.(isLentils ? 'lentils' : 'millets')}
            className="px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105"
            style={{ 
              backgroundColor: themeColors.primary, 
              color: 'white' 
            }}
          >
            Explore More {isLentils ? 'Lentil' : 'Millet'} Articles
          </button>
        </div>
      </div>
    </div>
  );
}