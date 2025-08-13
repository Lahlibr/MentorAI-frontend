import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Trophy, TrendingUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/Components/common/LoadingSpinner';
import axiosInstance from '@/api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import StudentSidebar from '@/Components/common/StudentSidebars';
import AdvancedStudentSidebar from '@/Components/common/StudentSidebars';

interface StatsData {
  problemsSolved: number;
  reviewsReceived: number;
  averageScore: number;
  skillGrowth: number;
}

interface RecentProblem {
  problemId: number;
  title: string;
  
}

const StudentDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [statsData, setStatsData] = useState<StatsData>({
    problemsSolved: 0,
    reviewsReceived: 0,
    averageScore: 0,
    skillGrowth: 0,
  });
  const [recentProblems, setRecentProblems] = useState<RecentProblem[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);

        // Example API call to your backend dashboard endpoint
        const response = await axiosInstance.get('/student/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data?.data;
        if (!data) throw new Error('No data found');

        setStatsData({
          problemsSolved: data.problemsSolved,
          reviewsReceived: data.reviewsReceived,
          averageScore: data.averageScore,
          skillGrowth: data.skillGrowth,
        });

        setRecentProblems(data.recentProblems || []);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
        setStatsData({
          problemsSolved: 0,
          reviewsReceived: 0,
          averageScore: 0,
          skillGrowth: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchDashboard();
    }
  }, [token]);

  const stats = [
    {
      title: 'Problems Solved',
      value: statsData.problemsSolved,
      icon: <BookOpen className="w-6 h-6 text-white" />,
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
      link: '/problems',
    },
    {
      title: 'Reviews Received',
      value: statsData.reviewsReceived,
      icon: <FileText className="w-6 h-6 text-white" />,
      color: 'bg-pink-500',
      textColor: 'text-pink-500',
      link: '/reviews',
    },
    {
      title: 'Average Score',
      value: statsData.averageScore,
      icon: <Trophy className="w-6 h-6 text-white" />,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-500',
      link: '/score',
    },
    {
      title: 'Skill Growth',
      value: statsData.skillGrowth,
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      color: 'bg-green-500',
      textColor: 'text-green-500',
      link: '/progress',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
        <AdvancedStudentSidebar />
        <main className="flex-1 flex justify-center items-center lg:ml-0">
          <LoadingSpinner size="lg" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
      <AdvancedStudentSidebar />
      
      <main className="flex-1 p-4 lg:p-8 overflow-auto lg:ml-0">
        {/* Add top padding on mobile to account for hamburger button */}
        <div className="pt-16 lg:pt-0">
          
          {/* Welcome Section */}
          <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 lg:p-8 border border-gray-200 dark:border-slate-700 shadow-lg dark:shadow-slate-900/50 mb-6 lg:mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome back, <span className="text-blue-600 dark:text-blue-400">{user?.email?.split('@')[0]}</span>!
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Ready to continue your coding journey? Let's solve some problems today.
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full flex items-center justify-center">
                  <BookOpen className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                </div>
              </div>
            </div>
          </section>

          {/* Stats Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            {stats.map((stat, idx) => (
              <Link
                to={stat.link}
                key={idx}
                className="block rounded-xl p-4 lg:p-6 border border-gray-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-800 hover:shadow-xl dark:hover:shadow-slate-900/70 transition-all transform hover:scale-105"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className={`text-xl lg:text-2xl font-bold ${stat.textColor}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-2 lg:p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                    <div className={`${stat.textColor}`}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </section>

          {/* Recent Problems Activity */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-lg dark:shadow-slate-900/50">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/problems')}
                  className="w-full p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-800 text-left transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-blue-900 dark:text-blue-100">Browse Problems</h3>
                      <p className="text-sm text-blue-600 dark:text-blue-400">Find new coding challenges</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/reviews')}
                  className="w-full p-4 bg-pink-50 dark:bg-pink-900/20 hover:bg-pink-100 dark:hover:bg-pink-900/30 rounded-xl border border-pink-200 dark:border-pink-800 text-left transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-pink-500 rounded-lg">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-pink-900 dark:text-pink-100">View Reviews</h3>
                      <p className="text-sm text-pink-600 dark:text-pink-400">Check your feedback</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Progress Chart Placeholder */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-lg dark:shadow-slate-900/50">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Progress Overview</h2>
              <div className="h-64 bg-gray-50 dark:bg-slate-900 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">Progress chart coming soon</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
