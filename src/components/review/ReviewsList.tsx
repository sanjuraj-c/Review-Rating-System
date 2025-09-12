import React from 'react';
import { Review } from '../../types';
import { Star } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
  onHelpful: (reviewId: string) => void;
  onReport: (reviewId: string) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onHelpful, onReport }) => {
  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${i < Math.round(review.predicted_rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
      <h4 className="font-semibold text-lg">{review.title || 'Review'}</h4>
      <p className="text-gray-600 mb-2">{review.content}</p>
      <p className="text-sm text-gray-500">By {review.author} on {review.date}</p>
      {review.verified && <span className="text-green-600 text-sm">Verified Purchase</span>}
      <div className="mt-4 flex gap-4">
        <button
          onClick={() => onHelpful(review.id)}
          className="text-blue-600 hover:underline"
        >
          Helpful ({review.helpful || 0})
        </button>
        <button
          onClick={() => onReport(review.id)}
          className="text-red-600 hover:underline"
        >
          Report
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;