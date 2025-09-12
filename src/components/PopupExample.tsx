import React from 'react';
import { Star } from 'lucide-react';

interface PopupProps {
  open: boolean;
  onClose: () => void;
  predictedRating: number; // New prop for predicted rating
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-6 h-6 ${
            star <= Math.round(rating) // Round for display purposes
              ? 'fill-orange-400 text-orange-400'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

export default function Popup({ open, onClose, predictedRating }: PopupProps) {
  if (!open) return null; // Don't render when closed

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full">
        <div className="mb-6 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Predicted Rating</h3>
          <StarRating rating={predictedRating} />
          <p className="text-gray-600 mt-2">Thank you for your review!</p>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}