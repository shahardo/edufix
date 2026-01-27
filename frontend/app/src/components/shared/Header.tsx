import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../types/api';

interface HeaderProps {
  title: string;
  user: User | null;
  showUserMenu?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, user, showUserMenu = true }) => {
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">EduFix</h1>
            <span className="ml-4 text-lg text-gray-700">{title}</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200">
              <i className="fas fa-globe mr-1"></i>EN
            </button>
            {showUserMenu && user && (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <i className="fas fa-user-circle text-2xl text-gray-400"></i>
                  <span className="text-sm text-gray-700">{user.full_name}</span>
                  <i className={`fas fa-chevron-down text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}></i>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200">
                        Signed in as <strong>{user.username}</strong>
                      </div>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <i className="fas fa-user mr-2"></i>Profile
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <i className="fas fa-cog mr-2"></i>Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <i className="fas fa-sign-out-alt mr-2"></i>Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
