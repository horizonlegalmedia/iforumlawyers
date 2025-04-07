import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Scale, Menu, X, User } from 'lucide-react';
import { useAuth } from './AuthProvider';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
          >
            <div className="bg-white bg-opacity-10 rounded-lg p-2 backdrop-blur-sm transition-all duration-300 group-hover:bg-opacity-20">
              <Scale className="h-8 w-8 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight">iForumLawyers</span>
              <span className="hidden sm:block text-xs text-indigo-200">Find Your Legal Expert</span>
            </div>
          </Link>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/directory"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/directory')
                  ? 'bg-indigo-700 text-white'
                  : 'text-indigo-200 hover:text-white hover:bg-indigo-800'
              }`}
            >
              Directory
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/signup"
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Register as Lawyer
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-indigo-200 hover:text-white transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-white text-indigo-900 hover:bg-indigo-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden pb-4`}>
          <div className="flex flex-col space-y-2">
            <Link
              to="/directory"
              className={`px-3 py-2 rounded-md text-base font-medium ${
                isActive('/directory')
                  ? 'bg-indigo-700 text-white'
                  : 'text-indigo-200 hover:text-white hover:bg-indigo-800'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Directory
            </Link>
            {user ? (
              <>
                <Link
                  to="/signup"
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register as Lawyer
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-indigo-200 hover:text-white px-3 py-2 rounded-md text-left"
                >
                  <User className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-white text-indigo-900 hover:bg-indigo-100 px-3 py-2 rounded-md text-base font-medium text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;