// src/components/admin/AdminSidebar.tsx
import React, { useState } from "react";
import { LayoutDashboard, Users, BookOpen, FileText, BarChart3, Settings, LogOut, Menu, Code, Play } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />
  },
  {
    name: "Problems",
    path: "/admin/problems",
    icon: <BookOpen className="w-5 h-5" />
  },
  {
    name: "Code Runner",
    path: "/admin/code-runner",
    icon: <Code className="w-5 h-5" />
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: <Users className="w-5 h-5" />
  },
  {
    name: "Reviews",
    path: "/admin/reviews",
    icon: <FileText className="w-5 h-5" />
  },
  {
    name: "Analytics",
    path: "/admin/analytics",
    icon: <BarChart3 className="w-5 h-5" />
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: <Settings className="w-5 h-5" />
  }
];

const AdminSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
  };

  return (
    <aside
      className={`bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200 transition-all duration-300 ease-in-out
                  border-r border-gray-200 dark:border-slate-800 min-h-screen flex flex-col
                  ${collapsed ? "w-16" : "w-60"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-800">
        {!collapsed && (
          <div>
            <h2 className="text-lg font-bold text-red-600 dark:text-red-400">
              Admin Panel
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Management Dashboard</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors group ${
                  isActive(item.path)
                    ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                    : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300"
                }`}
                title={collapsed ? item.name : undefined}
              >
                <span className={`transition-colors ${
                  isActive(item.path)
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                }`}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className="font-medium">{item.name}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors w-full text-left group"
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 text-red-500 group-hover:text-red-600" />
          {!collapsed && (
            <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-red-600">
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
