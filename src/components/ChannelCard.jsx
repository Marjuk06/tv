import React from 'react';
import { Play } from 'lucide-react';

export default function ChannelCard({ channel, isPlaying, onSelect }) {

  const renderName = (name) => {
    const match = name.match(/^(.*?)\s*\((Server \d+)\)$/i);
    if (match) {
      return (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {match[1]}
          <span className="server-badge">{match[2]}</span>
        </span>
      );
    }
    return name;
  };

  return (
    <div 
      className={`glass-card ${isPlaying ? 'active' : ''}`}
      onClick={() => onSelect(channel)}
    >
      <div className="channel-card-content">
        <div className="channel-logo-wrapper">
          <img src={channel.logo} alt={`${channel.name} logo`} />
          {isPlaying && (
            <div className="playing-indicator">
              Now Playing
            </div>
          )}
        </div>
        
        <div className="channel-meta">
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div className="channel-name-wrapper">
              <h4>{renderName(channel.name)}</h4>
            </div>
            <p>{channel.category}</p>
          </div>
          <div style={{
            background: 'var(--glass-bg)',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isPlaying ? 'var(--accent-primary)' : 'var(--text-secondary)'
          }}>
            <Play size={16} fill={isPlaying ? "var(--accent-primary)" : "none"} />
          </div>
        </div>
      </div>
    </div>
  );
}
