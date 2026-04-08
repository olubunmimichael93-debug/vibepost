import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { formatDate } from '../utils/helpers';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { posts, isAuthenticated, deletePost } = useBlog();

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
  const totalComments = posts.reduce((sum, post) => sum + (post.commentCount || 0), 0);
  const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
            Manage your blog posts and content
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/new')}
          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full text-sm font-medium hover:opacity-90 transition flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Post
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Posts</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{posts.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Likes</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{totalLikes}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Comments</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{totalComments}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Views</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{totalViews}</p>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">All Posts</h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {posts.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
              No posts yet. Create your first post!
            </div>
          ) : (
            posts.map(post => (
              <div key={post._id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex-1 min-w-0">
                  <Link to={`/post/${post._id}`} className="text-sm font-medium text-gray-900 dark:text-white hover:text-pink-500">
                    {post.title}
                  </Link>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                    <span>{formatDate(post.createdAt)}</span>
                    <span>{post.likes || 0} likes</span>
                    <span>{post.commentCount || 0} comments</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => navigate(`/admin/edit/${post._id}`)}
                    className="p-1.5 text-gray-500 hover:text-blue-500 transition"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this post?')) {
                        deletePost(post._id);
                      }
                    }}
                    className="p-1.5 text-gray-500 hover:text-red-500 transition"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;