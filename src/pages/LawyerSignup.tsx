import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

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

const LawyerSignup = () => {
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }
    setUserId(user.id);
  };

  const handleSpecializationChange = (spec: string) => {
    if (selectedSpecs.includes(spec)) {
      setSelectedSpecs(selectedSpecs.filter(s => s !== spec));
    } else if (selectedSpecs.length < 3) {
      setSelectedSpecs([...selectedSpecs, spec]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) {
      alert('Please log in to create a profile');
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      let photoUrl = '';
      if (photoFile) {
        const { data, error } = await supabase.storage
          .from('lawyer-photos')
          .upload(`${Date.now()}-${photoFile.name}`, photoFile);

        if (error) throw error;
        photoUrl = data.path;
      }

      const { error } = await supabase.from('lawyers').insert({
        user_id: userId,
        name: formData.get('name'),
        photo_url: photoUrl,
        age: parseInt(formData.get('age') as string),
        bar_license_no: formData.get('barLicenseNo') || null,
        bar_association: formData.get('barAssociation'),
        years_of_practice: parseInt(formData.get('yearsPractice') as string),
        specializations: selectedSpecs,
        mobile_no: formData.get('mobileNo'),
        city: formData.get('city'),
        preferred_language: formData.get('preferredLanguage'),
        bio: formData.get('bio'),
        approved: false
      });

      if (error) throw error;

      alert('Profile created successfully! It will be visible in the directory after admin approval.');
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Register as a Lawyer</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name *</label>
          <input
            type="text"
            name="name"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Passport Size Photo
            <span className="text-gray-500 text-sm font-normal ml-1">(optional)</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setPhotoFile(e.target.files?.[0] || null)}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Age *</label>
            <input
              type="number"
              name="age"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bar License No.
              <span className="text-gray-500 text-sm font-normal ml-1">(optional)</span>
            </label>
            <input
              type="text"
              name="barLicenseNo"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bar Association *
            </label>
            <input
              type="text"
              name="barAssociation"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Years of Practice *
            </label>
            <input
              type="number"
              name="yearsPractice"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specialization Areas (Maximum 3) *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {specializations.map(spec => (
              <label key={spec} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedSpecs.includes(spec)}
                  onChange={() => handleSpecializationChange(spec)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">{spec}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mobile No. *
            </label>
            <input
              type="tel"
              name="mobileNo"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              City/District *
            </label>
            <input
              type="text"
              name="city"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Preferred Language *
          </label>
          <select
            name="preferredLanguage"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Bio *
          </label>
          <textarea
            name="bio"
            required
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Creating Profile...' : 'Create Profile'}
        </button>
      </form>
    </div>
  );
};

export default LawyerSignup;