import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BlogProvider, useBlog } from './context/BlogContext';
import { ThemeProvider } from './context/ThemeContext';
import { HistoryProvider } from './context/HistoryContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import AdminDashboard from './pages/AdminDashboard';
import PostFormPage from './pages/PostFormPage';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import FavoritesPage from './pages/FavoritesPage';
import TikTokButton from './components/TikTokButton'; // ADD THIS

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useBlog();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-2xl">✨ Loading...</div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/new" element={<ProtectedRoute><PostFormPage /></ProtectedRoute>} />
          <Route path="/admin/edit/:id" element={<ProtectedRoute><PostFormPage /></ProtectedRoute>} />
        </Routes>
      </main>
      <TikTokButton /> {/* ADD THIS */}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <BlogProvider>
          <HistoryProvider>
            <AppContent />
          </HistoryProvider>
        </BlogProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;