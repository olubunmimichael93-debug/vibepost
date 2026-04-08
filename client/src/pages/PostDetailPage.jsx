import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { useHistory } from '../context/HistoryContext';
import { formatDate, formatRelativeDate } from '../utils/helpers';
import CommentSection from '../components/CommentSection';
import FavoriteButton from '../components/FavoriteButton';
import VisualStoryButton from '../components/VisualStoryButton';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts, isAuthenticated, deletePost, toggleLike, getPostLikes, isPostLiked, addShare, getPostShares } = useBlog();
  const { addToHistory } = useHistory();
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  const post = posts.find(p => p._id === id);
  const likes = getPostLikes(id);
  const liked = isPostLiked(id);
  const shares = getPostShares(id);

  // Track when post is viewed
  useEffect(() => {
    if (post) {
      addToHistory(post);
    }
  }, [post, addToHistory]);

  if (!post) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😢</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Vibe not found
        </h1>
        <Link to="/" className="text-pink-500 hover:text-pink-600">
          ← Back to feed
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Delete this vibe? It\'s gone forever 😢')) {
      deletePost(id);
      navigate('/');
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = encodeURIComponent(`Check out this vibe: ${post.title}`);
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert('Link copied! 📋');
    }
    addShare(id);
    setShowShareMenu(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1 text-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>

      {/* Post Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-5">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold">
              V
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-900 dark:text-white">vibepost</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">@vibe</span>
                  <span className="text-gray-400 mx-1">·</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {formatRelativeDate(post.createdAt)}
                  </span>
                </div>
              </div>
              
              <h1 className="text-xl font-bold mt-2 text-gray-900 dark:text-white">
                {post.title}
              </h1>
              
              <div 
                className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed text-sm"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              
              {post.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-xs text-pink-500">#{tag}</span>
                  ))}
                </div>
              )}
              
              {/* Stats */}
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                <span className="text-xs text-gray-500">
                  {likes} likes
                </span>
                <span className="text-xs text-gray-500">
                  {post.commentCount || 0} comments
                </span>
                <span className="text-xs text-gray-500">
                  {shares} shares
                </span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            <button 
              onClick={() => isAuthenticated && toggleLike(id)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition text-sm ${
                liked 
                  ? 'text-pink-500 bg-pink-50 dark:bg-pink-900/20' 
                  : 'text-gray-500 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20'
              }`}
              disabled={!isAuthenticated}
            >
              <svg className="w-4 h-4" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{liked ? 'Liked' : 'Like'}</span>
            </button>
            
            <Link 
              to={`/post/${id}#comments`}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Comment</span>
            </Link>
            
            <FavoriteButton post={post} />
            
            <VisualStoryButton story={post} />
            
            {/* Share Button */}
            <div className="relative">
              <button 
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>Share</span>
              </button>
              
              {showShareMenu && (
                <div className="absolute bottom-full mb-2 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 min-w-[120px] z-10">
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <span>🐦</span> Share on X
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <span>📋</span> Copy link
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div id="comments">
        <CommentSection postId={id} />
      </div>

      {/* Admin Actions */}
      {isAuthenticated && (
        <div className="fixed bottom-6 right-6 flex gap-2">
          <button
            onClick={() => navigate(`/admin/edit/${id}`)}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 hover:scale-110 transition"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 hover:scale-110 transition"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
};

export default PostDetailPage;