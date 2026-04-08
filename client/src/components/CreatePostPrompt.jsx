import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';

const CreatePostPrompt = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useBlog();

  if (!isAuthenticated) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 mb-4">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold">
          V
        </div>
        <div className="flex-1">
          <button
            onClick={() => navigate('/admin/new')}
            className="w-full text-left px-4 py-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm"
          >
            What's on your mind? 🔥
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPrompt;