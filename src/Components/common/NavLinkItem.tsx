import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavLinkItemProps {
  to: string;
  label: string;
  icon?: React.ReactNode;
  className?: string;
  badge?: string | number;
  onClick?: () => void;
}

const NavLinkItem: React.FC<NavLinkItemProps> = ({
  to,
  label,
  icon,
  className = '',
  badge,
  onClick
}) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(to + '/');

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        relative flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 group
        ${isActive 
          ? 'bg-gradient-primary text-white shadow-glow' 
          : 'text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'
        }
        ${className}
      `}
    >
      {/* Icon */}
      {icon && (
        <span className={`
          transition-all duration-200
          ${isActive 
            ? 'text-white' 
            : 'text-neutral-500 dark:text-neutral-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'
          }
        `}>
          {icon}
        </span>
      )}

      {/* Label */}
      <span className="relative">
        {label}
        
        {/* Active indicator underline */}
        {isActive && (
          <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full opacity-80" />
        )}
      </span>

      {/* Badge */}
      {badge && (
        <span className={`
          inline-flex items-center justify-center min-w-[20px] h-5 text-xs font-bold rounded-full
          ${isActive
            ? 'bg-white text-primary-600'
            : 'bg-secondary-100 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300 group-hover:bg-secondary-200 dark:group-hover:bg-secondary-800'
          }
          transition-all duration-200
        `}>
          {badge}
        </span>
      )}

      {/* Hover effect */}
      {!isActive && (
        <span className="absolute inset-0 rounded-xl bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-200" />
      )}
    </Link>
  );
};

export default NavLinkItem;
