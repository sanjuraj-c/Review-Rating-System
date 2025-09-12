// src/components/review/ReviewSummary.tsx
import React from 'react';
import { Star, TrendingUp, Users, MessageSquare } from 'lucide-react';

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  monthlyGrowth?: number;
  responseRate?: number;
}

interface ReviewSummaryProps {
  stats: ReviewStats;
  showTrends?: boolean;
  className?: string;
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({
  stats,
  showTrends = false,
  className = ''
}) => {
  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${star <= Math.floor(rating) ? 'fill-orange-400 text-orange-400' : 'text-gray-300'
              }`}
          />
        ))}
      </div>
    );
  };

  const calculatePercentage = (count: number) => {
    return Math.round((count / stats.totalReviews) * 100);
  };

  const getDistributionColor = (rating: number) => {
    const colors = {
      5: 'bg-green-500',
      4: 'bg-blue-500',
      3: 'bg-yellow-500',
      2: 'bg-orange-500',
      1: 'bg-red-500'
    };
    return colors[rating as keyof typeof colors] || 'bg-gray-400';
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h3>

        {/* Overall Rating */}
        <div className="flex items-center gap-4 mb-4">
          <StarRating rating={stats.averageRating} />
          <div>
            <span className="text-2xl font-bold text-gray-900">
              {stats.averageRating.toFixed(1)}
            </span>
            <span className="text-gray-600 ml-1">out of 5</span>
          </div>
        </div>

        <p className="text-gray-600">
          Based on {stats.totalReviews.toLocaleString()} global ratings
        </p>
      </div>

      {/* Rating Distribution */}
      <div className="p-6 border-b border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Rating Breakdown</h4>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution];
            const percentage = calculatePercentage(count);

            return (
              <div key={rating} className="flex items-center gap-3">
                <button className="text-sm text-blue-600 hover:underline w-12 text-left font-medium">
                  {rating} star
                </button>
                <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${getDistributionColor(rating)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 w-16">
                  <span className="text-sm font-medium text-gray-700">{percentage}%</span>
                </div>
                <span className="text-sm text-gray-500 w-12 text-right">
                  ({count})
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Stats */}
      {showTrends && (
        <div className="p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Review Statistics</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalReviews}
              </div>
              <div className="text-sm text-gray-600">Total Reviews</div>
            </div>

            {stats.monthlyGrowth !== undefined && (
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">
                  +{stats.monthlyGrowth}%
                </div>
                <div className="text-sm text-gray-600">This Month</div>
              </div>
            )}

            {stats.responseRate !== undefined && (
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">
                  {stats.responseRate}%
                </div>
                <div className="text-sm text-gray-600">Response Rate</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="p-6 bg-gray-50 rounded-b-lg">
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            View All Reviews
          </button>
          <button className="flex-1 bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors font-medium">
            Write a Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewSummary;