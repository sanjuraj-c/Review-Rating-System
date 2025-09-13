import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Popup from '../components/PopupExample';
import { apiService } from '../services/api';
import { ReviewFormData } from '../types';

const WriteReviewPage: React.FC = () => {
  const [reviewText, setReviewText] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [publicName, setPublicName] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [predictedRating, setPredictedRating] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const productId = '1'; // Replace with actual product ID

  // Mock function for predicted rating
  const getMockPredictedRating = (text: string): number => {
    const length = text.trim().length;
    if (length < 20) return 3;
    if (length < 50) return 3.5;
    if (length < 100) return 4;
    return 4.5;
  };

  const handleTextChange = (text: string) => {
    setReviewText(text);
    if (text.trim() && text.length >= 5) {
      setPredictedRating(getMockPredictedRating(text));
      setError(null);
    } else {
      setPredictedRating(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = reviewText.trim();

    // Regex checks
    const onlyNumbers = /^[0-9]+$/;
    const onlySpecials = /^[^a-zA-Z0-9]+$/;
    const meaningless = /^(.)\1{4,}$/;

    // Small dictionary of common words
    const dictionary = new Set([
      'good', 'bad', 'excellent', 'poor', 'amazing', 'quality', 'product',
      'item', 'useful', 'worth', 'recommend', 'happy', 'satisfied',
      'great', 'nice', 'love', 'like', 'dislike', 'okay', 'awesome',
      'super', 'cute', 'option', 'strap', 'year', 'old', 'adjust'
    ]);

    // Tokenize
    const words = text.toLowerCase().split(/\s+/).filter(Boolean);
    const knownWords = words.filter(w => dictionary.has(w));

    // Updated gibberish rule: reject only if no real words at all
    const gibberish = knownWords.length === 0;

    if (!text) {
      setError('Review text is required');
      return;
    }
    if (text.length < 5) {
      setError('Review text must be at least 5 characters long');
      return;
    }
    if (onlyNumbers.test(text) || onlySpecials.test(text) || meaningless.test(text) || gibberish) {
      setError('Invalid input');
      return;
    }

    const reviewData: ReviewFormData = {
      authorName: publicName || '',
      content: reviewText,
      title: reviewTitle || 'Review',
      rating: predictedRating || 3,
    };

    try {
      const response = await apiService.submitReview(productId, reviewData);
      if (response.success && response.data?.review) {
        setShowPopup(true);
        setPredictedRating(response.data.review.predicted_rating || predictedRating || 3);
        setReviewText('');
        setReviewTitle('');
        setPublicName('');
        setError(null);
      } else {
        setError(response.error || 'Failed to submit review');
      }
    } catch (err) {
      setError('Error submitting review');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">📝</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900">How was the item?</h1>
            </div>
          </div>

          {/* Public Name */}
          <div className="max-w-2xl mx-auto">
            <label className="block font-semibold text-gray-900 mb-4 text-xl">
              What's your public name?
            </label>
            <input
              type="text"
              value={publicName}
              onChange={(e) => setPublicName(e.target.value)}
              className="w-full p-5 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          {/* Write Review */}
          <div className="max-w-2xl mx-auto">
            <h3 className="font-semibold text-gray-900 mb-4 text-xl">
              Write a review <span className="text-red-500">(required)</span>
            </h3>
            <textarea
              value={reviewText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="What should other customers know? (At least 5 characters)"
              className="w-full h-40 p-5 text-lg border-2 border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          {/* Submit Buttons */}
          <div className="max-w-lg mx-auto space-y-2">
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 text-sm rounded-lg transition-colors shadow-sm"
            >
              Submit
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full px-6 py-3 text-sm border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Reviews
            </button>
          </div>
        </div>
      </div>

      {/* Popup */}
      <Popup
        open={showPopup}
        onClose={() => setShowPopup(false)}
        predictedRating={predictedRating || 3}
      />
    </div>
  );
};

export default WriteReviewPage;
