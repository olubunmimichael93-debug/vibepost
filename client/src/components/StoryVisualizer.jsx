import React, { useState, useRef, useEffect } from 'react';

const StoryVisualizer = ({ story, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);
  const [visualEffects, setVisualEffects] = useState([]);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [selectedTheme, setSelectedTheme] = useState('cinematic');
  
  // Free visual themes
  const themes = {
    cinematic: {
      bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      textColor: '#fff',
      accent: '#e94560',
      particleColor: '#e94560'
    },
    nostalgic: {
      bg: 'linear-gradient(135deg, #f5f0e6 0%, #e8e0d5 100%)',
      textColor: '#5d3a1a',
      accent: '#c4a27a',
      particleColor: '#c4a27a'
    },
    dramatic: {
      bg: 'linear-gradient(135deg, #0f0c29 0%, #302b63 100%)',
      textColor: '#fff',
      accent: '#ff6b6b',
      particleColor: '#ff6b6b'
    },
    dreamy: {
      bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      textColor: '#4a4e69',
      accent: '#f9a8d4',
      particleColor: '#f9a8d4'
    },
    afrobeat: {
      bg: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
      textColor: '#2D3047',
      accent: '#2D3047',
      particleColor: '#FFE66D'
    }
  };

  const currentTheme = themes[selectedTheme];

  // Animated particles (like floating emojis)
  useEffect(() => {
    if (!isPlaying) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create particles
    const particles = [];
    const emojis = ['✨', '⭐', '💫', '🌟', '🔥', '❤️', '🎭', '📖', '🎬', '🎨'];
    
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        speed: 1 + Math.random() * 3,
        size: 16 + Math.random() * 16
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.y -= p.speed;
        if (p.y < 0) p.y = canvas.height;
        
        ctx.font = `${p.size}px "Segoe UI Emoji"`;
        ctx.fillStyle = currentTheme.accent;
        ctx.fillText(p.emoji, p.x, p.y);
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isPlaying, currentTheme]);

  // Text-to-speech (FREE - built into browser)
  const speakText = (text) => {
    if (!window.speechSynthesis) {
      alert('Your browser does not support text-to-speech');
      return;
    }
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-NG'; // Nigerian English accent
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    
    // Try to get Nigerian voice if available
    const voices = window.speechSynthesis.getVoices();
    const nigerianVoice = voices.find(v => v.lang === 'en-NG');
    if (nigerianVoice) utterance.voice = nigerianVoice;
    
    window.speechSynthesis.speak(utterance);
  };

  const startVisualization = () => {
    setIsPlaying(true);
    const plainText = story.content.replace(/<[^>]*>/g, '');
    speakText(plainText);
  };

  const stopVisualization = () => {
    setIsPlaying(false);
    window.speechSynthesis.cancel();
  };

  // Download as video using MediaRecorder
  const downloadAsVideo = async () => {
    const canvas = canvasRef.current;
    const stream = canvas.captureStream(30);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm'
    });
    
    const chunks = [];
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${story.title}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    };
    
    mediaRecorder.start();
    
    // Record for 30 seconds or until story ends
    const plainText = story.content.replace(/<[^>]*>/g, '');
    const words = plainText.split(' ');
    const duration = Math.min(words.length * 0.5, 30); // Max 30 seconds
    
    setTimeout(() => {
      mediaRecorder.stop();
    }, duration * 1000);
    
    alert('Recording started! Video will download in ' + duration + ' seconds');
  };

  const plainText = story.content.replace(/<[^>]*>/g, '');
  const words = plainText.split(' ');
  const readingTime = Math.ceil(words.length / 200);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
              🎬 Story Visualizer
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Watch your story come to life with animated visuals
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
          >
            ✕
          </button>
        </div>

        {/* Canvas Visualization Area */}
        <div className="relative flex-1 min-h-[400px]">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ background: currentTheme.bg }}
          />
          
          {/* Story Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 max-w-2xl text-center">
              <h3 className="text-2xl font-bold text-white mb-3">{story.title}</h3>
              <p className="text-white/90 leading-relaxed text-sm line-clamp-4">
                {plainText}
              </p>
              <div className="mt-4 flex gap-2 justify-center flex-wrap">
                {story.tags?.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-white/20 rounded-full text-white text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          {/* Theme Selector */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              🎨 Visual Theme
            </label>
            <div className="flex gap-2 flex-wrap">
              {Object.keys(themes).map(theme => (
                <button
                  key={theme}
                  onClick={() => setSelectedTheme(theme)}
                  className={`px-3 py-1.5 rounded-full text-sm capitalize transition ${
                    selectedTheme === theme
                      ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 flex-wrap">
            {!isPlaying ? (
              <button
                onClick={startVisualization}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                <span>▶️</span>
                Start Visual Story
              </button>
            ) : (
              <button
                onClick={stopVisualization}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition flex items-center justify-center gap-2"
              >
                <span>⏹️</span>
                Stop
              </button>
            )}
            
            <button
              onClick={downloadAsVideo}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2"
            >
              <span>📹</span>
              Download as Video
            </button>
          </div>

          {/* Info */}
          <div className="mt-4 flex gap-4 justify-center text-xs text-gray-500">
            <span>📖 {words.length} words</span>
            <span>⏱️ {readingTime} min read</span>
            <span>🎨 {selectedTheme} theme</span>
            <span>🔊 Voice narration enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryVisualizer;