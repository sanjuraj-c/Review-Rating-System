// src/components/review/WriteReviewButton.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface WriteReviewButtonProps {
  productId: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

const WriteReviewButton: React.FC<WriteReviewButtonProps> = ({ 
  productId, 
  variant = 'secondary',
  className = '' 
}) => {
  const navigate = useNavigate();

  const handleWriteReview = () => {
    navigate(`/product/${productId}/write-review`);
  };

  const baseClasses = "px-4 py-2 rounded font-medium transition-colors";
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "border border-gray-300 hover:bg-gray-50 text-gray-700"
  };

  return (
    <button
      onClick={handleWriteReview}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      Write a product review
    </button>
  );
};

export default WriteReviewButton;