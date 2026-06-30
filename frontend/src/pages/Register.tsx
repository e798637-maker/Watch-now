import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Film } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    setLoading(true);

    try {
      await register(email, password, username);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'خطأ في التسجيل');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-slide-in">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/30">
            <Film size={32} className="text-dark-900" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">MovieVault</h1>
          <p className="text-gray-400">إنشاء حساب جديد</p>
        </div>

        {/* Form */}
        <div className="glass p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">اسم المستخدم</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-3 text-emerald-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field pl-10"
                  placeholder="اسم مستخدم"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-3 text-emerald-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="example@email.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">كلمة المرور</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3 text-emerald-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">تأكيد كلمة المرور</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3 text-emerald-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'جاري الإنشاء...' : 'إنشاء حساب'}
            </button>
          </form>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-400">
            هل لديك حساب بالفعل؟{' '}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold">
              تسجيل دخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
