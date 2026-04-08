import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { useHistory } from '../context/HistoryContext';
import { formatRelativeDate } from '../utils/helpers';
import FavoriteButton from './FavoriteButton';

const TikTokFeed = ({ posts, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);
  const touchStartY = useRef(0);
  const navigate = useNavigate();
  const { toggleLike, isPostLiked, getPostLikes, isAuthenticated, addShare, getPostShares } = useBlog();
  const { addToHistory } = useHistory();

  const currentPost = posts[currentIndex];
  const likes = getPostLikes(currentPost?._id);
  const liked = isPostLiked(currentPost?._id);
  const shares = getPostShares(currentPost?._id);

  // Track view when post changes
  useEffect(() => {
    if (currentPost) {
      addToHistory(currentPost);
    }
  }, [currentIndex, currentPost]);

  // Auto-advance timer
  useEffect(() => {
    let timer;
    if (isPlaying) {
      setProgress(0);
      const startTime = Date.now();
      timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = (elapsed / 8000) * 100; // 8 seconds per story
        setProgress(newProgress);
        if (newProgress >= 100) {
          nextStory();
        }
      }, 100);
    }
    return () => clearInterval(timer);
  }, [currentIndex, isPlaying]);

  // Handle scroll wheel
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.deltaY > 0) {
        nextStory();
      } else if (e.deltaY < 0) {
        prevStory();
      }
    };
    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Handle keyboard
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') nextStory();
      if (e.key === 'ArrowUp') prevStory();
      if (e.key === ' ') setIsPlaying(!isPlaying);
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  // Handle touch for mobile
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchEndY - touchStartY.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        prevStory();
      } else {
        nextStory();
      }
    }
  };

  const nextStory = () => {
    if (currentIndex < posts.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
      setIsPlaying(true);
    } else {
      // Loop back to first
      setCurrentIndex(0);
      setProgress(0);
      setIsPlaying(true);
    }
  };

  const prevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
      setIsPlaying(true);
    }
  };

  const handleLike = () => {
    if (isAuthenticated) {
      toggleLike(currentPost._id);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/post/${currentPost._id}`;
    navigator.clipboard.writeText(url);
    addShare(currentPost._id);
    alert('Link copied! 📋');
  };

  if (!currentPost) return null;

  const plainText = currentPost.content.replace(/<[^>]*>/g, '');
  const words = plainText.split(' ');
  const readingTime = Math.ceil(words.length / 200);

  return (
    <div 
      className="fixed inset-0 bg-black z-50 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      ref={containerRef}
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2">
        {posts.map((_, idx) => (
          <div 
            key={idx}
            className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
          >
            <div 
              className="h-full bg-white transition-all duration-100"
              style={{ 
                width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? '100%' : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Story Content */}
      <div className="absolute inset-0">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 z-10" />
        
        {/* Main Content - Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-pink-900/50 to-orange-900/50 animate-gradient" />
        
        {/* Floating Emojis Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${5 + Math.random() * 10}s`,
                opacity: 0.3 + Math.random() * 0.5
              }}
            >
              {['✨', '⭐', '💫', '🌟', '🔥', '❤️', '🎭', '📖', '🎬', '😊', '💀', '🎉'][Math.floor(Math.random() * 12)]}
            </div>
          ))}
        </div>

        {/* Story Text */}
        <div className="absolute inset-0 flex items-center justify-center p-8 z-10">
          <div className="max-w-lg text-center">
            {/* Category Badge */}
            <div className="mb-4">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
                {currentPost.tags?.[0] || 'Story'} • {readingTime} min read
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              {currentPost.title}
            </h1>

            {/* Excerpt */}
            <p className="text-white/80 text-base md:text-lg leading-relaxed line-clamp-6">
              {plainText.length > 300 ? plainText.substring(0, 300) + '...' : plainText}
            </p>

            {/* Read More Button */}
            <Link
              to={`/post/${currentPost._id}`}
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="inline-flex items-center gap-2 mt-6 px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition"
            >
              <span>Read Full Story</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Bottom Info Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10 bg-gradient-to-t from-black/80 to-transparent">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-between">
              {/* Author Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold">
                  V
                </div>
                <div>
                  <div className="font-semibold text-white">vibepost</div>
                  <div className="text-xs text-white/60">
                    {formatRelativeDate(currentPost.createdAt)} • {readingTime} min read
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleLike}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className={`p-2 rounded-full transition ${
                    liked ? 'bg-pink-500' : 'bg-white/20 group-hover:bg-white/30'
                  }`}>
                    <svg className="w-5 h-5 text-white" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <span className="text-xs text-white/60">{likes}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className="p-2 rounded-full bg-white/20 group-hover:bg-white/30 transition">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </div>
                  <span className="text-xs text-white/60">{shares}</span>
                </button>

                <FavoriteButton post={currentPost} />

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className="p-2 rounded-full bg-white/20 group-hover:bg-white/30 transition">
                    {isPlaying ? (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs text-white/60">{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Indicators */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between px-4 z-10 pointer-events-none">
          <button
            onClick={prevStory}
            className="pointer-events-auto w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextStory}
            className="pointer-events-auto w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Swipe Instruction */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center text-white/40 text-xs animate-bounce pointer-events-none">
          ↑ Swipe up for next story ↓
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition"
      >
        ✕
      </button>

      {/* Counter */}
      <div className="absolute bottom-4 right-4 z-20 text-xs text-white/40 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
        {currentIndex + 1} / {posts.length}
      </div>
    </div>
  );
};

export default TikTokFeed;