import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import VideoPlayer from './components/VideoPlayer';
import ChannelList from './components/ChannelList';
import MatchBanner from './components/MatchBanner';

export default function Viewer() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [channels, setChannels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [lockedCategories, setLockedCategories] = useState([]);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/channels').then(r => r.json()),
      fetch('/api/settings').then(r => r.json())
    ])
      .then(([channelsData, settingsData]) => {
        const locked = settingsData.lockedCategories || [];
        setLockedCategories(locked);

        // Filter out locked categories
        const allowedCategories = channelsData.categories.filter(c => !locked.includes(c));
        const allowedChannels = channelsData.channels.filter(c => !locked.includes(c.category));

        setChannels(allowedChannels);
        setCategories(allowedCategories);
        
        if (allowedChannels.length > 0) {
          setCurrentChannel(allowedChannels[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ color: 'white', padding: 24 }}>Loading Live TV...</div>;

  return (
    <div className="app-container">
      <Sidebar 
        categories={categories} 
        activeCategory={activeCategory} 
        onSelectCategory={setActiveCategory} 
      />
      
      <main className="main-content">
        <VideoPlayer 
          currentChannel={currentChannel} 
        />
        <div className="hide-on-desktop" style={{ padding: '16px 16px 0' }}>
          <MatchBanner />
        </div>
        <ChannelList 
          channels={channels} 
          currentChannel={currentChannel} 
          onSelectChannel={setCurrentChannel}
          activeCategory={activeCategory}
        />
      </main>
    </div>
  );
}
