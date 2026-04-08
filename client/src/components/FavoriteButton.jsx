import React from 'react';
import { useHistory } from '../context/HistoryContext';

const FavoriteButton = ({ post }) => {
  const { toggleFavorite, isFavorite } = useHistory();
  const favorited = isFavorite(post._id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(post);
      }}
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition text-sm ${
        favorited 
          ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' 
          : 'text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
      }`}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg 
        className="w-4 h-4" 
        fill={favorited ? "currentColor" : "none"} 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
        />
      </svg>
      <span>{favorited ? 'Saved' : 'Save'}</span>
    </button>
  );
};

export default FavoriteButton;