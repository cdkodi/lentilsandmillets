import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { TrendingUp, Droplets, Thermometer, Clock, Star, Leaf, Shield } from 'lucide-react';

interface Factoid {
  id: string;
  title: string;
  category: 'lentils' | 'millets';
  image: string;
  icon: 'protein' | 'water' | 'climate' | 'cooking' | 'nutrition' | 'sustainability' | 'health';
  stats: {
    primary: { value: string; label: string; };
    secondary: { value: string; label: string; };
  };
  highlights: string[];
  bgGradient?: string;
}

interface FactoidCardProps {
  factoid: Factoid;
  onClick?: (factoid: Factoid) => void;
}

const iconMap = {
  protein: TrendingUp,
  water: Droplets,
  climate: Thermometer,
  cooking: Clock,
  nutrition: Star,
  sustainability: Leaf,
  health: Shield
};

export default function FactoidCard({ factoid, onClick }: FactoidCardProps) {
  const Icon = iconMap[factoid.icon];
  const isLentils = factoid.category === 'lentils';
  
  const themeColors = isLentils ? {
    primary: 'var(--color-lentils-primary)',
    secondary: 'var(--color-lentils-secondary)',
    accent: 'var(--color-lentils-accent)',
    muted: 'var(--color-lentils-muted)',
    text: 'var(--color-lentils-text)'
  } : {
    primary: 'var(--color-millets-primary)',
    secondary: 'var(--color-millets-secondary)',
    accent: 'var(--color-millets-accent)',
    muted: 'var(--color-millets-muted)',
    text: 'var(--color-millets-text)'
  };

  const defaultGradient = isLentils 
    ? 'linear-gradient(135deg, rgba(199, 81, 31, 0.1) 0%, rgba(184, 134, 11, 0.1) 100%)'
    : 'linear-gradient(135deg, rgba(243, 156, 18, 0.1) 0%, rgba(230, 126, 34, 0.1) 100%)';

  return (
    <div
      className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-white h-full flex flex-col"
      style={{ 
        background: factoid.bgGradient || defaultGradient,
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        minHeight: '420px' // Ensure consistent minimum height
      }}
      onClick={() => onClick?.(factoid)}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 80% 20%, ${themeColors.primary} 0%, transparent 50%)`
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform flex-shrink-0"
            style={{ backgroundColor: themeColors.primary }}
          >
            <Icon size={20} />
          </div>
          <div className="text-right">
            <div className="text-xs opacity-60 uppercase tracking-wide">
              {isLentils ? 'Lentils' : 'Millets'}
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative mb-4 overflow-hidden rounded-xl flex-shrink-0">
          <ImageWithFallback
            src={factoid.image}
            alt={factoid.title}
            className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"
          ></div>
        </div>

        {/* Title - Fixed height container to ensure consistency */}
        <div className="mb-4" style={{ minHeight: '3.5rem' }}>
          <h3 
            className="text-lg leading-tight flex items-start h-full" 
            style={{ 
              color: themeColors.text,
              lineHeight: '1.3'
            }}
          >
            <span className="block">
              {factoid.title}
            </span>
          </h3>
        </div>

        {/* Stats - Fixed layout */}
        <div className="grid grid-cols-2 gap-4 mb-4 flex-shrink-0">
          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}>
            <div 
              className="text-2xl mb-1 leading-tight"
              style={{ color: themeColors.primary }}
            >
              {factoid.stats.primary.value}
            </div>
            <div className="text-xs opacity-70 leading-tight">{factoid.stats.primary.label}</div>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}>
            <div 
              className="text-2xl mb-1 leading-tight"
              style={{ color: themeColors.secondary }}
            >
              {factoid.stats.secondary.value}
            </div>
            <div className="text-xs opacity-70 leading-tight">{factoid.stats.secondary.label}</div>
          </div>
        </div>

        {/* Highlights - Flexible space but consistent layout */}
        <div className="space-y-2 flex-grow">
          {factoid.highlights.map((highlight, index) => (
            <div key={index} className="flex items-start space-x-2 text-sm">
              <div 
                className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2"
                style={{ backgroundColor: themeColors.accent }}
              ></div>
              <span className="opacity-80 leading-relaxed">{highlight}</span>
            </div>
          ))}
        </div>

        {/* Hover Indicator - Fixed position */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-white"
            style={{ backgroundColor: themeColors.primary }}
          >
            <TrendingUp size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}