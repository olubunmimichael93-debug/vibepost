import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';

const PostFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts, addPost, editPost, isAuthenticated } = useBlog();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!id;
  const existingPost = isEditing ? posts.find(p => p._id === id) : null;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (existingPost) {
      setTitle(existingPost.title);
      setContent(existingPost.content);
      setTags(existingPost.tags?.join(', ') || '');
    }
  }, [isAuthenticated, existingPost, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    
    const postData = {
      title: title.trim(),
      content: content,
      tags: tags.split(',').map(t => t.trim()).filter(t => t),
    };

    try {
      if (isEditing) {
        await editPost(id, postData);
      } else {
        await addPost(postData);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
        <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {isEditing ? 'Edit your vibe' : 'Drop a vibe ✨'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's the vibe? 🤔"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
            />
          </div>

          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Spill the tea... ☕"
              required
              rows="8"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">✨ You can use HTML for formatting (like &lt;strong&gt;bold&lt;/strong&gt;)</p>
          </div>

          <div>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags (comma-separated) like: memes, relatable, hot take"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Posting...' : (isEditing ? 'Update ✨' : 'Post ✨')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostFormPage;