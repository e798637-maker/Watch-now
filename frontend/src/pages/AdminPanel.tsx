import React, { useState } from 'react';
import { Upload, Plus, X } from 'lucide-react';
import Navigation from '../components/Navigation';
import apiClient from '../api/client';

const AdminPanel: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'movie',
    genre: [] as string[],
    year: new Date().getFullYear(),
    director: '',
    cast: [] as string[],
    poster: '',
    thumbnail: '',
    videoUrl: '',
    duration: 0,
    rating: 0,
  });

  const [currentGenre, setCurrentGenre] = useState('');
  const [currentCast, setCurrentCast] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' || name === 'duration' || name === 'rating' 
        ? parseFloat(value) 
        : value,
    }));
  };

  const handleAddGenre = () => {
    if (currentGenre && !formData.genre.includes(currentGenre)) {
      setFormData((prev) => ({
        ...prev,
        genre: [...prev.genre, currentGenre],
      }));
      setCurrentGenre('');
    }
  };

  const handleRemoveGenre = (genre: string) => {
    setFormData((prev) => ({
      ...prev,
      genre: prev.genre.filter((g) => g !== genre),
    }));
  };

  const handleAddCast = () => {
    if (currentCast && !formData.cast.includes(currentCast)) {
      setFormData((prev) => ({
        ...prev,
        cast: [...prev.cast, currentCast],
      }));
      setCurrentCast('');
    }
  };

  const handleRemoveCast = (cast: string) => {
    setFormData((prev) => ({
      ...prev,
      cast: prev.cast.filter((c) => c !== cast),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      await apiClient.post('/works', formData);
      setMessage('تم إضافة العمل بنجاح');
      setFormData({
        title: '',
        description: '',
        type: 'movie',
        genre: [],
        year: new Date().getFullYear(),
        director: '',
        cast: [],
        poster: '',
        thumbnail: '',
        videoUrl: '',
        duration: 0,
        rating: 0,
      });
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'خطأ في إضافة العمل');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">إضافة عمل جديد</h1>
          <p className="text-gray-400">أضف فيلم أو مسلسل أو مسرحية جديدة</p>
        </div>

        <div className="glass p-8 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">العنوان</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="عنوان العمل"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">الوصف</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="input-field w-full h-24 resize-none"
                placeholder="وصف العمل"
                required
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">النوع</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="input-field w-full"
              >
                <option value="movie">فيلم</option>
                <option value="series">مسلسل</option>
                <option value="play">مسرحية</option>
              </select>
            </div>

            {/* Genre */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">الأنواع</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={currentGenre}
                  onChange={(e) => setCurrentGenre(e.target.value)}
                  className="input-field flex-1"
                  placeholder="أضف نوع"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddGenre();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddGenre}
                  className="btn-primary"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.genre.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 glass rounded-full flex items-center gap-2 text-sm"
                  >
                    {genre}
                    <button
                      type="button"
                      onClick={() => handleRemoveGenre(genre)}
                      className="hover:text-red-400"
                    >
                      <X size={16} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Year & Director */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">السنة</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">المخرج</label>
                <input
                  type="text"
                  name="director"
                  value={formData.director}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="اسم المخرج"
                  required
                />
              </div>
            </div>

            {/* Cast */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">الممثلون</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={currentCast}
                  onChange={(e) => setCurrentCast(e.target.value)}
                  className="input-field flex-1"
                  placeholder="أضف ممثل"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCast();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddCast}
                  className="btn-primary"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.cast.map((actor) => (
                  <span
                    key={actor}
                    className="px-3 py-1 glass rounded-full flex items-center gap-2 text-sm"
                  >
                    {actor}
                    <button
                      type="button"
                      onClick={() => handleRemoveCast(actor)}
                      className="hover:text-red-400"
                    >
                      <X size={16} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* URLs */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">رابط الملصق</label>
                <input
                  type="url"
                  name="poster"
                  value={formData.poster}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="https://..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">رابط الصورة المصغرة</label>
                <input
                  type="url"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="https://..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">رابط الفيديو</label>
                <input
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="https://..."
                  required
                />
              </div>
            </div>

            {/* Duration & Rating */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">المدة (دقيقة)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">التقييم (0-10)</label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  min="0"
                  max="10"
                  step="0.1"
                />
              </div>
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'جاري الإضافة...' : 'إضافة العمل'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
