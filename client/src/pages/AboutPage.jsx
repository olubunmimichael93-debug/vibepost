import React from 'react';

const AboutPage = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">✨</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            About VibePost
          </h1>
          <div className="w-12 h-0.5 bg-gradient-to-r from-pink-500 to-orange-500 mx-auto mt-2"></div>
        </div>

        <div className="space-y-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          <p>
            Welcome to <span className="font-bold text-pink-500">VibePost</span> - your digital space to share vibes, connect with others, and express yourself freely!
          </p>

          <p>
            This platform was built with ❤️ as a full-stack web application using modern technologies:
          </p>

          <ul className="list-disc pl-5 space-y-1">
            <li>⚛️ <strong>React</strong> - Frontend framework</li>
            <li>🎨 <strong>Tailwind CSS</strong> - Styling</li>
            <li>🚀 <strong>Node.js & Express</strong> - Backend API</li>
            <li>🍃 <strong>MongoDB Atlas</strong> - Cloud database</li>
            <li>🔐 <strong>JWT</strong> - Authentication</li>
          </ul>

          <p>
            Whether you are here to share memes, stories, or just drop a random thought, 
            VibePost is your space to be yourself. Like, comment, and share the vibes!
          </p>

          <div className="bg-gradient-to-r from-pink-50 to-orange-50 dark:from-pink-900/20 dark:to-orange-900/20 rounded-xl p-4 text-center mt-4">
            <p className="text-pink-600 dark:text-pink-400 font-medium">✨ Drop a vibe, spread good energy! ✨</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;