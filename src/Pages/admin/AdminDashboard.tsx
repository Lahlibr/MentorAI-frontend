import React, { useState, useEffect } from 'react';
import { Users, BookOpen, FileText, TrendingUp, Plus, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/Components/common/LoadingSpinner';
import Button from '@/Components/common/Button';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const stats = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12%',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-blue-500',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Active Problems',
      value: '156',
      change: '+5%',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'bg-green-500',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Reviews Completed',
      value: '8,932',
      change: '+18%',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-purple-500',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Platform Growth',
      value: '+24%',
      change: 'This month',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-pink-500',
      textColor: 'text-pink-600 dark:text-pink-400'
    }
  ];

  const recentActivity = [
    { type: 'user', action: 'New user registered', details: 'john.doe@example.com', time: '5 min ago' },
    { type: 'problem', action: 'Problem created', details: 'Binary Tree Traversal', time: '12 min ago' },
    { type: 'review', action: 'Review completed', details: 'Two Sum - Score: 9/10', time: '23 min ago' },
    { type: 'user', action: 'Reviewer approved', details: 'jane.smith@example.com', time: '1 hour ago' },
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
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Welcome back, <span className="font-medium text-blue-600 dark:text-blue-400">{user?.email?.split('@')[0]}</span>! 
              Here's what's happening on your platform.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full flex items-center justify-center">
              <Settings className="w-12 h-12 text-white" />
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
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                <div className={stat.textColor}>
                  {stat.icon}
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {stat.change}
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
              {stat.title}
            </p>
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
          <div className="grid grid-cols-2 gap-4">
            <Button
              className="h-20 flex-col"
              variant="outline"
              leftIcon={<Plus className="w-5 h-5 mb-1" />}
            >
              Add Problem
            </Button>
            <Button
              className="h-20 flex-col"
              variant="outline"
              leftIcon={<Users className="w-5 h-5 mb-1" />}
            >
              Manage Users
            </Button>
            <Button
              className="h-20 flex-col"
              variant="outline"
              leftIcon={<FileText className="w-5 h-5 mb-1" />}
            >
              View Reviews
            </Button>
            <Button
              className="h-20 flex-col"
              variant="outline"
              leftIcon={<Settings className="w-5 h-5 mb-1" />}
            >
              Settings
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 p-3 bg-gray-50 dark:bg-slate-900 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'user' ? 'bg-blue-100 dark:bg-blue-900/30' :
                  activity.type === 'problem' ? 'bg-green-100 dark:bg-green-900/30' :
                  'bg-purple-100 dark:bg-purple-900/30'
                }`}>
                  {activity.type === 'user' && <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                  {activity.type === 'problem' && <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />}
                  {activity.type === 'review' && <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.details} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            User Growth
          </h2>
          <div className="h-64 bg-gray-50 dark:bg-slate-900 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Growth chart coming soon</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Review Activity
          </h2>
          <div className="h-64 bg-gray-50 dark:bg-slate-900 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Activity chart coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
