'use client'

import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { processCustomMarkdown } from '../lib/markdown-processor';

// Interface for articles with markdown content (from CMS database)
interface MarkdownArticle {
  id: number;
  title: string;
  slug: string;
  content: string; // Plain markdown text
  excerpt?: string;
  author: string;
  category: 'lentils' | 'millets';
  hero_image_url?: string;
  featured_image?: {
    url: string;
    alt: string;
  };
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

// Interface for structured articles (legacy format)
interface StructuredArticle {
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

interface ArticleRendererProps {
  article: MarkdownArticle | StructuredArticle;
  onNavigate?: (section: string, data?: any) => void;
}

// Type guard to check if article is markdown-based
function isMarkdownArticle(article: MarkdownArticle | StructuredArticle): article is MarkdownArticle {
  return typeof (article as MarkdownArticle).content === 'string';
}

export default function ArticleRenderer({ article, onNavigate }: ArticleRendererProps) {
  const isLentils = article.category === 'lentils';
  
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

  // Process content based on article type
  const processedContent = React.useMemo(() => {
    if (isMarkdownArticle(article)) {
      // Process markdown with custom extensions
      return processCustomMarkdown(article.content);
    } else {
      // Handle structured content (legacy format)
      return null;
    }
  }, [article]);

  // Get hero image URL
  const heroImageUrl = isMarkdownArticle(article) 
    ? article.hero_image_url || article.featured_image?.url
    : (article as StructuredArticle).heroImage;

  // Get formatted date
  const formattedDate = isMarkdownArticle(article)
    ? new Date(article.created_at).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : (article as StructuredArticle).publishDate;

  // Calculate estimated read time for markdown articles
  const estimatedReadTime = isMarkdownArticle(article)
    ? `${Math.ceil(article.content.split(' ').length / 200)} min read`
    : (article as StructuredArticle).readTime;

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: themeColors.background, color: themeColors.text }}>
      {/* Hero Section */}
      <div className="relative h-96 md:h-[32rem]">
        {heroImageUrl && (
          <ImageWithFallback
            src={heroImageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        )}
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
              {article.title}
            </h1>
            
            {!isMarkdownArticle(article) && article.subtitle && (
              <p className="text-lg md:text-xl text-white/90 mb-6 max-w-3xl">
                {article.subtitle}
              </p>
            )}

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
              <div className="flex items-center space-x-2">
                <User size={14} />
                <span>By {article.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock size={14} />
                <span>{estimatedReadTime}</span>
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
        </div>

        {/* Content Rendering */}
        {isMarkdownArticle(article) ? (
          // Render processed markdown content
          <div 
            className="prose prose-lg max-w-none article-content"
            style={{ color: themeColors.text }}
            dangerouslySetInnerHTML={{ __html: processedContent || '' }}
          />
        ) : (
          // Render structured content (legacy format)
          <div className="space-y-8">
            {/* Introduction */}
            <div className="mb-12">
              <p className="text-lg md:text-xl leading-relaxed" style={{ color: themeColors.text }}>
                {article.content.introduction}
              </p>
            </div>

            {/* Article Sections */}
            <div className="space-y-16">
              {article.content.sections.map((section, index) => (
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
                {article.content.conclusion}
              </p>
            </div>
          </div>
        )}

        {/* Author Bio - only show for structured articles */}
        {!isMarkdownArticle(article) && (
          <div className="mt-16 p-8 rounded-2xl" style={{ backgroundColor: themeColors.muted }}>
            <div className="flex items-start space-x-4">
              {article.authorImage && (
                <ImageWithFallback
                  src={article.authorImage}
                  alt={article.author}
                  className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                />
              )}
              <div>
                <h4 className="mb-2">{article.author}</h4>
                <p className="text-sm opacity-80 leading-relaxed">
                  Expert in nutritional science and sustainable agriculture.
                </p>
              </div>
            </div>
          </div>
        )}

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