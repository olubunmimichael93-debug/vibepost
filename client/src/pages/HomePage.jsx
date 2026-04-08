import React, { useState, useMemo } from 'react';
import { useBlog } from '../context/BlogContext';
import PostList from '../components/PostList';
import SearchBar from '../components/SearchBar';
import TagFilter from '../components/TagFilter';
import CreatePostPrompt from '../components/CreatePostPrompt';

const HomePage = () => {
  const { posts } = useBlog();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set();
    posts.forEach(post => {
      post.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [posts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = searchTerm === '' || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesTag = !selectedTag || post.tags?.includes(selectedTag);
      
      return matchesSearch && matchesTag;
    });
  }, [posts, searchTerm, selectedTag]);

  return (
    <div>
      {/* Create Post Prompt */}
      <CreatePostPrompt />

      {/* Search and Filter */}
      <div className="mb-5 space-y-3">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        {allTags.length > 0 && (
          <TagFilter
            tags={allTags}
            selectedTag={selectedTag}
            onTagSelect={setSelectedTag}
          />
        )}
      </div>

      {/* Results Count */}
      <div className="mb-3">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
        </p>
      </div>

      {/* Posts Feed */}
      <PostList posts={filteredPosts} />
    </div>
  );
};

export default HomePage;