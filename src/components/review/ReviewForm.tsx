// src/components/review/ReviewForm.tsx
import React, { useState } from 'react';
import { Star, Camera, Upload, X, Wand2 } from 'lucide-react';

interface ReviewFormData {
  rating: number;
  title: string;
  content: string;
  authorName: string;
  productName: string;
  category: string;
  brand: string;
  images: File[];
}

interface ReviewFormProps {
  onSubmit: (data: ReviewFormData) => void;
  onGenerateAI?: (params: { rating: number; productName: string; tone: string; length: string }) => Promise<string>;
  initialData?: Partial<ReviewFormData>;
  isSubmitting?: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ 
  onSubmit, 
  onGenerateAI, 
  initialData = {},
  isSubmitting = false 
}) => {
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: initialData.rating || 0,
    title: initialData.title || '',
    content: initialData.content || '',
    authorName: initialData.authorName || '',
    productName: initialData.productName || '',
    category: initialData.category || '',
    brand: initialData.brand || '',
    images: initialData.images || []
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSettings, setAiSettings] = useState({
    tone: 'professional',
    length: 'medium'
  });

  const StarRating = ({ rating, onRatingChange }: { rating: number; onRatingChange: (rating: number) => void }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-8 h-8 cursor-pointer transition-colors ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-400'
            }`}
            onClick={() => onRatingChange(star)}
          />
        ))}
      </div>
    );
  };

  const handleInputChange = (field: keyof ReviewFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({ 
      ...prev, 
      images: [...prev.images, ...files].slice(0, 5) // Limit to 5 images
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleGenerateReview = async () => {
    if (!onGenerateAI || !formData.rating || !formData.productName) return;

    setIsGenerating(true);
    try {
      const generatedContent = await onGenerateAI({
        rating: formData.rating,
        productName: formData.productName,
        tone: aiSettings.tone,
        length: aiSettings.length
      });
      
      handleInputChange('content', generatedContent);
      
      // Auto-generate title based on rating
      const titles = {
        5: "Excellent product! Highly recommended",
        4: "Very good quality, satisfied with purchase",
        3: "Good product, meets expectations",
        2: "Decent product with some issues",
        1: "Disappointed with this purchase"
      };
      
      if (!formData.title) {
        handleInputChange('title', titles[formData.rating as keyof typeof titles] || '');
      }
    } catch (error) {
      console.error('Error generating review:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid = formData.rating > 0 && formData.title.trim() && formData.content.trim() && formData.authorName.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.productName}
              onChange={(e) => handleInputChange('productName', e.target.value)}
              placeholder="Enter product name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => handleInputChange('brand', e.target.value)}
              placeholder="Enter brand name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select 
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing & Fashion</option>
              <option value="home-garden">Home & Garden</option>
              <option value="sports">Sports & Outdoors</option>
              <option value="books">Books</option>
              <option value="automotive">Automotive</option>
              <option value="beauty">Beauty & Personal Care</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rating Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Rate this Product <span className="text-red-500">*</span>
        </h3>
        <div className="flex items-center gap-4 mb-4">
          <StarRating 
            rating={formData.rating} 
            onRatingChange={(rating) => handleInputChange('rating', rating)}
          />
          <span className="text-lg font-medium text-gray-700">
            {formData.rating > 0 ? `${formData.rating} out of 5 stars` : 'Click to rate'}
          </span>
        </div>
        <div className="text-sm text-gray-600">
          {formData.rating === 5 && "🌟 Excellent! You love this product"}
          {formData.rating === 4 && "👍 Very Good! You're satisfied"}
          {formData.rating === 3 && "👌 Good! It meets expectations"}
          {formData.rating === 2 && "😐 Fair! Could be better"}
          {formData.rating === 1 && "👎 Poor! You're not satisfied"}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Review Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="What's most important to know?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Share your experience with this product. What did you like or dislike?"
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">
                    {formData.content.length} characters
                  </span>
                  <span className="text-sm text-gray-500">
                    Minimum 50 characters recommended
                  </span>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Photos (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">Upload photos of your product</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Choose Files
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG up to 5MB each (max 5 images)
                  </p>
                </div>

                {/* Image Preview */}
                {formData.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.authorName}
                  onChange={(e) => handleInputChange('authorName', e.target.value)}
                  placeholder="Enter your name as it will appear publicly"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI Generator - Right Column */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-lg border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Wand2 className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">AI Review Generator</h3>
            </div>
            
            <p className="text-gray-600 mb-4 text-sm">
              Generate a professional review based on your rating and product details
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tone</label>
                <select 
                  value={aiSettings.tone}
                  onChange={(e) => setAiSettings(prev => ({ ...prev, tone: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual & Friendly</option>
                  <option value="enthusiastic">Enthusiastic</option>
                  <option value="detailed">Technical & Detailed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Length</label>
                <select 
                  value={aiSettings.length}
                  onChange={(e) => setAiSettings(prev => ({ ...prev, length: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500"
                >
                  <option value="short">Short (50-100 words)</option>
                  <option value="medium">Medium (100-200 words)</option>
                  <option value="long">Long (200+ words)</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleGenerateReview}
                disabled={isGenerating || !formData.rating || !formData.productName || !onGenerateAI}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </div>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 inline mr-2" />
                    Generate Review
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Form Validation Status */}
          <div className="bg-white rounded-lg border p-4">
            <h4 className="font-medium text-gray-900 mb-3 text-sm">Review Checklist</h4>
            <div className="space-y-2 text-xs">
              <div className={`flex items-center gap-2 ${formData.rating > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${formData.rating > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                Product rating
              </div>
              <div className={`flex items-center gap-2 ${formData.title.trim() ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${formData.title.trim() ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                Review title
              </div>
              <div className={`flex items-center gap-2 ${formData.content.length >= 50 ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${formData.content.length >= 50 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                Review content (50+ chars)
              </div>
              <div className={`flex items-center gap-2 ${formData.authorName.trim() ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${formData.authorName.trim() ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                Your name
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex gap-4">
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Save Draft
          </button>
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-400 text-black font-medium py-3 px-6 rounded-lg transition-colors"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </div>
            ) : (
              'Submit Review'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ReviewForm;