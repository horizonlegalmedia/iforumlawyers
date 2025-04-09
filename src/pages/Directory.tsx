import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Search, MapPin, BookOpen, Mail, Phone, Award, Star, Clock } from 'lucide-react';

interface Lawyer {
  id: string;
  name: string;
  photo_url: string;
  specializations: string[];
  city: string;
  years_of_practice: number;
  preferred_language: string;
  approved: boolean;
  bio?: string;
  mobile_no?: string;
  email?: string;
  rating?: number;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Dummy data for development
const dummyLawyers: Lawyer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=500&w=500&q=80',
    specializations: ['Civil law', 'Family law'],
    city: 'Mumbai',
    years_of_practice: 12,
    preferred_language: 'English',
    approved: true,
    bio: 'Experienced family law attorney with a focus on mediation and collaborative divorce.',
    mobile_no: '+91 98765 43210',
    email: 'sarah.j@example.com',
    rating: 4.8
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    photo_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=500&w=500&q=80',
    specializations: ['Corporate law', 'Banking law'],
    city: 'Delhi',
    years_of_practice: 15,
    preferred_language: 'Hindi',
    approved: true,
    bio: 'Corporate law specialist with expertise in mergers and acquisitions.',
    mobile_no: '+91 98765 43211',
    email: 'rajesh.k@example.com',
    rating: 4.9
  },
  {
    id: '3',
    name: 'Priya Patel',
    photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=500&w=500&q=80',
    specializations: ['Criminal law', 'Property law'],
    city: 'Bangalore',
    years_of_practice: 8,
    preferred_language: 'English',
    approved: true,
    bio: 'Dedicated criminal defense attorney with a strong track record of successful cases.',
    mobile_no: '+91 98765 43212',
    email: 'priya.p@example.com',
    rating: 4.7
  }
];

const Directory = () => {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const fetchLawyersWithRetry = async (retryCount = 0): Promise<void> => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('lawyers')
        .select('*')
        .eq('approved', "true")
       .order('name');

        // console.log("data is ",data)
      if (supabaseError) throw supabaseError;
      
      // Use dummy data if no data from Supabase
      setLawyers(data?.length ? data : dummyLawyers);
      setError(null);
    } catch (error) {
      console.error('Error fetching lawyers:', error);
      
      if (retryCount < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return fetchLawyersWithRetry(retryCount + 1);
      }
      
      // Fallback to dummy data on error
      setLawyers(dummyLawyers);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLawyersWithRetry();
  }, []);

  const filteredLawyers = lawyers.filter(lawyer => {
    const matchesSearch = lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = !selectedSpecialization || 
      lawyer.specializations.includes(selectedSpecialization);
    const matchesCity = !selectedCity || lawyer.city === selectedCity;

    return matchesSearch && matchesSpecialization && matchesCity;
  });

  const cities = Array.from(new Set(lawyers.map(l => l.city))).sort();
  const specializations = [
    'Civil law',
    'Criminal law',
    'Family law',
    'Mediation & Arbitration law',
    'Property law',
    'Motor vehicle law',
    'Insurance law',
    'Banking law',
    'Recovery law',
    'Corporate law',
    'IPR law',
  ];

  const renderStars = (rating: number = 0) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 text-center">
            Find Your Legal Expert
          </h1>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto">
            Connect with experienced lawyers across India specializing in various practice areas
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-full sm:col-span-2 lg:col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by name or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-4 pr-8 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Specializations</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
            
            <div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-4 pr-8 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  fetchLawyersWithRetry();
                }}
                className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
              >
                Try again
              </button>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLawyers.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="bg-white rounded-lg shadow-md p-8">
                  <p className="text-gray-500 text-lg">No lawyers found matching your criteria</p>
                </div>
              </div>
            ) : (
              filteredLawyers.map(lawyer => (
                <div key={lawyer.id} className="bg-white rounded-xl shadow-md overflow-hidden transform transition duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="relative h-64">
                    <img
                      src={lawyer.photo_url || 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=500&w=500&q=80'}
                      alt={lawyer.name}
                      className="w-full h-full object-cover object-center"
                    />
                    {lawyer.rating && (
                      <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
                        <div className="flex items-center space-x-1">
                          {renderStars(lawyer.rating)}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {lawyer.name}
                    </h3>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-5 w-5 mr-2 text-indigo-600" />
                        <span>{lawyer.city}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-5 w-5 mr-2 text-indigo-600" />
                        <span>{lawyer.years_of_practice} years of practice</span>
                      </div>
                      {lawyer.preferred_language && (
                        <div className="flex items-center text-gray-600">
                          <Award className="h-5 w-5 mr-2 text-indigo-600" />
                          <span>{lawyer.preferred_language}</span>
                        </div>
                      )}
                    </div>

                    {lawyer.bio && (
                      <p className="text-gray-600 mb-4 line-clamp-2">{lawyer.bio}</p>
                    )}

                    <div className="flex flex-wrap gap-2 mb-4">
                      {lawyer.specializations.map(spec => (
                        <span
                          key={spec}
                          className="inline-block bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-gray-200 space-y-2">
                      {lawyer.email && (
                        <a
                          href={`mailto:${lawyer.email}`}
                          className="flex items-center text-gray-600 hover:text-indigo-600"
                        >
                          <Mail className="h-5 w-5 mr-2" />
                          <span>{lawyer.email}</span>
                        </a>
                      )}
                      {lawyer.mobile_no && (
                        <a
                          href={`tel:${lawyer.mobile_no}`}
                          className="flex items-center text-gray-600 hover:text-indigo-600"
                        >
                          <Phone className="h-5 w-5 mr-2" />
                          <span>{lawyer.mobile_no}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Directory;