import React from 'react';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showValue?: boolean;
  showText?: boolean;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  size = 'md', 
  interactive = false,
  onRatingChange,
  showValue = false,
  showText = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl'
  };

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const handleStarClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  // Convert boolean to number for calculation
  const halfStarValue = hasHalfStar ? 1 : 0;

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`flex ${sizeClasses[size]} text-yellow-500`}>
        {/* Full stars */}
        {Array.from({ length: fullStars }, (_, i) => (
          <span 
            key={`full-${i}`} 
            className="cursor-pointer"
            onClick={() => handleStarClick(i + 1)}
          >
            ★
          </span>
        ))}
        
        {/* Half star */}
        {hasHalfStar && (
          <span 
            key="half" 
            className="cursor-pointer"
            onClick={() => handleStarClick(fullStars + 1)}
          >
            ★
          </span>
        )}
        
        {/* Empty stars */}
        {Array.from({ length: emptyStars }, (_, i) => (
          <span 
            key={`empty-${i}`} 
            className="text-gray-300 cursor-pointer"
            onClick={() => handleStarClick(fullStars + halfStarValue + i + 1)}
          >
            ☆
          </span>
        ))}
      </div>
      {(showValue || showText) && (
        <span className="ml-2 text-gray-700 font-medium">
          {rating.toFixed(1)}/5
        </span>
      )}
    </div>
  );
};

export default StarRating;