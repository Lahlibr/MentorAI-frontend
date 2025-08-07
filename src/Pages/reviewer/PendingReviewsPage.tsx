import React, { useState, useEffect } from 'react';
import { Clock, Code, User, Calendar, Star, MessageSquare, CheckCircle } from 'lucide-react';
import LoadingSpinner from '@/Components/common/LoadingSpinner';
import Button from '@/Components/common/Button';
import Modal from '@/Components/common/Modal';
import MonacoEditor from '@/Components/common/MonacoEditor';
import { ErrorMessage, SuccessMessage } from '@/Components/common/Messages';
import { Review } from '@/Models';
//import { Review } from '@/Models';

const PendingReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchPendingReviews = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        fetchPendingReviews();
      } catch (err) {
        setError('Failed to load pending reviews');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPendingReviews();
  }, []);

 

  const handleReviewClick = (review: Review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
    setFeedback('');
    setScore(5);
  };

  const handleSubmitReview = async () => {
    if (!selectedReview || !feedback.trim()) {
      setError('Please provide feedback before submitting');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update the review in the list
      setReviews(prev => prev.filter(r => r.id !== selectedReview.id));
      setSuccess('Review submitted successfully!');
      setIsModalOpen(false);
      setSelectedReview(null);
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Pending Reviews
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Help students improve their coding skills with detailed feedback
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Clock className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <div>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Pending</p>
                <p className="text-xl font-bold text-yellow-700 dark:text-yellow-300">{reviews.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">This Week</p>
                <p className="text-xl font-bold text-blue-700 dark:text-blue-300">12</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">Avg Response</p>
                <p className="text-xl font-bold text-green-700 dark:text-green-300">2.4h</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && <ErrorMessage message={error} onClose={() => setError('')} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => handleReviewClick(review)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {review.title}
                  </h3>
                  <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium border border-yellow-200 dark:border-yellow-800">
                    Pending Review
                  </span>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{review.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Submitted {new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Code className="w-4 h-4" />
                    <span>JavaScript</span>
                  </div>
                </div>

                <div className="mt-4 bg-gray-50 dark:bg-slate-900 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Code Preview:</p>
                  <code className="text-sm font-mono text-gray-800 dark:text-gray-200">
                    {review.studentCode.split('\n')[0]}...
                  </code>
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                leftIcon={<MessageSquare className="w-4 h-4" />}
              >
                Review
              </Button>
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No pending reviews
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Great job! All reviews are up to date.
          </p>
        </div>
      )}

      {/* Review Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Review: ${selectedReview?.title}`}
        size="xl"
      >
        {selectedReview && (
          <div className="space-y-6">
            {/* Student Info */}
            <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-xl">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedReview.email}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Submitted on {new Date(selectedReview.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Code Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Student's Solution:
              </label>
              <MonacoEditor
                value={selectedReview.studentCode}
                onChange={() => {}} 
                language="javascript"
                height="300px"
                readOnly={true}
              />
            </div>

            {/* Score Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Score (1-10):
              </label>
              <div className="flex items-center space-x-2">
                <input
                  aria-label="Score selection"
                  type="range"
                  min="1"
                  max="10"
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900/30 px-3 py-2 rounded-lg">
                  <Star className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold text-blue-700 dark:text-blue-300">{score}/10</span>
                </div>
              </div>
            </div>

            {/* Feedback */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Detailed Feedback:
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide constructive feedback on the code quality, logic, efficiency, and areas for improvement..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReview}
                isLoading={isSubmitting}
                leftIcon={<CheckCircle className="w-4 h-4" />}
              >
                Submit Review
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PendingReviewsPage;
