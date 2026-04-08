import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

const BlogContext = createContext();

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) throw new Error('useBlog must be used within BlogProvider');
  return context;
};

export const BlogProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState({});
  const [likedStatus, setLikedStatus] = useState({});
  const [userId] = useState(() => localStorage.getItem('userId') || `user_${Date.now()}`);

  // Save userId
  useEffect(() => {
    localStorage.setItem('userId', userId);
  }, [userId]);

  // Check auth on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const loadedPosts = await api.getPosts();
      setPosts(loadedPosts);
      
      // Load liked status for each post
      const likedMap = {};
      for (const post of loadedPosts) {
        try {
          const { liked } = await api.getLikeStatus(post._id, userId);
          likedMap[post._id] = liked;
        } catch {
          likedMap[post._id] = false;
        }
      }
      setLikedStatus(likedMap);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (email, password) => {
    try {
      const data = await api.login(email, password);
      if (data.success) {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    api.logout();
    setIsAuthenticated(false);
  }, []);

  const addPost = useCallback(async (postData) => {
    try {
      const newPost = await api.createPost(postData);
      setPosts(prev => [newPost, ...prev]);
      return newPost;
    } catch (error) {
      console.error('Error adding post:', error);
      throw error;
    }
  }, []);

  const editPost = useCallback(async (id, updatedData) => {
    try {
      const updatedPost = await api.updatePost(id, updatedData);
      setPosts(prev => prev.map(post => post._id === id ? updatedPost : post));
    } catch (error) {
      console.error('Error editing post:', error);
      throw error;
    }
  }, []);

  const deletePost = useCallback(async (id) => {
    try {
      await api.deletePost(id);
      setPosts(prev => prev.filter(post => post._id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }, []);

  const toggleLike = useCallback(async (postId) => {
    try {
      const { liked } = await api.toggleLike(postId, userId);
      setLikedStatus(prev => ({ ...prev, [postId]: liked }));
      
      setPosts(prev => prev.map(post => 
        post._id === postId 
          ? { ...post, likes: liked ? (post.likes + 1) : (post.likes - 1) }
          : post
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  }, [userId]);

  const isPostLiked = useCallback((postId) => {
    return likedStatus[postId] || false;
  }, [likedStatus]);

  const getPostLikes = useCallback((postId) => {
    const post = posts.find(p => p._id === postId);
    return post?.likes || 0;
  }, [posts]);

  const addComment = useCallback(async (postId, commentData) => {
    try {
      const newComment = await api.addComment(postId, commentData.author, commentData.content);
      
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment]
      }));
      
      setPosts(prev => prev.map(post => 
        post._id === postId 
          ? { ...post, commentCount: (post.commentCount || 0) + 1 }
          : post
      ));
      
      return newComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }, []);

  const loadComments = useCallback(async (postId) => {
    try {
      const loadedComments = await api.getComments(postId);
      setComments(prev => ({ ...prev, [postId]: loadedComments }));
      return loadedComments;
    } catch (error) {
      console.error('Error loading comments:', error);
      return [];
    }
  }, []);

  const addShare = useCallback(async (postId) => {
    try {
      const { shares } = await api.trackShare(postId);
      setPosts(prev => prev.map(post => 
        post._id === postId ? { ...post, shares } : post
      ));
      return shares;
    } catch (error) {
      console.error('Error tracking share:', error);
    }
  }, []);

  const getPostShares = useCallback((postId) => {
    const post = posts.find(p => p._id === postId);
    return post?.shares || 0;
  }, [posts]);

  return (
    <BlogContext.Provider value={{
      posts,
      addPost,
      editPost,
      deletePost,
      isAuthenticated,
      login,
      logout,
      loading,
      comments,
      addComment,
      loadComments,
      toggleLike,
      isPostLiked,
      getPostLikes,
      addShare,
      getPostShares,
    }}>
      {children}
    </BlogContext.Provider>
  );
};