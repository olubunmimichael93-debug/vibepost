import React, { useState } from 'react';
import TikTokFeed from './TikTokFeed';
import { useBlog } from '../context/BlogContext';

const TikTokButton = () => {
  const [showFeed, setShowFeed] = useState(false);
  const { posts } = useBlog();

  return (
    <>
      <button
        onClick={() => setShowFeed(true)}
        className="fixed bottom-6 left-6 z-40 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-all duration-300 group"
        title="TikTok Style Feed"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      </button>

      {showFeed && (
        <TikTokFeed
          posts={posts}
          onClose={() => setShowFeed(false)}
        />
      )}
    </>
  );
};

export default TikTokButton;