import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Files,
  Trophy,
  TrendingUp,
  LayoutDashboard,
  User,
  ChevronDown,
  ChevronUp,
  LogOut,
  Menu,
  X,
  Star,
  Settings,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

type NavItem = {
  name: string;
  path?: string;
  icon: React.ReactNode;
  children?: NavItem[];
};

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    name: "Problems",
    icon: <BookOpen className="w-5 h-5" />,
    children: [
      { name: "Browse", path: "/problems", icon: <BookOpen className="w-4 h-4" /> },
      { name: "My Attempts", path: "/my-attempts", icon: <Star className="w-4 h-4" /> },
      { name: "Favorites", path: "/favorites", icon: <Star className="w-4 h-4" /> },
    ],
  },
  {
    name: "Reviews",
    path: "/reviews",
    icon: <Files className="w-5 h-5" />,
  },
  {
    name: "Leaderboard",
    path: "/leaderboard",
    icon: <Trophy className="w-5 h-5" />,
  },
  {
    name: "Analytics",
    path: "/analytics/me",
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    name: "Profile",
    icon: <User className="w-5 h-5" />,
    children: [
      { name: "Account Settings", path: "/profile/settings", icon: <Settings className="w-4 h-4" /> },
      { name: "Logout", path: "/logout", icon: <LogOut className="w-4 h-4 text-red-500" /> },
    ],
  },
];

interface AdvancedStudentSidebarProps {
  className?: string;
}

const AdvancedStudentSidebar: React.FC<AdvancedStudentSidebarProps> = ({ className = "" }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Handle escape key to close mobile sidebar
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileOpen]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  const toggleMenu = (name: string) => {
    setExpandedMenus((prev) =>
      prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name]
    );
  };

  const isActive = (path?: string) => path && location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setMobileOpen(false);
    }
  };

  const sidebarContent = (
    <aside
      className={`
        bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200
        border-r border-gray-200 dark:border-slate-800 
        h-full flex flex-col shadow-xl
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-16" : "w-64"}
        ${className}
      `}
      aria-label="Sidebar Navigation"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-slate-800 min-h-[4rem]">
        {!collapsed && (
          <Link
            to="/"
            className="flex items-center space-x-2 group no-underline"
            onClick={() => setMobileOpen(false)}
          >
            <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-sm group-hover:scale-105 transition-transform">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MentorAI
            </span>
          </Link>
        )}

        {/* Desktop collapse button */}
        <button
          type="button"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors hidden lg:block"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile close button */}
        <button
          type="button"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors lg:hidden"
          aria-label="Close sidebar"
          onClick={() => setMobileOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User Profile Section */}
      <div
        className={`
          flex items-center gap-3 px-4 py-4 border-b border-gray-200 dark:border-slate-800
          ${collapsed ? "justify-center" : "justify-start"}
        `}
      >
        <div className="relative">
          <img
            src="/user-avatar.svg"
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-200 dark:ring-blue-800"
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${user?.email?.split('@')[0] || 'User'}&background=3b82f6&color=fff`;
            }}
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="font-semibold truncate text-gray-900 dark:text-white">
              {user?.email?.split('@')[0] || 'John Doe'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.role || 'Student'}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
        <ul className="flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const isMenuExpanded = expandedMenus.includes(item.name);

            if (item.children) {
              return (
                <li key={item.name}>
                  <button
                    aria-label="som"
                    type="button"
                    className={`
                      group flex items-center justify-between w-full rounded-xl px-3 py-2.5
                      hover:bg-blue-50 dark:hover:bg-blue-900/20
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      transition-all duration-200
                      ${isMenuExpanded ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" : ""}
                      ${collapsed ? "justify-center" : ""}
                    `}
                    onClick={() => toggleMenu(item.name)}
                    aria-expanded={isMenuExpanded}
                    aria-controls={`${item.name}-submenu`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200 flex-shrink-0">
                        {item.icon}
                      </span>
                      {!collapsed && (
                        <span className="font-medium text-left">{item.name}</span>
                      )}
                    </span>
                    {!collapsed && (
                      <span className="text-gray-400 dark:text-gray-500 transition-transform duration-200 flex-shrink-0">
                        {isMenuExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </span>
                    )}
                  </button>

                  {/* Submenu */}
                  <div
                    className={`
                      overflow-hidden transition-all duration-300 ease-in-out
                      ${isMenuExpanded && !collapsed ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                    `}
                  >
                    <ul
                      id={`${item.name}-submenu`}
                      className="ml-8 mt-2 space-y-1"
                      aria-label={`${item.name} submenu`}
                    >
                      {item.children.map((child) => (
                        <li key={child.name}>
                          <Link
                            to={child.path || "#"}
                            className={`
                              flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                              transition-all duration-200 group
                              ${isActive(child.path)
                                ? "bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 font-semibold"
                                : "text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-gray-900 dark:hover:text-gray-200"
                              }
                              focus:outline-none focus:ring-2 focus:ring-blue-500
                            `}
                            onClick={() => setMobileOpen(false)}
                          >
                            <span className="flex-shrink-0">{child.icon}</span>
                            <span>{child.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            }

            return (
              <li key={item.name}>
                <Link
                  to={item.path || "#"}
                  className={`
                    group flex items-center rounded-xl px-3 py-2.5 gap-3
                    transition-all duration-200
                    ${isActive(item.path)
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                    }
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  `}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200 flex-shrink-0">
                    {item.icon}
                  </span>
                  {!collapsed && <span className="font-medium">{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className={`
        border-t border-gray-200 dark:border-slate-800 p-4
        ${collapsed ? "flex justify-center" : "flex items-center justify-between"}
      `}>
        {!collapsed && (
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <img
              src="/user-avatar.svg"
              alt="User Avatar"
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${user?.email?.split('@')[0] || 'User'}&background=3b82f6&color=fff&size=32`;
              }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {user?.email?.split('@')[0] || 'John Doe'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.role || 'Student'}
              </p>
            </div>
          </div>
        )}

        <button
          type="button"
          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors flex-shrink-0"
          aria-label="Log out"
          title="Log out"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 text-red-500" />
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        type="button"
        className="fixed top-4 left-4 z-50 lg:hidden bg-white dark:bg-slate-900 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      </button>

      {/* Mobile sidebar overlay */}
      <div
        className={`
          fixed inset-0 z-40 lg:hidden transition-all duration-300
          ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />

        {/* Mobile sidebar */}
        <div
          className={`
            absolute left-0 top-0 h-full w-80 max-w-[85vw] 
            transform transition-transform duration-300 ease-in-out
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {sidebarContent}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block h-screen sticky top-0">
        {sidebarContent}
      </div>
    </>
  );
};

export default AdvancedStudentSidebar;
