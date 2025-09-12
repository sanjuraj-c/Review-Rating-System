import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { apiService } from '../services/api';
import { Review } from '../types';

const HomePage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const productId = '1';

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await apiService.getReviews(productId, 1, 10);
        if (response.success && response.data) {
          setReviews(response.data.reviews);
          setError(response.message?.includes('(mock)') ? 'Using mock data' : null);
        } else {
          setError(response.error || 'Failed to fetch reviews');
        }
      } catch (err) {
        setError('Error fetching reviews');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [productId]);

  const StarRating = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) => {
    const sizeClass = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= Math.round(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Reviews</h1>
        {loading && <p>Loading reviews...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{review.author}</h3>
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.predicted_rating} />
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Verified Purchase
                </span>
              </div>
              <h4 className="font-semibold mt-2">{review.title}</h4>
              <p>{review.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;