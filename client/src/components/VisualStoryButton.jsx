import React, { useState } from 'react';
import StoryVisualizer from './StoryVisualizer';

const VisualStoryButton = ({ story }) => {
  const [showVisualizer, setShowVisualizer] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowVisualizer(true)}
        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-gray-500 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition text-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <span>Visual Story</span>
      </button>

      {showVisualizer && (
        <StoryVisualizer
          story={story}
          onClose={() => setShowVisualizer(false)}
        />
      )}
    </>
  );
};

export default VisualStoryButton;