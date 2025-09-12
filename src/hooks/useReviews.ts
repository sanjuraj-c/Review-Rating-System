import { useState, useEffect } from 'react';
import { Review, Product, ReviewFormData } from '../types';
import api from '../services/api';

export const useReviews = (productId: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [productResponse, reviewsResponse] = await Promise.all([
        api.getProduct(productId),
        api.getReviews(productId)
      ]);

      if (productResponse.success && productResponse.data) {
        setProduct(productResponse.data);
      }

      console.log(reviewsResponse, 'this is the response from review response')

      if (reviewsResponse.success && reviewsResponse?.data) {
        setReviews([reviewsResponse.data]);
      }
    } catch (err) {
      setError('Failed to load data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (reviewData: ReviewFormData): Promise<any | null> => {
    try {
      setSubmitting(true);
      setError(null);

      const response = await api.submitReview(productId, reviewData);

      if (response.success && response.data) {
        // Refresh data to get updated product stats
        await fetchData();
        return response.data;
      }

      return null;
    } catch (err) {
      setError('Failed to submit review');
      console.error('Error submitting review:', err);
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  // const markHelpful = async (reviewId: string) => {
  //   try {
  //     const response = await api.markHelpful(reviewId);
  //     if (response.success) {
  //       setReviews(prev => prev.map(review =>
  //         review.id === reviewId
  //           ? { ...review, helpful: review.helpful + 1 }
  //           : review
  //       ));
  //     }
  //   } catch (err) {
  //     console.error('Error marking helpful:', err);
  //   }
  // };

  const reportReview = async (reviewId: string) => {
    try {
      const response = await api.reportReview(reviewId);
      if (response.success) {
        setReviews(prev => prev.map(review =>
          review.id === reviewId
            ? { ...review, reported: review.reported + 1 }
            : review
        ));
      }
    } catch (err) {
      console.error('Error reporting review:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [productId]);

  return {
    product,
    reviews,
    loading,
    submitting,
    error,
    submitReview,
    // markHelpful,
    reportReview,
    refetch: fetchData
  };
};