import React, { createContext, useContext, useState, useEffect } from 'react';

const HistoryContext = createContext();

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) throw new Error('useHistory must be used within HistoryProvider');
  return context;
};

export const HistoryProvider = ({ children }) => {
  const [readHistory, setReadHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [userId] = useState(() => {
    let id = localStorage.getItem('userId');
    if (!id) {
      id = 'user_' + Date.now();
      localStorage.setItem('userId', id);
    }
    return id;
  });

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(`readHistory_${userId}`);
    if (savedHistory) {
      setReadHistory(JSON.parse(savedHistory));
    }
    
    const savedFavorites = localStorage.getItem(`favorites_${userId}`);
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, [userId]);

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem(`readHistory_${userId}`, JSON.stringify(readHistory));
  }, [readHistory, userId]);

  useEffect(() => {
    localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
  }, [favorites, userId]);

  // Add a post to reading history (avoid duplicates)
  const addToHistory = (post) => {
    setReadHistory(prev => {
      // Remove if already exists
      const filtered = prev.filter(p => p._id !== post._id);
      // Add to front with timestamp
      return [{ ...post, readAt: new Date().toISOString() }, ...filtered];
    });
  };

  // Clear reading history
  const clearHistory = () => {
    setReadHistory([]);
  };

  // Toggle favorite
  const toggleFavorite = (post) => {
    setFavorites(prev => {
      const exists = prev.some(p => p._id === post._id);
      if (exists) {
        return prev.filter(p => p._id !== post._id);
      } else {
        return [{ ...post, favoritedAt: new Date().toISOString() }, ...prev];
      }
    });
  };

  // Check if post is favorited
  const isFavorite = (postId) => {
    return favorites.some(p => p._id === postId);
  };

  // Get favorite count
  const getFavoriteCount = () => favorites.length;

  // Get history count
  const getHistoryCount = () => readHistory.length;

  return (
    <HistoryContext.Provider value={{
      readHistory,
      favorites,
      addToHistory,
      clearHistory,
      toggleFavorite,
      isFavorite,
      getFavoriteCount,
      getHistoryCount
    }}>
      {children}
    </HistoryContext.Provider>
  );
};