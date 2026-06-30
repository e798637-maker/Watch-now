import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Plus, Volume2, VolumeX } from 'lucide-react';
import Navigation from '../components/Navigation';
import apiClient from '../api/client';

interface Work {
  _id: string;
  title: string;
  type?: string;
  description: string;
  poster: string;
  videoUrl: string;
  duration: number;
  year: number;
  director: string;
  cast: string[];
  genre: string[];
  rating: number;
  subtitles: Array<{ language: string; url: string }>;
}

const WatchMovie: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchWork = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/works/${id}`);
        setWork(response.data);

        // Check if in favorites
        try {
          const favResponse = await apiClient.get(`/favorites/check/${id}`);
          setIsFavorite(favResponse.data.isFavorite);
        } catch (err) {
          console.error('Failed to check favorites:', err);
        }

        // Check if in watchlist
        try {
          const watchResponse = await apiClient.get(`/watchlist/check/${id}`);
          setIsInWatchlist(watchResponse.data.inWatchlist);
        } catch (err) {
          console.error('Failed to check watchlist:', err);
        }

        // Load watch progress
        try {
          const progressResponse = await apiClient.get(`/progress/${id}`);
          if (videoRef.current && progressResponse.data.currentTime > 0) {
            videoRef.current.currentTime = progressResponse.data.currentTime;
          }
        } catch (err) {
          console.error('Failed to load progress:', err);
        }
      } catch (error) {
        console.error('Failed to fetch work:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchWork();
    }
  }, [id]);

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await apiClient.delete(`/favorites/${id}`);
      } else {
        await apiClient.post('/favorites', { workId: id });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleToggleWatchlist = async () => {
    try {
      if (isInWatchlist) {
        await apiClient.delete(`/watchlist/${id}`);
      } else {
        await apiClient.post('/watchlist', { workId: id });
      }
      setIsInWatchlist(!isInWatchlist);
    } catch (error) {
      console.error('Failed to toggle watchlist:', error);
    }
  };

  const handleSaveProgress = async () => {
    try {
      if (videoRef.current && work) {
        await apiClient.post(`/progress/${id}`, {
          currentTime: videoRef.current.currentTime,
          duration: videoRef.current.duration,
          isCompleted: videoRef.current.currentTime >= videoRef.current.duration - 10,
        });
      }
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-400/20 border-t-emerald-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">جاري تحميل الفيلم...</p>
        </div>
      </div>
    );
  }

  if (!work) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <p className="text-gray-400">الفيلم غير موجود</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-smooth mb-6"
        >
          <ArrowLeft size={20} />
          العودة
        </button>

        {/* Video Player */}
        <div className="glass rounded-2xl overflow-hidden mb-8">
          <div className="aspect-video bg-black relative">
            <video
              ref={videoRef}
              src={work.videoUrl}
              className="w-full h-full"
              controls
              onTimeUpdate={handleSaveProgress}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              {work.subtitles.map((subtitle) => (
                <track
                  key={subtitle.language}
                  kind="subtitles"
                  srcLang={subtitle.language}
                  label={subtitle.language}
                  src={subtitle.url}
                />
              ))}
            </video>
          </div>
        </div>

        {/* Work Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-white mb-4">{work.title}</h1>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6">
                <span>{work.year}</span>
                <span>•</span>
                <span>{work.director}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <span>⭐</span>
                  <span>{work.rating.toFixed(1)}/10</span>
                </div>
              </div>

              {/* Genre */}
              <div className="flex flex-wrap gap-2 mb-6">
                {work.genre.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 glass text-xs rounded-full text-emerald-400"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-gray-300 leading-relaxed">{work.description}</p>
            </div>

            {/* Cast */}
            {work.cast.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white mb-4">الممثلون</h3>
                <div className="flex flex-wrap gap-2">
                  {work.cast.map((actor) => (
                    <span
                      key={actor}
                      className="px-3 py-1 glass text-sm rounded-lg text-gray-300"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Action Buttons */}
            <button
              onClick={handleToggleFavorite}
              className={`w-full py-3 glass rounded-xl font-semibold transition-smooth flex items-center justify-center gap-2 ${
                isFavorite
                  ? 'bg-emerald-500/20 border-emerald-400'
                  : ''
              }`}
            >
              <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
              {isFavorite ? 'من المفضلة' : 'إضافة للمفضلة'}
            </button>

            <button
              onClick={handleToggleWatchlist}
              className={`w-full py-3 glass rounded-xl font-semibold transition-smooth flex items-center justify-center gap-2 ${
                isInWatchlist
                  ? 'bg-cyan-500/20 border-cyan-400'
                  : ''
              }`}
            >
              <Plus size={20} />
              {isInWatchlist ? 'في قائمة المشاهدة' : 'إضافة لقائمة المشاهدة'}
            </button>

            {/* Info Card */}
            <div className="glass p-6 rounded-xl">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">النوع</p>
                  <p className="font-semibold text-white capitalize">{work.type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">المدة</p>
                  <p className="font-semibold text-white">{work.duration} دقيقة</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WatchMovie;
