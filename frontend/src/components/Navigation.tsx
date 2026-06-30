import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Film, LogOut, Settings, LayoutGrid } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, currentProfile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-violet-400 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-smooth">
            <Film size={24} className="text-dark-900" />
          </div>
          <span className="text-xl font-bold gradient-text hidden sm:inline">MovieVault</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-gray-300 hover:text-purple-400 transition-smooth flex items-center gap-2"
          >
            <LayoutGrid size={20} />
            مكتبتي
          </Link>
          <Link
            to="/admin"
            className="text-gray-300 hover:text-purple-400 transition-smooth"
          >
            إضافة عمل
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">{currentProfile?.name}</span>
            <img
              src={currentProfile?.avatar}
              alt="Profile"
              className="w-8 h-8 rounded-full border border-purple-400/30"
            />
          </div>
          <Link to="/settings" className="p-2 hover:bg-white/10 rounded-lg transition-smooth">
            <Settings size={20} />
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-red-500/10 rounded-lg transition-smooth"
          >
            <LogOut size={20} className="text-red-400" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-4 pb-4">
          <Link to="/" className="block text-gray-300 hover:text-purple-400">
            مكتبتي
          </Link>
          <Link to="/admin" className="block text-gray-300 hover:text-purple-400">
            إضافة عمل
          </Link>
          <Link to="/settings" className="block text-gray-300 hover:text-purple-400">
            الإعدادات
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left text-red-400 hover:text-red-300"
          >
            تسجيل الخروج
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
