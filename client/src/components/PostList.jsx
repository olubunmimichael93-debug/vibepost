import React from 'react';
import PostCard from './PostCard';

const PostList = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">✨</div>
        <p className="text-gray-500 dark:text-gray-400">No posts yet. Be the first to share a vibe!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostList;