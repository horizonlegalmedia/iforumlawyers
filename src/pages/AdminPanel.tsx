import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/AuthProvider';
import { CheckCircle, XCircle, User } from 'lucide-react';

interface Lawyer {
  id: string;
  name: string;
  photo_url: string;
  bar_association: string;
  specializations: string[];
  city: string;
  preferred_language: string;
  bio: string;
  approved: boolean;
  created_at: string;
}

const AdminPanel = () => {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [load, setLoad] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'all'>('pending');
  const { user,loading } = useAuth();
  const navigate = useNavigate();

  const fetchLawyers = async () => {
    try {
      const { data, error } = await supabase
        .from('lawyers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setLawyers(data || []);
    } catch (error) {
      console.error('Error fetching lawyers:', error);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    if (loading) return;
    // Check if user is admin
    if (!user || user.email !== 'admin@iforum-lawyers.com') {
      navigate('/');
      return;
    }
    fetchLawyers();
  }, [user,loading,navigate]);



  const handleApproval = async (id: string, approved: boolean) => {
    try {
      const { error } = await supabase
        .from('lawyers')
        .update({ approved })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setLawyers(lawyers.map(lawyer => 
        lawyer.id === id ? { ...lawyer, approved } : lawyer
      ));
    } catch (error) {
      console.error('Error updating approval status:', error);
      alert('Error updating approval status. Please try again.');
    }
  };

  const filteredLawyers = lawyers.filter(lawyer => {
    if (filter === 'pending') return !lawyer.approved;
    if (filter === 'approved') return lawyer.approved;
    return true;
  });

  // If not admin, don't render anything
  if (!user || user.email !== 'admin@iforum-lawyers.com') {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Panel</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-md ${
              filter === 'pending'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-md ${
              filter === 'approved'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
        </div>
      </div>

      {load ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredLawyers.map(lawyer => (
            <div key={lawyer.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      {lawyer.photo_url ? (
                        <img
                          src={lawyer.photo_url}
                          alt={lawyer.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <User className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{lawyer.name}</h3>
                      <p className="text-gray-600">{lawyer.bar_association}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApproval(lawyer.id, true)}
                      disabled={lawyer.approved}
                      className={`p-2 rounded-full ${
                        lawyer.approved
                          ? 'bg-green-100 text-green-600 cursor-not-allowed'
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                      }`}
                    >
                      <CheckCircle className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => handleApproval(lawyer.id, false)}
                      disabled={!lawyer.approved}
                      className={`p-2 rounded-full ${
                        !lawyer.approved
                          ? 'bg-red-100 text-red-600 cursor-not-allowed'
                          : 'bg-red-100 text-red-600 hover:bg-red-200'
                      }`}
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 grid sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Specializations</h4>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {lawyer.specializations.map(spec => (
                        <span
                          key={spec}
                          className="inline-block bg-indigo-100 text-indigo-800 text-sm px-2 py-1 rounded"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Location & Language</h4>
                    <p className="mt-1 text-gray-600">{lawyer.city}</p>
                    <p className="text-gray-600">{lawyer.preferred_language}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700">Bio</h4>
                  <p className="mt-1 text-gray-600">{lawyer.bio}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;