import React from 'react'

interface ViewMoreButtonProps {
  text?: string
  onClick?: () => void
  href?: string
  variant?: 'primary' | 'secondary'
  className?: string
}

export default function ViewMoreButton({ 
  text = 'View More', 
  onClick, 
  href, 
  variant = 'primary',
  className = '' 
}: ViewMoreButtonProps) {
  const baseStyles = "px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 inline-block text-center"
  
  const variantStyles = {
    primary: {
      backgroundColor: '#f39c12',
      color: 'white',
      boxShadow: '0 4px 12px rgba(243, 156, 18, 0.3)',
      hoverBackground: '#e67e22'
    },
    secondary: {
      borderColor: '#f39c12',
      color: '#f39c12',
      backgroundColor: 'transparent',
      border: '2px solid #f39c12',
      hoverBackground: '#FFF4E6'
    }
  }
  
  const currentStyle = variantStyles[variant]
  
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (variant === 'primary') {
      (e.currentTarget as HTMLElement).style.backgroundColor = currentStyle.hoverBackground!
    } else {
      (e.currentTarget as HTMLElement).style.backgroundColor = currentStyle.hoverBackground!
    }
  }
  
  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (variant === 'primary') {
      (e.currentTarget as HTMLElement).style.backgroundColor = currentStyle.backgroundColor!
    } else {
      (e.currentTarget as HTMLElement).style.backgroundColor = currentStyle.backgroundColor!
    }
  }
  
  const commonProps = {
    className: `${baseStyles} ${className}`,
    style: currentStyle,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  }
  
  if (href) {
    return (
      <a href={href} {...commonProps}>
        {text}
      </a>
    )
  }
  
  return (
    <button onClick={onClick} {...commonProps}>
      {text}
    </button>
  )
}