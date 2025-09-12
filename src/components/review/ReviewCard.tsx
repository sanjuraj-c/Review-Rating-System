// src/components/review/ReviewCard.tsx
import React, { useState } from 'react';
import { Star, User, ThumbsUp, Flag, MoreHorizontal, Calendar, MapPin } from 'lucide-react';

interface ReviewCardProps {
  review: {
    id: string | number;
    author: string;
    rating: number;
    title: string;
    content: string;
    date: string;
    verified?: boolean;
    helpful?: number;
    location?: string;
    images?: string[];
    productVariant?: string;
  };
  onHelpful?: (reviewId: string) => void;  // Changed to string only
  onReport?: (reviewId: string) => void;   // Changed to string only
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onHelpful, onReport }) => {
  const [isHelpfulClicked, setIsHelpfulClicked] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-orange-400 text-orange-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const handleHelpful = () => {
    if (!isHelpfulClicked) {
      setIsHelpfulClicked(true);
      // Convert ID to string before passing to callback
      onHelpful?.(String(review.id));
    }
  };

  const handleReport = () => {
    // Convert ID to string before passing to callback
    onReport?.(String(review.id));
  };

  const shouldTruncate = review.content.length > 200;
  const displayContent = shouldTruncate && !showMore 
    ? review.content.slice(0, 200) + '...' 
    : review.content;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-900 text-sm">
                  {review.author}
                </h4>
                {review.verified && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                    ✓ Verified Purchase
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {review.date}
                </div>
                {review.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {review.location}
                  </div>
                )}
              </div>
            </div>

            <button className="text-gray-400 hover:text-gray-600 p-1">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Rating and Title */}
          <div className="mb-3">
            <div className="flex items-center gap-3 mb-2">
              <StarRating rating={review.rating} />
              <span className="text-sm font-semibold text-gray-900">
                {review.title}
              </span>
            </div>
            
            {review.productVariant && (
              <p className="text-xs text-gray-600">
                Variant: <span className="font-medium">{review.productVariant}</span>
              </p>
            )}
          </div>

          {/* Review Content */}
          <div className="mb-4">
            <p className="text-gray-800 text-sm leading-relaxed">
              {displayContent}
            </p>
            {shouldTruncate && (
              <button
                onClick={() => setShowMore(!showMore)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1"
              >
                {showMore ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>

          {/* Images */}
          {review.images && review.images.length > 0 && (
            <div className="mb-4">
              <div className="flex gap-2 overflow-x-auto">
                {review.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Review image ${index + 1}`}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleHelpful}
              disabled={isHelpfulClicked}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isHelpfulClicked
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'text-gray-600 hover:text-gray-800 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${isHelpfulClicked ? 'fill-current' : ''}`} />
              {isHelpfulClicked ? 'Marked helpful' : 'Helpful'}
              {review.helpful && (
                <span className="ml-1">
                  ({review.helpful + (isHelpfulClicked ? 1 : 0)})
                </span>
              )}
            </button>

            <button
              onClick={handleReport}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              <Flag className="w-4 h-4" />
              Report
            </button>

            <div className="ml-auto text-xs text-gray-500">
              Review #{review.id}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;