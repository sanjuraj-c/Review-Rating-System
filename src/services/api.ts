import { 
  Review, 
  Product, 
  ReviewFormData, 
  ApiResponse, 
  ReviewApiResponse,
  ProductApiResponse,
  AIGenerationParams,
  ReviewSubmissionResponse 
} from '../types';

// Mock data for development
const mockReviews: Review[] = [
  {
    id: '1', // Ensured string
    productId: '1',
    userId: 'user1',
    author: 'Kushal Kumar',
    userName: 'kushal',
    predicted_rating: 5,
    title: 'Excellent quality and fast delivery',
    content: 'Amazing product with great build quality. The shipping was incredibly fast and the packaging was perfect. Highly recommended!',
    date: '2024-03-15',
    verified: true,
    helpful: 12,
    reported: 0,
    location: 'Mumbai, India'
  },
  {
    id: '2', // Ensured string
    productId: '1',
    userId: 'user2',
    author: 'Priya Sharma',
    userName: 'priya',
    predicted_rating: 4,
    title: 'Good value for money',
    content: 'Pretty good product overall. There are some minor issues but nothing major. The price point makes it worth buying.',
    date: '2024-03-12',
    verified: true,
    helpful: 8,
    reported: 0,
    location: 'Delhi, India'
  },
  {
    id: '3', // Ensured string
    productId: '1',
    userId: 'user3',
    author: 'Amit Singh',
    userName: 'amit',
    predicted_rating: 5,
    title: 'Outstanding performance!',
    content: 'This product exceeded my expectations. The features work flawlessly and the design is beautiful. Will definitely buy again.',
    date: '2024-03-10',
    verified: false,
    helpful: 15,
    reported: 0,
    location: 'Bangalore, India'
  }
];

const mockProduct: Product = {
  id: '1',
  name: 'Steelbird SBA-1 R2K Live ISI Certified Full Face Graphic Helmet',
  description: 'Medium 580 MM, Glossy Fluo Orange/Blue with Clear Visor',
  category: 'automotive',
  brand: 'Steelbird',
  averageRating: 4.2,
  totalReviews: 234,
  ratingDistribution: {
    5: 105,
    4: 75,
    3: 28,
    2: 14,
    1: 12
  },
  price: 1299,
  createdAt: '2024-01-01',
  updatedAt: '2024-03-15'
};

// API Base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';

// Bearer token
const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU1NzUzMDk4LCJpYXQiOjE3NTU2NjY2OTgsImp0aSI6IjFjNmViZDczN2EwNjQyYWI4YjI3ZjI2NmE2ZDMxMWM5IiwidXNlcl9pZCI6M30.ePiVK5llXSnrgWFQaHuI1ofBfWQLZ4hXnA9VFNysrfA';

// Utility function to simulate network delay in development
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API Service Class
class ApiService {
  // Common headers for API requests
  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${BEARER_TOKEN}`
    };
  }

  // Get reviews for a product
  async getReviews(productId: string, page = 1, limit = 10): Promise<ReviewApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/?sort_by=created`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Transform backend data to match Review type
      const reviews: Review[] = data.map((item: any) => ({
        id: String(item.id), // Convert to string
        productId,
        userId: item.user_id || 'unknown',
        author: item.name || 'Anonymous',
        userName: item.name ? item.name.toLowerCase().replace(' ', '') : 'anonymous',
        predicted_rating: item.predicted_rating || 3,
        title: item.title || 'Review',
        content: item.text,
        date: item.created_at || new Date().toISOString().split('T')[0],
        verified: item.verified || false,
        helpful: item.helpful || 0,
        reported: item.reported || 0,
        location: item.location || 'India'
      }));

      // Update mock data for development fallback
      mockReviews.length = 0;
      mockReviews.push(...reviews);

      return {
        success: true,
        data: {
          reviews,
          totalCount: reviews.length,
          averageRating: mockProduct.averageRating,
          stats: {
            totalReviews: mockProduct.totalReviews,
            averageRating: mockProduct.averageRating,
            ratingDistribution: mockProduct.ratingDistribution
          }
        }
      };
    } catch (error) {
      // Fallback to mock data
      await delay(500);
      const filteredReviews = mockReviews.filter(review => review.productId === productId);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedReviews = filteredReviews.slice(startIndex, endIndex);

      return {
        success: true,
        data: {
          reviews: paginatedReviews,
          totalCount: filteredReviews.length,
          averageRating: mockProduct.averageRating,
          stats: {
            totalReviews: mockProduct.totalReviews,
            averageRating: mockProduct.averageRating,
            ratingDistribution: mockProduct.ratingDistribution
          }
        }
      };
    }
  }

  // Get product details
  async getProduct(productId: string): Promise<ProductApiResponse> {
    try {
      await delay(300);
      
      if (productId === '1') {
        return {
          success: true,
          data: mockProduct
        };
      } else {
        return {
          success: false,
          error: 'Product not found',
          statusCode: 404
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch product',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Submit a new review
  async submitReview(productId: string, reviewData: ReviewFormData): Promise<ReviewSubmissionResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          name: reviewData.authorName || null, // Backend allows null
          text: reviewData.content
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const newReview: Review = {
        id: String(data.id), // Convert to string
        productId,
        userId: 'current-user',
        author: reviewData.authorName || 'Anonymous',
        userName: reviewData.userName || reviewData.authorName?.toLowerCase().replace(' ', '') || 'anonymous',
        predicted_rating: data.predicted_rating || 3,
        title: reviewData.title || 'Review',
        content: reviewData.content,
        date: data.created_at || new Date().toISOString().split('T')[0],
        verified: false,
        helpful: 0,
        reported: 0,
        location: 'India'
      };

      // Add to mock data for immediate frontend consistency
      mockReviews.unshift(newReview);

      // Update product stats
      mockProduct.totalReviews += 1;
      mockProduct.ratingDistribution[Math.round(data.predicted_rating) as keyof typeof mockProduct.ratingDistribution] += 1;
      const totalRating = Object.entries(mockProduct.ratingDistribution)
        .reduce((sum, [rating, count]) => sum + (parseInt(rating) * (count as number)), 0);
      mockProduct.averageRating = parseFloat((totalRating / mockProduct.totalReviews).toFixed(1));

      return {
        success: true,
        data: {
          reviewId: newReview.id,
          review: newReview
        },
        message: 'Review submitted successfully'
      };
    } catch (error) {
      // Fallback to mock data submission
      await delay(1000);
      const newReview: Review = {
        id: String(Date.now()), // Convert to string
        productId,
        userId: 'current-user',
        author: reviewData.authorName || 'Anonymous',
        userName: reviewData.userName || reviewData.authorName?.toLowerCase().replace(' ', '') || 'anonymous',
        predicted_rating: reviewData.rating || 3,
        title: reviewData.title || 'Review',
        content: reviewData.content,
        date: new Date().toISOString().split('T')[0],
        verified: false,
        helpful: 0,
        reported: 0,
        location: 'India'
      };

      mockReviews.unshift(newReview);
      mockProduct.totalReviews += 1;
      mockProduct.ratingDistribution[Math.round(reviewData.rating || 3) as keyof typeof mockProduct.ratingDistribution] += 1;
      const totalRating = Object.entries(mockProduct.ratingDistribution)
        .reduce((sum, [rating, count]) => sum + (parseInt(rating) * (count as number)), 0);
      mockProduct.averageRating = parseFloat((totalRating / mockProduct.totalReviews).toFixed(1));

      return {
        success: true,
        data: {
          reviewId: newReview.id,
          review: newReview
        },
        message: 'Review submitted successfully (mock)'
      };
    }
  }

  // Mark review as helpful
  async markReviewHelpful(reviewId: string): Promise<ApiResponse> {
    try {
      await delay(200);
      
      const review = mockReviews.find(r => r.id === reviewId);
      if (review) {
        review.helpful = (review.helpful || 0) + 1;
        return {
          success: true,
          message: 'Review marked as helpful'
        };
      } else {
        return {
          success: false,
          error: 'Review not found',
          statusCode: 404
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to mark review as helpful',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Report a review
  async reportReview(reviewId: string, reason?: string): Promise<ApiResponse> {
    try {
      await delay(300);
      
      const review = mockReviews.find(r => r.id === reviewId);
      if (review) {
        review.reported = (review.reported || 0) + 1;
        return {
          success: true,
          message: 'Review reported successfully'
        };
      } else {
        return {
          success: false,
          error: 'Review not found',
          statusCode: 404
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to report review',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Generate AI review
  async generateAIReview(params: AIGenerationParams): Promise<ApiResponse<string>> {
    try {
      await delay(2000);
      
      const templates = {
        professional: {
          5: "This {productName} has exceeded my expectations in every way. The build quality is exceptional, and the attention to detail is remarkable. After extensive use, I can confidently say this product delivers outstanding performance and represents excellent value for money.",
          4: "I'm very satisfied with this {productName}. The quality is quite good and it performs well for its intended purpose. There are minor areas for improvement, but overall it's a solid purchase that I would recommend to others.",
          3: "This {productName} meets basic expectations and serves its intended function adequately. While there are both positive and negative aspects, the product provides reasonable value for the price point.",
          2: "Unfortunately, this {productName} has several issues that impact its usability. While it functions to some degree, the quality concerns and performance limitations make it difficult to recommend.",
          1: "I'm disappointed with this {productName}. The quality is below expectations and it fails to deliver on its promises. I would not recommend this product and suggest looking at alternatives."
        },
        casual: {
          5: "Wow! This {productName} is amazing! 🌟 I'm so happy with my purchase. Everything about it is just perfect - the quality, the design, everything! Definitely buying again.",
          4: "Really happy with this {productName}! It's pretty great overall. Just a few tiny things that could be better, but nothing major. Would definitely recommend it to friends!",
          3: "It's okay, does what it's supposed to do. The {productName} is decent for the price. Not amazing, but not bad either. Pretty average I'd say.",
          2: "Hmm, not really impressed with this {productName}. It's got some issues and doesn't feel as good as I expected. Maybe look around a bit more before buying.",
          1: "Really not happy with this {productName} 😞 Just doesn't work as advertised and feels cheap. Wish I had bought something else instead."
        }
      };

      const template = templates[params.tone as keyof typeof templates] || templates.professional;
      let content = template[params.rating as keyof typeof template] || template[3];
      
      content = content.replace(/{productName}/g, params.productName);
      
      if (params.length === 'short' && content.length > 100) {
        content = content.substring(0, 100) + '...';
      } else if (params.length === 'long') {
        content += " The user experience has been consistently positive, and the product continues to meet my needs effectively. I appreciate the thoughtful design choices and attention to user requirements.";
      }

      return {
        success: true,
        data: content,
        message: 'AI review generated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to generate AI review',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Search reviews
  async searchReviews(productId: string, query: string): Promise<ReviewApiResponse> {
    try {
      await delay(300);
      
      const filteredReviews = mockReviews.filter(review => 
        review.productId === productId && 
        (review.title?.toLowerCase().includes(query.toLowerCase()) ||
         review.content.toLowerCase().includes(query.toLowerCase()) ||
         review.author.toLowerCase().includes(query.toLowerCase()))
      );

      return {
        success: true,
        data: {
          reviews: filteredReviews,
          totalCount: filteredReviews.length,
          averageRating: mockProduct.averageRating,
          stats: {
            totalReviews: filteredReviews.length,
            averageRating: mockProduct.averageRating,
            ratingDistribution: mockProduct.ratingDistribution
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to search reviews',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Type guard utilities for checking API responses
export const isSuccessResponse = <T>(response: ApiResponse<T>): response is ApiResponse<T> & { success: true; data: T } => {
  return response.success && response.data !== undefined;
};

export const isErrorResponse = <T>(response: ApiResponse<T>): response is ApiResponse<T> & { success: false; error: string } => {
  return !response.success;
};

export default apiService;