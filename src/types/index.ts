// Main Review interface that matches ReviewCard component
export interface Review {
  id: string; // Changed from string | number to string
  author: string;
  predicted_rating: number;
  title?: string;
  content: string;
  date: string;
  verified?: boolean;
  helpful?: number;
  location?: string;
  images?: string[];
  productVariant?: string;
  productId?: string;
  userId?: string;
  userName?: string;
  reported?: number;
}

// Form data interface for review submission
export interface ReviewFormData {
  authorName: string; // Maps to 'name' in backend
  content: string;   // Maps to 'text' in backend
  rating?: number;   // Optional, used in mock data
  title?: string;    // Optional, used in mock data
  userName?: string; // Optional for API compatibility
}

// Product interface
export interface Product {
  id: string;
  name: string;
  description?: string;
  category?: string;
  brand?: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  images?: string[];
  price?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Review statistics interface
export interface ReviewStats {
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

// Generic API response interface
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

// API response interfaces
export interface ReviewApiResponse extends ApiResponse {
  data?: {
    reviews: Review[];
    totalCount: number;
    averageRating: number;
    stats: ReviewStats;
  };
}

export interface ProductApiResponse extends ApiResponse {
  data?: Product;
}

// Filter and sorting options
export interface ReviewFilters {
  rating?: number;
  verified?: boolean;
  hasImages?: boolean;
  hasVideos?: boolean;
  sortBy: 'newest' | 'oldest' | 'highest-rated' | 'lowest-rated' | 'most-helpful';
  searchQuery?: string;
}

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  reviewCount?: number;
  helpfulVotes?: number;
}

// AI Generation parameters
export interface AIGenerationParams {
  rating: number;
  productName: string;
  tone: 'professional' | 'casual' | 'enthusiastic' | 'detailed' | 'balanced';
  length: 'short' | 'medium' | 'long' | 'detailed';
  keywords?: string[];
}

// Review submission response
export interface ReviewSubmissionResponse extends ApiResponse {
  data?: {
    reviewId: string;
    review: Review;
  };
}