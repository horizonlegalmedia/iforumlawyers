import React from 'react';
import { Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-indigo-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Scale className="h-6 w-6" />
            <span className="font-semibold text-lg">iForumLawyers</span>
          </div>
          <div className="flex space-x-6">
            <Link to="/" className="hover:text-indigo-200">Home</Link>
            <Link to="/directory" className="hover:text-indigo-200">Directory</Link>
            <Link to="/signup" className="hover:text-indigo-200">Join as Lawyer</Link>
          </div>
          <div className="mt-4 md:mt-0 text-sm text-indigo-200">
            © {new Date().getFullYear()} iForumLawyers. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;