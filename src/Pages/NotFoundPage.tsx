import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '@/Components/common/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center px-4">
      <div className="text-center animate-fade-in">
        <div className="mb-8">
          <div className="text-8xl font-bold text-gray-300 dark:text-gray-700 mb-4">404</div>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-pink-500 mx-auto rounded-full mb-6"></div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Go Back
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            leftIcon={<Home className="w-4 h-4" />}
          >
            Go Home
          </Button>
        </div>

        <div className="mt-12 text-sm text-gray-500 dark:text-gray-400">
          If you believe this is an error, please contact support.
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
