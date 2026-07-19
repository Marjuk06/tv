import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import VideoPlayer from './components/VideoPlayer';
import ChannelList from './components/ChannelList';
import MatchBanner from './components/MatchBanner';
import LiveEvents from './components/LiveEvents';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Viewer() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [channels, setChannels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [lockedCategories, setLockedCategories] = useState([]);
  const [liveEvents, setLiveEvents] = useState([]);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDoc(doc(db, "config", "data")),
      getDoc(doc(db, "config", "settings"))
    ])
      .then(([dataSnap, settingsSnap]) => {
        const data = dataSnap.exists() ? dataSnap.data() : { channels: [], categories: [] };
        const settings = settingsSnap.exists() ? settingsSnap.data() : { lockedCategories: [] };
        
        const locked = settings.lockedCategories || [];
        setLockedCategories(locked);

        // Filter out locked categories
        const allowedCategories = (data.categories || []).filter(c => !locked.includes(c));
        const allowedChannels = (data.channels || []).filter(c => !locked.includes(c.category));

        setChannels(allowedChannels);
        setCategories(allowedCategories);
        setLiveEvents(data.liveEvents || []);
        
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
        {activeCategory === 'Live Events' ? (
          <div style={{ padding: 24 }}>
            <LiveEvents events={liveEvents} />
          </div>
        ) : (
          <>
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
          </>
        )}
      </main>
    </div>
  );
}
