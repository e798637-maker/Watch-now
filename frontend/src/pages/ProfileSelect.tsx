import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProfileSelect: React.FC = () => {
  const { profiles, switchProfile } = useAuth();
  const navigate = useNavigate();

  const handleSelectProfile = async (profileId: string) => {
    try {
      await switchProfile(profileId);
      navigate('/');
    } catch (error) {
      console.error('Failed to switch profile:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-4">اختر ملف شخصي</h1>
          <p className="text-gray-400 text-lg">لكل ملف شخصي تفضيلاته الخاصة</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => handleSelectProfile(profile.id)}
              className="group card-hover p-8 text-center flex flex-col items-center justify-center min-h-64"
            >
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-24 h-24 rounded-full mb-4 border-2 border-emerald-400/30 group-hover:border-emerald-400 transition-smooth"
              />
              <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-smooth">
                {profile.name}
              </h3>
              <p className="text-xs text-gray-400 mt-2">اضغط للدخول</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSelect;
