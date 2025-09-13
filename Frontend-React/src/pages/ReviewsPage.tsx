import React, { useState, useEffect, useMemo } from 'react';
import { Star, ChevronDown, ThumbsUp, Flag, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { Review } from '../types';

// Static mock reviews (consistent with api.ts)
const mockReviews: Review[] = [
  // same mock reviews as before
];

const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'>('newest');
  const [likedReviews, setLikedReviews] = useState<Set<string>>(new Set());
  const [reportedReviews, setReportedReviews] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const productId = '1';
  const page = 1;
  const limit = 100; // Fetch all reviews to avoid pagination issues with load more

  // Handle helpful button click
  const handleHelpful = (reviewId: string) => {
    if (likedReviews.has(reviewId)) {
      setLikedReviews(prev => {
        const newSet = new Set(prev);
        newSet.delete(reviewId);
        return newSet;
      });
      setReviews(prev => 
        prev.map(review => 
          review.id === reviewId 
            ? { ...review, helpful: (review.helpful || 0) - 1 }
            : review
        )
      );
    } else {
      setLikedReviews(prev => new Set(prev).add(reviewId));
      setReviews(prev => 
        prev.map(review => 
          review.id === reviewId 
            ? { ...review, helpful: (review.helpful || 0) + 1 }
            : review
        )
      );
    }
  };

  // Handle report button click
  const handleReport = (reviewId: string) => {
    if (reportedReviews.has(reviewId)) {
      setReportedReviews(prev => {
        const newSet = new Set(prev);
        newSet.delete(reviewId);
        return newSet;
      });
    } else {
      setReportedReviews(prev => new Set(prev).add(reviewId));
    }
  };

  // Fetch reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await apiService.getReviews(productId, page, limit);
        if (response.success && response.data) {
          // Combine backend reviews with mock reviews, filtering duplicates
          const backendReviews = response.data.reviews.map(review => ({ ...review, verified: true }));
          const uniqueMockReviews = mockReviews.filter(
            mock => !backendReviews.some(backend => backend.id === mock.id)
          );
          setReviews([...backendReviews, ...uniqueMockReviews]);
          setError(response.message?.includes('(mock)') ? 'Using mock data due to API access issue' : null);
        } else {
          setError(response.error || 'Failed to fetch reviews');
          setReviews(mockReviews.map(review => ({ ...review, verified: true })));
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Error fetching reviews');
        setReviews(mockReviews.map(review => ({ ...review, verified: true })));
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [productId]);

  // Sort reviews
  const sortedReviews = useMemo(() => {
    const reviewsCopy = [...reviews];
    switch (sortBy) {
      case 'newest':
        return reviewsCopy.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'oldest':
        return reviewsCopy.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case 'highest':
        return reviewsCopy.sort((a, b) => b.predicted_rating - a.predicted_rating);
      case 'lowest':
        return reviewsCopy.sort((a, b) => a.predicted_rating - b.predicted_rating);
      case 'helpful':
        return reviewsCopy.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
      default:
        return reviewsCopy;
    }
  }, [reviews, sortBy]);

  // Load more/less
  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, sortedReviews.length));
  };

  const loadLess = () => {
    setVisibleCount(3);
  };

  // StarRating component
  const StarRating = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) => {
    const sizeClass = size === 'lg' ? 'w-4 h-4' : 'w-3 h-3';
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= Math.round(rating)
                ? 'fill-orange-400 text-orange-400'
                : 'fill-gray-300 text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Calculate dynamic overall rating based on actual reviews
  const averageRating = reviews.length > 0 
    ? Math.round((reviews.reduce((sum, review) => sum + review.predicted_rating, 0) / reviews.length) * 10) / 10
    : 0;
  const totalReviews = reviews.length;
  
  // Calculate rating distribution based on actual reviews
  const ratingDistribution = useMemo(() => {
    if (reviews.length === 0) {
      return [
        { stars: 5, count: 0, percentage: 0 },
        { stars: 4, count: 0, percentage: 0 },
        { stars: 3, count: 0, percentage: 0 },
        { stars: 2, count: 0, percentage: 0 },
        { stars: 1, count: 0, percentage: 0 }
      ];
    }

    const ratingCounts = [0, 0, 0, 0, 0]; // Index 0 = 1 star, Index 4 = 5 stars
    reviews.forEach(review => {
      const starIndex = Math.round(review.predicted_rating) - 1;
      if (starIndex >= 0 && starIndex < 5) {
        ratingCounts[starIndex]++;
      }
    });

    return [
      { stars: 5, count: ratingCounts[4], percentage: Math.round((ratingCounts[4] / totalReviews) * 100) },
      { stars: 4, count: ratingCounts[3], percentage: Math.round((ratingCounts[3] / totalReviews) * 100) },
      { stars: 3, count: ratingCounts[2], percentage: Math.round((ratingCounts[2] / totalReviews) * 100) },
      { stars: 2, count: ratingCounts[1], percentage: Math.round((ratingCounts[1] / totalReviews) * 100) },
      { stars: 1, count: ratingCounts[0], percentage: Math.round((ratingCounts[0] / totalReviews) * 100) }
    ];
  }, [reviews, totalReviews]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Customer Reviews Summary (Smaller) */}
          <div className="lg:col-span-2">
            <div className="bg-white">
              <h2 className="text-xl font-medium text-gray-900 mb-4">Customer reviews</h2>
              
              {/* Overall Rating */}
              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={Math.round(averageRating)} />
                <span className="text-base font-medium">{averageRating} out of 5</span>
              </div>
              
              <p className="text-sm text-gray-600 mb-6">{totalReviews} global ratings</p>

              {/* Rating Breakdown */}
              <div className="space-y-2 mb-8">
                {ratingDistribution.map((item) => (
                  <div key={item.stars} className="flex items-center gap-3">
                    <button className="text-sm text-blue-600 hover:underline flex items-center gap-1 min-w-[50px]">
                      {item.stars} star
                    </button>
                    <div className="flex-1 bg-gray-200 h-4 rounded overflow-hidden">
                      <div
                        className="bg-orange-400 h-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 min-w-[35px]">{item.percentage}%</span>
                  </div>
                ))}
              </div>

              {/* Review this product */}
              <div className="border-t pt-4">
                <h3 className="text-base font-medium text-gray-900 mb-2">Review this product</h3>
                <p className="text-xs text-gray-600 mb-3">Share your thoughts with other customers</p>
                <button
                  onClick={() => navigate('/write-review')}
                  className="w-full bg-white border border-gray-300 text-gray-900 py-2 px-4 rounded font-medium hover:bg-gray-50 transition-colors"
                >
                  Write a product review
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Top Reviews (Bigger) */}
          <div className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div></div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful')}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                  <option value="helpful">Most Helpful</option>
                </select>
              </div>
            </div>

            {/* Reviews */}
            <div className="space-y-6">
              {loading && <p className="text-gray-600 text-center">Loading reviews...</p>}
              {error && <p className="text-red-500 text-center mb-4">{error}</p>}
              {sortedReviews.length === 0 && !loading && !error && (
                <p className="text-gray-600 text-center">No reviews found.</p>
              )}
              {sortedReviews.slice(0, visibleCount).map((review) => (
                <div key={review.id} className="pb-6 border-b border-gray-200 last:border-b-0">
                  {/* Review Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-900">{review.author}</span>
                  </div>

                  {/* Rating and Title */}
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={review.predicted_rating} />
                    <span className="font-medium text-gray-900">{review.title}</span>
                  </div>

                  {/* Date and Location */}
                  <p className="text-sm text-gray-600 mb-2 text-left">
                    Reviewed on{" "}
                    {new Date(review.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>

                  {/* Verified Purchase */}
                  {review.verified && (
                    <p className="text-sm text-orange-600 font-medium mb-3 text-left">Verified Purchase</p>
                  )}

                  {/* Review Content */}
                  <p className="text-gray-900 mb-4 leading-relaxed text-left">{review.content}</p>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleHelpful(review.id)}
                      className={`px-4 py-1 text-sm border rounded transition-colors ${
                        likedReviews.has(review.id)
                          ? 'border-orange-400 bg-orange-50 text-orange-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Helpful
                    </button>
                    <button 
                      onClick={() => handleReport(review.id)}
                      className={`px-4 py-1 text-sm border rounded transition-colors ${
                        reportedReviews.has(review.id)
                          ? 'border-red-400 bg-red-50 text-red-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Report
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More/Less Buttons */}
            <div className="mt-8 text-center space-y-3">
              {visibleCount < sortedReviews.length && (
                <button
                  onClick={loadMore}
                  className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded font-medium hover:bg-gray-50 transition-colors"
                >
                  Load More Reviews ({sortedReviews.length - visibleCount} remaining)
                </button>
              )}
              {visibleCount > 3 && (
                <button
                  onClick={loadLess}
                  className="block mx-auto text-blue-600 text-sm hover:underline"
                >
                  Show Fewer Reviews
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
