// src/components/common/Header.tsx
import React from 'react';
import { Star, Menu, User, Bell, Search } from 'lucide-react';

interface HeaderProps {
  currentPage?: 'home' | 'reviews' | 'write-review';
}

const Header: React.FC<HeaderProps> = ({ currentPage = 'home' }) => {
  const navItems = [
    { key: 'home', label: 'Home', href: '/' },
    { key: 'reviews', label: 'All Reviews', href: '/reviews' },
    { key: 'write-review', label: 'Write Review', href: '/write-review' }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-white fill-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">ReviewRater</h1>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className={`${
                  currentPage === item.key
                    ? 'text-blue-600 font-medium border-b-2 border-blue-600 pb-1'
                    : 'text-gray-600 hover:text-gray-900'
                } transition-colors`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Search (Desktop) */}
            <div className="hidden lg:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search reviews..."
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Notifications */}
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>

            {/* Profile */}
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <span className="hidden sm:block text-sm font-medium">Profile</span>
              </button>
            </div>

            {/* Mobile Menu */}
            <button className="md:hidden p-2 text-gray-600 hover:text-gray-900">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <div className="py-3 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-sm ${
                  currentPage === item.key
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;