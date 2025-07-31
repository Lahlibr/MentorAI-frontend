import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Users, TrendingUp, Eye, FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/Components/common/LoadingSpinner';
import Button from '@/Components/common/Button';

const ReviewerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [pendingReviews, setPendingReviews] = useState([]);

  const stats = [
    {
      title: 'Reviews Completed',
      value: '156',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'bg-green-500',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Pending Reviews',
      value: '8',
      icon: <Clock className="w-6 h-6" />,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600 dark:text-yellow-400'
    },
    {
      title: 'Students Helped',
      value: '89',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-blue-500',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Average Rating',
      value: '4.8',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-purple-500',
      textColor: 'text-purple-600 dark:text-purple-400'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, <span className="text-blue-600 dark:text-blue-400">{user?.email?.split('@')[0]}</span>!
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Ready to help students improve their coding skills? You have 8 pending reviews.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full flex items-center justify-center">
              <FileText className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
                  {stat.title}
                </p>
                <p className={`text-2xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                <div className={stat.textColor}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="space-y-4">
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => window.location.href = '/pending-reviews'}
              leftIcon={<Clock className="w-5 h-5" />}
            >
              <div className="text-left">
                <div className="font-medium">Review Pending Submissions</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">8 submissions waiting</div>
              </div>
            </Button>

            <Button
              className="w-full justify-start"
              variant="outline"
              leftIcon={<Eye className="w-5 h-5" />}
            >
              <div className="text-left">
                <div className="font-medium">View My Reviews</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Check completed reviews</div>
              </div>
            </Button>

            <Button
              className="w-full justify-start"
              variant="outline"
              leftIcon={<Users className="w-5 h-5" />}
            >
              <div className="text-left">
                <div className="font-medium">Student Progress</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Track student improvements</div>
              </div>
            </Button>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Recent Reviews
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-slate-900 rounded-lg">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">JS</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                    Two Sum Solution
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    by student@example.com • 2 hours ago
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">8/10</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Review Activity
        </h2>
        <div className="h-64 bg-gray-50 dark:bg-slate-900 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">Activity chart coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewerDashboard;
