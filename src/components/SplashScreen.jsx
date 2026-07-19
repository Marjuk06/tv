import React, { useState, useEffect } from 'react';
import introVideo from '../assets/202607192153.mp4';

export default function SplashScreen({ onComplete }) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleVideoEnd = () => {
    if (isFadingOut) return;
    setIsFadingOut(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 500); // Wait for the fade-out CSS transition
  };

  useEffect(() => {
    // Force end the intro after 7 seconds
    const timer = setTimeout(() => {
      handleVideoEnd();
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`splash-screen ${isFadingOut ? 'fade-out' : ''}`} style={{ background: '#000' }}>
      <video 
        src={introVideo}
        autoPlay
        playsInline
        onEnded={handleVideoEnd}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
      <button 
        onClick={handleVideoEnd}
        style={{
          position: 'absolute',
          bottom: 32,
          right: 32,
          background: 'rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.4)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '8px',
          cursor: 'pointer',
          backdropFilter: 'blur(4px)'
        }}
      >
        Skip Intro
      </button>
    </div>
  );
}
