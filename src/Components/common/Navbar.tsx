import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Code, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import NavLinkItem from "./NavLinkItem";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg border-b border-neutral-200 dark:border-slate-700 
                    bg-white/75 dark:bg-slate-900/80 shadow-sm dark:shadow-lg transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
          >
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-md group-hover:scale-105 transition-transform">
              <Code className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:brightness-110 transition">
              MentorAI
            </span>
          </Link>

          {/* Navigation Links */}
          {user && (
            <div className="hidden md:flex items-center space-x-6">
              <NavLinkItem to="/dashboard" label="Dashboard" />

              {user.role === "Student" && (
                <>
                  <NavLinkItem to="/problems" label="Problems" />
                  <NavLinkItem to="/my-reviews" label="My Reviews" />
                </>
              )}

              {user.role === "Reviewer" && (
                <NavLinkItem to="/pending-reviews" label="Pending Reviews" />
              )}

              {user.role === "Admin" && (
                <>
                  <NavLinkItem to="/admin/users" label="User Management" />
                  <NavLinkItem to="/admin/problems" label="Problem Management" />
                </>
              )}
            </div>
          )}

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {user ? (
              <div className="flex items-center space-x-3">
                {/* User info badge */}
                <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-slate-100 to-white
                                dark:from-slate-800 dark:to-slate-900 rounded-full border border-neutral-200 
                                dark:border-slate-700 shadow-sm">
                  <User className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 truncate max-w-[120px]">
                    {user.email}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full font-medium">
                    {user.role}
                  </span>
                </div>

                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 
                             dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 
                             rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
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
