import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Save } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';

const ProfileSettings: React.FC = () => {
  const { currentProfile, updateProfile, logout, profiles } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(currentProfile?.name || '');
  const [avatar, setAvatar] = useState(currentProfile?.avatar || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    if (!currentProfile) return;

    setLoading(true);
    setMessage('');

    try {
      await updateProfile(currentProfile.id, name, avatar);
      setMessage('تم حفظ التغييرات بنجاح');
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'خطأ في حفظ التغييرات');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <Navigation />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold gradient-text mb-8">إعدادات الملف الشخصي</h1>

        {/* Profile Settings */}
        <div className="glass p-8 rounded-2xl mb-8">
          <div className="space-y-6">
            {/* Avatar */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">صورة الملف الشخصي</label>
              <div className="flex items-center gap-6">
                <img
                  src={avatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-2 border-purple-400/30 object-cover"
                />
                <div className="flex-1">
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="input-field w-full"
                    placeholder="رابط الصورة"
                  />
                  <p className="text-xs text-gray-400 mt-2">أدخل رابط صورة مباشر</p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">اسم الملف الشخصي</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field w-full"
                placeholder="اسم الملف الشخصي"
              />
            </div>

            {/* Message */}
            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.includes('بنجاح')
                    ? 'bg-purple-500/20 border border-purple-500/50 text-purple-200'
                    : 'bg-red-500/20 border border-red-500/50 text-red-200'
                }`}
              >
                {message}
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save size={20} />
              {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </div>
        </div>

        {/* Other Profiles */}
        {profiles.length > 1 && (
          <div className="glass p-8 rounded-2xl mb-8">
            <h2 className="text-xl font-semibold text-white mb-6">الملفات الشخصية الأخرى</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className={`p-4 rounded-xl text-center cursor-pointer transition-smooth ${
                    profile.id === currentProfile?.id
                      ? 'glass border-purple-400'
                      : 'card hover:border-purple-400/50'
                  }`}
                >
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-12 h-12 rounded-full mx-auto mb-2 border border-purple-400/30"
                  />
                  <p className="text-sm font-medium text-white">{profile.name}</p>
                  {profile.id === currentProfile?.id && (
                    <p className="text-xs text-purple-400 mt-1">الحالي</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-3 glass rounded-xl font-semibold transition-smooth flex items-center justify-center gap-2 bg-red-500/10 border-red-500/30 hover:border-red-500/50 text-red-400"
        >
          <LogOut size={20} />
          تسجيل الخروج
        </button>
      </main>
    </div>
  );
};

export default ProfileSettings;
