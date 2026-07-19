import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export default function VideoPlayer({ currentChannel }) {
  const videoRef = useRef(null);

  const renderName = (name) => {
    const match = name?.match(/^(.*?)\s*\((Server \d+)\)$/i);
    if (match) {
      return (
        <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {match[1]}
          <span className="server-badge" style={{ fontSize: '14px', padding: '4px 10px' }}>{match[2]}</span>
        </span>
      );
    }
    return name;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentChannel) return;

    let hls;

    if (Hls.isSupported()) {
      hls = new Hls({
        maxMaxBufferLength: 30,
        enableWorker: true,
      });
      hls.loadSource(currentChannel.url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(e => console.log('Autoplay prevented:', e));
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Fallback for Safari which has native HLS support
      video.src = currentChannel.url;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(e => console.log('Autoplay prevented:', e));
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [currentChannel]);

  if (!currentChannel) {
    return (
      <div className="player-container">
        <div className="video-wrapper glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Select a channel to start watching</p>
        </div>
      </div>
    );
  }

  return (
    <div className="player-container">
      <div className="video-wrapper">
        <video 
          ref={videoRef} 
          controls 
          autoPlay 
          style={{ width: '100%', height: '100%' }}
        />
        
        <div className="player-overlay">
          <div className="channel-info">
            <h2>{renderName(currentChannel?.name)}</h2>
            <p>
              <span className="live-badge">Live</span>
              {currentChannel.category}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
