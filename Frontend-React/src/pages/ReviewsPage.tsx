import React, { useState, useEffect, useMemo } from 'react';
import { Star, ChevronDown, ThumbsUp, Flag, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { Review } from '../types';

// Static mock reviews (consistent with api.ts)
const mockReviews: Review[] = [
  // {
  //   id: '1',
  //   productId: '1',
  //   userId: 'user1',
  //   author: 'Kushal Kumar',
  //   userName: 'kushal',
  //   predicted_rating: 5,
  //   title: 'Excellent quality and fast delivery',
  //   content: 'Amazing product with great build quality. The shipping was incredibly fast and the packaging was perfect. Highly recommended!',
  //   date: '2024-03-15',
  //   verified: true,
  //   helpful: 12,
  //   reported: 0,
  //   location: 'Mumbai, India'
  // },
  // {
  //   id: '2',
  //   productId: '1',
  //   userId: 'user2',
  //   author: 'Priya Sharma',
  //   userName: 'priya',
  //   predicted_rating: 4,
  //   title: 'Good value for money',
  //   content: 'Pretty good product overall. There are some minor issues but nothing major. The price point makes it worth buying.',
  //   date: '2024-03-12',
  //   verified: true,
  //   helpful: 8,
  //   reported: 0,
  //   location: 'Delhi, India'
  // },
  // {
  //   id: '3',
  //   productId: '1',
  //   userId: 'user3',
  //   author: 'Amit Singh',
  //   userName: 'amit',
  //   predicted_rating: 5,
  //   title: 'Outstanding performance!',
  //   content: 'This product exceeded my expectations. The features work flawlessly and the design is beautiful. Will definitely buy again.',
  //   date: '2024-03-10',
  //   verified: true,
  //   helpful: 15,
  //   reported: 0,
  //   location: 'Bangalore, India'
  // }
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Reviews</h1>
          <p className="text-gray-600">Read what our customers are saying about this product</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Rating Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
              {/* Overall Rating */}
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-2">{averageRating}</div>
                <StarRating rating={Math.round(averageRating)} size="lg" />
                <p className="text-sm text-gray-600 mt-2">Based on {totalReviews} reviews</p>
              </div>

              {/* Rating Breakdown */}
              <div className="space-y-3 mb-6">
                {ratingDistribution.map((item) => (
                  <div key={item.stars} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-sm font-medium">{item.stars}</span>
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-yellow-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 w-8">{item.count}</span>
                  </div>
                ))}
              </div>

              {/* Write Review Button */}
              <button
                onClick={() => navigate('/write-review')}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Write a Review
              </button>

              {/* Filter Info */}
              <div className="mt-4 pt-4 border-t">
                <button className="text-blue-600 text-sm hover:underline flex items-center gap-1">
                  How are ratings calculated? <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Reviews List */}
          <div className="lg:col-span-2">
            {/* Sort */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Reviews ({totalReviews})
                </h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Sort by:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful')}
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="highest">Highest Rating</option>
                      <option value="lowest">Lowest Rating</option>
                      <option value="helpful">Most Helpful</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="space-y-4">
              {loading && <p className="text-gray-600 text-center">Loading reviews...</p>}
              {error && <p className="text-red-500 text-center mb-4">{error}</p>}
              {sortedReviews.length === 0 && !loading && !error && (
                <p className="text-gray-600 text-center">No reviews found.</p>
              )}
              {sortedReviews.slice(0, visibleCount).map((review) => (
                <div key={review.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{review.author}</h3>
                        <div className="flex items-center gap-2">
                          <StarRating rating={review.predicted_rating} />
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    {review.verified && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        Verified Purchase
                      </span>
                    )}
                  </div>

                  {/* Review Content */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                    <p className="text-gray-700 leading-relaxed">{review.content}</p>
                  </div>

                  {/* Review Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button 
                      onClick={() => handleHelpful(review.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        likedReviews.has(review.id)
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${likedReviews.has(review.id) ? 'fill-current' : ''}`} />
                      Helpful ({review.helpful || 0})
                    </button>
                    <button 
                      onClick={() => handleReport(review.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        reportedReviews.has(review.id)
                          ? 'bg-red-100 text-red-700'
                          : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <Flag className={`w-4 h-4 ${reportedReviews.has(review.id) ? 'fill-current' : ''}`} />
                      {reportedReviews.has(review.id) ? 'Reported' : 'Report'}
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
                  className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
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