import React, { useState, useEffect } from 'react';
import { useBlog } from '../context/BlogContext';
import { formatRelativeDate } from '../utils/helpers';

const CommentSection = ({ postId }) => {
  const { comments, addComment, loadComments, isAuthenticated } = useBlog();
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const postComments = comments[postId] || [];

  const emojis = ['😊', '😂', '❤️', '🔥', '🥺', '💀', '✨', '👏', '🙌', '😭', '🤡', '💅', '👀', '🗿', '🍿'];

  useEffect(() => {
    loadComments(postId);
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    const commenterName = name.trim() || 'Anonymous Vibe Seeker';
    
    setIsSubmitting(true);
    
    try {
      await addComment(postId, {
        author: commenterName,
        content: content,
      });
      
      setName('');
      setContent('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addEmoji = (emoji) => {
    setContent(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden mt-4">
      <div className="p-5">
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          💬 Comments
          <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
            {postComments.length}
          </span>
        </h3>

        {/* Comment Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          {!isAuthenticated && (
            <div className="mb-3">
              <input
                type="text"
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          )}
          
          <div className="relative">
            <textarea
              placeholder="Drop a comment... 💬"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="2"
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
              required
              disabled={isSubmitting}
            />
            
            <div className="absolute bottom-2 right-2 flex gap-1">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                😊
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 text-white text-xs font-medium hover:opacity-90 disabled:opacity-50 transition"
              >
                {isSubmitting ? '...' : 'Post'}
              </button>
            </div>
            
            {showEmojiPicker && (
              <div className="absolute bottom-full mb-2 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-2 grid grid-cols-7 gap-1 max-w-[200px]">
                {emojis.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => addEmoji(emoji)}
                    className="text-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {postComments.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-3xl mb-2">💭</div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No comments yet. Be the first to drop a vibe! ✨
              </p>
            </div>
          ) : (
            postComments.map((comment) => (
              <div
                key={comment._id}
                className="flex space-x-2 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-pink-400 to-orange-400 flex items-center justify-center text-white text-xs font-bold">
                  {comment.author[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-gray-900 dark:text-white text-xs">
                      {comment.author}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatRelativeDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;