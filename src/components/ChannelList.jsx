import React from 'react';
import ChannelCard from './ChannelCard';

export default function ChannelList({ channels, currentChannel, onSelectChannel, activeCategory }) {
  const filteredChannels = activeCategory === 'All' 
    ? channels 
    : channels.filter(c => c.category === activeCategory);

  return (
    <div className="channels-section">
      <div className="section-header">
        <h2>{activeCategory === 'All' ? 'Live Channels' : `${activeCategory} Channels`}</h2>
        <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          {filteredChannels.length} channels
        </span>
      </div>
      
      <div className="channels-grid">
        {filteredChannels.map(channel => (
          <ChannelCard 
            key={channel.id} 
            channel={channel} 
            isPlaying={currentChannel?.id === channel.id}
            onSelect={onSelectChannel}
          />
        ))}
      </div>
      
      {filteredChannels.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
          <p>No channels available in this category.</p>
        </div>
      )}
    </div>
  );
}
