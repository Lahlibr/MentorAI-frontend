import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Trophy, TrendingUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/Components/common/LoadingSpinner';
//import ProblemCard from '@/Components/ui/ProblemCard';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [recentProblems, setRecentProblems] = useState([]);

  const stats = [
    {
      title: 'Problems Solved',
      value: '23',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'bg-blue-500',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Reviews Received',
      value: '18',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-pink-500',
      textColor: 'text-pink-600 dark:text-pink-400'
    },
    {
      title: 'Average Score',
      value: '8.5',
      icon: <Trophy className="w-6 h-6" />,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600 dark:text-yellow-400'
    },
    {
      title: 'Skill Growth',
      value: '+15%',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-green-500',
      textColor: 'text-green-600 dark:text-green-400'
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
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 shadow-lg dark:shadow-slate-900/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, <span className="text-blue-600 dark:text-blue-400">{user?.email?.split('@')[0]}</span>!
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Ready to continue your coding journey? Let's solve some problems today.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-lg dark:shadow-slate-900/50 hover:shadow-xl dark:hover:shadow-slate-900/70 transition-all duration-300 hover:scale-105"
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

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-lg dark:shadow-slate-900/50">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="space-y-4">
            <button className="w-full p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-800 text-left transition-all duration-200 group">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-900 dark:text-blue-100">
                    Browse Problems
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Find new coding challenges
                  </p>
                </div>
              </div>
            </button>

            <button className="w-full p-4 bg-pink-50 dark:bg-pink-900/20 hover:bg-pink-100 dark:hover:bg-pink-900/30 rounded-xl border border-pink-200 dark:border-pink-800 text-left transition-all duration-200 group">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-500 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-pink-900 dark:text-pink-100">
                    View Reviews
                  </h3>
                  <p className="text-sm text-pink-600 dark:text-pink-400">
                    Check your feedback
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Progress Chart Placeholder */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-lg dark:shadow-slate-900/50">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Progress Overview
          </h2>
          <div className="h-64 bg-gray-50 dark:bg-slate-900 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Progress chart coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
