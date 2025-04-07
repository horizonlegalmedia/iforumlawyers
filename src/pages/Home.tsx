import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, BookOpen, Scale, Shield, Award, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-indigo-800 opacity-90" />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')",
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Find the Right Legal Expert
              <br />
              <span className="text-indigo-300">for Your Case</span>
            </h1>
            <p className="text-xl sm:text-2xl text-indigo-100 max-w-3xl mx-auto mb-10">
              Connect with qualified lawyers across India based on practice area, location, and expertise
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/directory"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-indigo-900 bg-white hover:bg-indigo-50 transition-colors duration-300"
              >
                Browse Directory
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-medium rounded-md text-white hover:bg-white hover:text-indigo-900 transition-colors duration-300"
              >
                Join as Lawyer
                <Scale className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose iForumLawyers?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We connect you with the best legal professionals in India, ensuring quality and trust in every interaction
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
          <div className="bg-white rounded-2xl shadow-md p-8 transform transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="bg-indigo-100 rounded-2xl p-3 w-14 h-14 flex items-center justify-center mb-6">
              <Search className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Smart Search
            </h3>
            <p className="text-gray-600">
              Find lawyers specialized in various practice areas including civil, criminal, corporate law, and more
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-8 transform transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="bg-indigo-100 rounded-2xl p-3 w-14 h-14 flex items-center justify-center mb-6">
              <Shield className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Verified Professionals
            </h3>
            <p className="text-gray-600">
              All lawyers are verified with their bar license and professional credentials for your peace of mind
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-8 transform transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:col-span-2 lg:col-span-1">
            <div className="bg-indigo-100 rounded-2xl p-3 w-14 h-14 flex items-center justify-center mb-6">
              <Award className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Expert Matching
            </h3>
            <p className="text-gray-600">
              Get matched with lawyers who have the right expertise and experience for your specific legal needs
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Find Your Legal Expert?
            </h2>
            <p className="text-lg text-indigo-200 mb-8">
              Browse our directory of verified lawyers and find the right match for your legal needs
            </p>
            <Link
              to="/directory"
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-indigo-900 bg-white hover:bg-indigo-50 transition-colors"
            >
              Browse Directory
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;