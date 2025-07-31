import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Code, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from './ThemeToggle';
import NavLinkItem from './NavLinkItem';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 dark:bg-dark-surface/80 backdrop-blur-lg border-b border-neutral-200 dark:border-dark-border shadow-soft dark:shadow-soft-dark sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold bg-gradient-primary bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
          >
            <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
              <Code className="w-6 h-6 text-white" />
            </div>
            <span>MentorAI</span>
          </Link>

          {/* Navigation Links */}
          {user && (
            <div className="hidden md:flex items-center space-x-6">
              <NavLinkItem to="/dashboard" label="Dashboard" />
              
              {user.role === 'Student' && (
                <>
                  <NavLinkItem to="/problems" label="Problems" />
                  <NavLinkItem to="/my-reviews" label="My Reviews" />
                </>
              )}
              
              {user.role === 'Reviewer' && (
                <NavLinkItem to="/pending-reviews" label="Pending Reviews" />
              )}
            </div>
          )}

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-card dark:bg-gradient-card-dark rounded-full border border-neutral-200 dark:border-dark-border">
                  <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {user.email}
                  </span>
                  <span className="text-xs px-2 py-1 bg-secondary-100 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300 rounded-full">
                    {user.role}
                  </span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-secondary-600 dark:hover:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-900/20 rounded-lg transition-all duration-200"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-glow transition-all duration-200 transform hover:scale-105"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
