import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import Popup from '../components/PopupExample'; // Ensure this points to the correct Popup component
import { useNavigate } from 'react-router-dom';
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
  const productId = '1'; // Assuming product ID is fixed or passed via props

  // Mock function to simulate predicted rating based on text length
  const getMockPredictedRating = (text: string): number => {
    const length = text.trim().length;
    if (length < 20) return 3;
    if (length < 50) return 3.5;
    if (length < 100) return 4;
    return 4.5;
  };

  // Update mock rating when review text changes
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
    if (!reviewText.trim()) {
      setError('Review text is required');
      return;
    }
    if (reviewText.length < 5) {
      setError('Review text must be at least 5 characters long');
      return;
    }

    const reviewData: ReviewFormData = {
      authorName: publicName || '',
      content: reviewText,
      title: reviewTitle || 'Review',
      rating: predictedRating || 3, // Use predicted rating
    };

    try {
      const response = await apiService.submitReview(productId, reviewData);
      if (response.success && response.data?.review) {
        setShowPopup(true);
        setPredictedRating(response.data.review.predicted_rating || predictedRating || 3); // Use backend rating or fallback
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8">
          <div>
            <div className="bg-white border rounded-lg shadow-sm p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-3xl">📝</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">How was the item?</h2>
              </div>

              {/* Overview Message */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">Overview</h3>
                <p className="text-gray-600">
                  Your rating will be automatically generated based on your review text and displayed after submission.
                </p>
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>

              {/* Review Title */}
              {/* <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">Review Title</h3>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Summarize your review"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div> */}

              {/* Write Review */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                  Write a review <span className="text-red-500">(required)</span>
                </h3>
                <textarea
                  value={reviewText}
                  onChange={(e) => handleTextChange(e.target.value)}
                  placeholder="What should other customers know? (At least 5 characters)"
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Public Name */}
              <div className="mb-8">
                <label className="block font-semibold text-gray-900 mb-3 text-lg">
                  What's your public name?
                </label>
                <input
                  type="text"
                  value={publicName}
                  onChange={(e) => setPublicName(e.target.value)}
                  defaultValue="anugraha"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-4 px-6 rounded-lg transition-colors shadow-sm"
              >
                Submit
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full mt-4 px-6 py-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Reviews
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Pass predictedRating to Popup */}
      <Popup
        open={showPopup}
        onClose={() => setShowPopup(false)}
        predictedRating={predictedRating || 3} // Fallback to 3 if null
      />
    </div>
  );
};

export default WriteReviewPage;