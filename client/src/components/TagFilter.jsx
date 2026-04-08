import React from 'react';

const TagFilter = ({ tags, selectedTag, onTagSelect }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onTagSelect(null)}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          !selectedTag
            ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        All
      </button>
      {tags.map(tag => (
        <button
          key={tag}
          onClick={() => onTagSelect(tag)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedTag === tag
              ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
};

export default TagFilter;