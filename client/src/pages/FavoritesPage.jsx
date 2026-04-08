import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from '../context/HistoryContext';
import PostCard from '../components/PostCard';

const FavoritesPage = () => {
  const { favorites, clearHistory, readHistory, getFavoriteCount, getHistoryCount } = useHistory();
  const [activeTab, setActiveTab] = useState('favorites');

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          📚 Your Library
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Posts you've saved and read
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-4 py-2 text-sm font-medium transition-all relative ${
            activeTab === 'favorites'
              ? 'text-pink-500 border-b-2 border-pink-500'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Saved ✨ ({getFavoriteCount()})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 text-sm font-medium transition-all relative ${
            activeTab === 'history'
              ? 'text-pink-500 border-b-2 border-pink-500'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          History 📖 ({getHistoryCount()})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'favorites' ? (
        <>
          {favorites.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="text-5xl mb-3">⭐</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No saved posts yet
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Click the star icon on any post to save it here
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full text-sm hover:opacity-90 transition"
              >
                Browse Posts
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {favorites.map(post => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {readHistory.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="text-5xl mb-3">📖</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No reading history yet
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Posts you read will appear here
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full text-sm hover:opacity-90 transition"
              >
                Start Reading
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          ) : (
            <>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => {
                    if (window.confirm('Clear all reading history?')) {
                      clearHistory();
                    }
                  }}
                  className="text-xs text-gray-500 hover:text-red-500 transition flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear History
                </button>
              </div>
              <div className="space-y-4">
                {readHistory.map(post => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default FavoritesPage;