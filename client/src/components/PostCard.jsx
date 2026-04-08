import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { useHistory } from '../context/HistoryContext';
import { formatRelativeDate, generateExcerpt } from '../utils/helpers';
import FavoriteButton from './FavoriteButton';
import VisualStoryButton from './VisualStoryButton';

const PostCard = ({ post }) => {
  const { toggleLike, isPostLiked, getPostLikes, isAuthenticated, addShare, getPostShares } = useBlog();
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  const likes = getPostLikes(post._id);
  const liked = isPostLiked(post._id);
  const shares = getPostShares(post._id);

  const handleShare = (platform) => {
    const url = `${window.location.origin}/post/${post._id}`;
    const text = encodeURIComponent(`Check out this vibe: ${post.title}`);
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert('Link copied! 📋');
    }
    addShare(post._id);
    setShowShareMenu(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
            V
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-gray-900 dark:text-white">vibepost</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">@vibe</span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {formatRelativeDate(post.createdAt)}
              </span>
            </div>
            
            {/* Title */}
            <Link to={`/post/${post._id}`}>
              <h2 className="text-lg font-bold mt-2 text-gray-900 dark:text-white hover:text-pink-500 transition">
                {post.title}
              </h2>
            </Link>
            
            {/* Content Preview */}
            <div 
              className="mt-2 text-gray-600 dark:text-gray-300 text-sm line-clamp-3"
              dangerouslySetInnerHTML={{ __html: generateExcerpt(post.content, 100) }}
            />
            
            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {post.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-xs text-pink-500">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Engagement Buttons */}
            <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-100 dark:border-gray-700">
              <button 
                onClick={() => isAuthenticated && toggleLike(post._id)}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-full transition text-sm ${
                  liked 
                    ? 'text-pink-500' 
                    : 'text-gray-500 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20'
                }`}
                disabled={!isAuthenticated}
              >
                <svg className="w-4 h-4" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{likes}</span>
              </button>
              
              <Link to={`/post/${post._id}`} className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{post.commentCount || 0}</span>
              </Link>
              
              <FavoriteButton post={post} />
              
              <VisualStoryButton story={post} />
              
              {/* Share Button */}
              <div className="relative">
                <button 
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>{shares}</span>
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
      </div>
    </div>
  );
};

export default PostCard;