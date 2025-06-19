'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function BottomThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 检查本地存储的主题偏好
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={toggleTheme}
        className="p-3 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-card transition-all duration-300 shadow-lg hover:shadow-xl group"
        title={isDark ? '切换到浅色主题' : '切换到深色主题'}
      >
        <div className="relative w-5 h-5">
          <Sun 
            className={`absolute inset-0 w-5 h-5 transition-all duration-500 ${
              isDark 
                ? 'opacity-0 rotate-180 scale-0' 
                : 'opacity-100 rotate-0 scale-100 text-amber-500'
            }`}
          />
          <Moon 
            className={`absolute inset-0 w-5 h-5 transition-all duration-500 ${
              isDark 
                ? 'opacity-100 rotate-0 scale-100 text-blue-400' 
                : 'opacity-0 -rotate-180 scale-0'
            }`}
          />
        </div>
      </button>
    </div>
  );
}