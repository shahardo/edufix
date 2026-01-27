import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../types/api';

interface FooterProps {
  user?: User | null;
}

const Footer: React.FC<FooterProps> = ({ user }) => {
  const navigate = useNavigate();

  // Define navigation items based on user role
  const getNavigationItems = () => {
    if (!user) return [];

    switch (user.role) {
      case 'student':
        return [
          { icon: 'fas fa-home', label: 'Home', path: '/student' },
          { icon: 'fas fa-book', label: 'Lessons', path: '/student/lessons' },
          { icon: 'fas fa-brain', label: 'Exercises', path: '/student/exercises' },
          { icon: 'fas fa-chart-bar', label: 'Analytics', path: '/student/analytics' },
        ];
      case 'teacher':
        return [
          { icon: 'fas fa-home', label: 'Home', path: '/teacher' },
          { icon: 'fas fa-book', label: 'Lessons', path: '/teacher/lessons' },
          { icon: 'fas fa-brain', label: 'Practice', path: '/teacher/practice' },
          { icon: 'fas fa-chart-bar', label: 'Dashboard', path: '/teacher' },
        ];
      case 'manager':
        return [
          { icon: 'fas fa-home', label: 'Home', path: '/manager' },
          { icon: 'fas fa-users', label: 'Teachers', path: '/manager/teachers' },
          { icon: 'fas fa-school', label: 'Classes', path: '/manager/classes' },
          { icon: 'fas fa-cog', label: 'Manage', path: '/manager' },
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
        <div className="flex justify-around items-center">
          {navigationItems.map((item, index) => {
            const isActive = window.location.pathname === item.path;
            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center px-2 py-1 rounded-md transition-colors ${
                  isActive ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'
                }`}
              >
                <i className={`${item.icon} text-xl`}></i>
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Footer - Fixed */}
      <footer className="hidden lg:block fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <p>&copy; {new Date().getFullYear()} EduFix. All rights reserved.</p>
              </div>
              {navigationItems.length > 0 && (
                <div className="flex items-center space-x-8">
                  {navigationItems.map((item, index) => {
                    const isActive = window.location.pathname === item.path;
                    return (
                      <button
                        key={index}
                        onClick={() => navigate(item.path)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                          isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                        }`}
                      >
                        <i className={`${item.icon} text-lg`}></i>
                        <span className="text-sm font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* Add bottom padding for fixed footer */}
      <div className="hidden lg:block h-16"></div>
      <div className="lg:hidden h-16"></div>
    </>
  );
};

export default Footer;
