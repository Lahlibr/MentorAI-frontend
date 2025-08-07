import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, Star, Eye } from 'lucide-react';
import LoadingSpinner from '@/Components/common/LoadingSpinner';
import Button from '@/Components/common/Button';
import { Review } from '@/Models';
import axiosInstance from '@/api/axiosInstance';

const MyReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(()=>{
    const fetchReviews = async () => {
      setIsLoading(true);
        try{
          const response = await axiosInstance.get('/reviews'); 
          setReviews(response.data);
        } catch (error) {
          console.error('Failed to fetch reviews:', error);
        }finally{
          setIsLoading(false);
        }
      };

    fetchReviews();
  },[]);

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    return review.status.toLowerCase() === filter;
  });

  const getStatusIcon = (status: string) => {
    return status === 'Completed' ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <Clock className="w-5 h-5 text-yellow-500" />
    );
  };

  const getStatusColor = (status: string) => {
    return status === 'Completed'
      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
      : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
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
              My Reviews
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Track your submitted solutions and feedback from reviewers
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-pink-500 rounded-xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Reviews</p>
                <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{reviews.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">Completed</p>
                <p className="text-xl font-bold text-green-700 dark:text-green-300">
                  {reviews.filter(r => r.reviewstatus === 'Completed').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
            <div className="flex items-center space-x-3">
              <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Avg Score</p>
                <p className="text-xl font-bold text-purple-700 dark:text-purple-300">
                  {reviews.filter(r => r.score > 0).length > 0
                    ? (reviews.reduce((sum, r) => sum + r.score, 0) / reviews.filter(r => r.score > 0).length).toFixed(1)
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-lg">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All Reviews' },
              { key: 'pending', label: 'Pending' },
              { key: 'completed', label: 'Completed' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filter === key
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {review.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(review.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                      {review.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Submitted: {new Date(review.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Reviewer: {review.userName}
                </p>
              </div>
              
              {review.reviewstatus === 'Completed' && (
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {review.score}/10
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Eye className="w-4 h-4" />}
                  >
                    View Details
                  </Button>
                </div>
              )}
            </div>

            {review.reviewstatus === 'Completed' && review.feedback && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Feedback:</h4>
                <p className="text-sm text-green-800 dark:text-green-200">{review.feedback}</p>
              </div>
            )}

            {review.reviewstatus === 'Pending' && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  🕐 Your solution is being reviewed. You'll receive feedback soon!
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No reviews found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start solving problems to get expert feedback on your code
          </p>
          <Button onClick={() => window.location.href = '/problems'}>
            Browse Problems
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyReviewsPage;
