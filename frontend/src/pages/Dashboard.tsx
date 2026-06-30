import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import Navigation from '../components/Navigation';
import apiClient from '../api/client';

interface Work {
  _id: string;
  title: string;
  poster: string;
  type: string;
  year: number;
  rating: number;
}

const Dashboard: React.FC = () => {
  const [works, setWorks] = useState<Work[]>([]);
  const [filteredWorks, setFilteredWorks] = useState<Work[]>([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/works');
        setWorks(response.data);
        setFilteredWorks(response.data);
      } catch (error) {
        console.error('Failed to fetch works:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();
  }, []);

  useEffect(() => {
    let filtered = works;

    if (search) {
      filtered = filtered.filter((work) =>
        work.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (type) {
      filtered = filtered.filter((work) => work.type === type);
    }

    setFilteredWorks(filtered);
  }, [search, type, works]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">مكتبتي</h1>
          <p className="text-gray-400">مشاهدة جميع أفلامك ومسلسلاتك المفضلة</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-3 text-purple-400" />
            <input
              type="text"
              placeholder="ابحث عن فيلم أو مسلسل..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="input-field flex-1 md:flex-none"
            >
              <option value="">الكل</option>
              <option value="movie">أفلام</option>
              <option value="series">مسلسلات</option>
              <option value="play">مسرحيات</option>
            </select>
          </div>
        </div>

        {/* Works Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-purple-400/20 border-t-purple-400 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">جاري تحميل الأعمال...</p>
            </div>
          </div>
        ) : filteredWorks.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-gray-400 text-lg">لا توجد أعمال</p>
              <p className="text-gray-500 text-sm">جرب البحث عن شيء آخر</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredWorks.map((work) => (
              <div
                key={work._id}
                onClick={() => navigate(`/watch/${work._id}`)}
                className="group cursor-pointer card-hover overflow-hidden"
              >
                <div className="relative overflow-hidden rounded-xl aspect-video mb-4">
                  <img
                    src={work.poster}
                    alt={work.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-white group-hover:text-purple-400 transition-smooth line-clamp-2">
                    {work.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2 text-sm text-gray-400">
                    <span>{work.year}</span>
                    <div className="flex items-center gap-1">
                      <span>⭐</span>
                      <span>{work.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
