import React, { useState, useEffect } from 'react';
import { Trash2, Plus, GripVertical, Pencil, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import VideoPlayer from './components/VideoPlayer';
import logo from './assets/CodenestLIVE_TV_bg_removed.png';

export default function Admin() {
  const [channels, setChannels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [lockedCategories, setLockedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testChannel, setTestChannel] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    Promise.all([
      fetch('/api/channels').then(r => r.json()),
      fetch('/api/settings').then(r => r.json())
    ]).then(([channelsData, settingsData]) => {
      setChannels(channelsData.channels || []);
      setCategories(channelsData.categories || []);
      setLockedCategories(settingsData.lockedCategories || []);
      setLoading(false);
    });
  };

  const toggleCategoryLock = (category) => {
    if (category === 'All') return;
    const newLocked = lockedCategories.includes(category) 
      ? lockedCategories.filter(c => c !== category)
      : [...lockedCategories, category];
      
    setLockedCategories(newLocked);
    
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lockedCategories: newLocked })
    });
  };

  const deleteChannel = (id) => {
    if (!confirm('Are you sure you want to delete this channel?')) return;
    fetch(`/api/channels/${id}`, { method: 'DELETE' })
      .then(() => fetchData());
  };

  const addChannel = () => {
    const name = prompt('Channel Name:');
    const category = prompt('Category:');
    const url = prompt('Stream URL:');
    if (!name || !url) return;
    
    fetch('/api/channels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category, url, logo: '' })
    }).then(() => fetchData());
  };

  const editChannel = (channel) => {
    const name = prompt('Channel Name:', channel.name);
    if (name === null) return;
    const category = prompt('Category:', channel.category);
    if (category === null) return;
    const url = prompt('Stream URL:', channel.url);
    if (url === null) return;
    
    fetch(`/api/channels/${channel.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category, url })
    }).then(() => fetchData());
  };

  const moveChannelWithinCategory = (channelId, direction, catChannels) => {
    const localIdx = catChannels.findIndex(c => c.id === channelId);
    if (localIdx === -1) return;
    
    if (direction === 'up' && localIdx > 0) {
      swapChannels(catChannels[localIdx].id, catChannels[localIdx - 1].id);
    } else if (direction === 'down' && localIdx < catChannels.length - 1) {
      swapChannels(catChannels[localIdx].id, catChannels[localIdx + 1].id);
    }
  };

  const swapChannels = (id1, id2) => {
    const newChannels = [...channels];
    const idx1 = newChannels.findIndex(c => c.id === id1);
    const idx2 = newChannels.findIndex(c => c.id === id2);
    
    [newChannels[idx1], newChannels[idx2]] = [newChannels[idx2], newChannels[idx1]];
    setChannels(newChannels);
  };

  const saveOrder = () => {
    fetch('/api/channels/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: channels.map(c => c.id) })
    }).then(() => alert('Order Saved!'));
  };

  if (loading) return <div style={{ color: 'white', padding: 24 }}>Loading Admin...</div>;

  return (
    <div style={{ padding: 32, color: 'white', maxWidth: 1000, margin: '0 auto', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: '16px' }}>
        <img src={logo} alt="Codenest Admin Panel" style={{ height: 40, objectFit: 'contain' }} />
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/" style={{ color: 'var(--accent-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>← Back to TV</Link>
          <button onClick={addChannel} style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={16} /> Add Channel
          </button>
          <button onClick={saveOrder} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>
            Save Order
          </button>
        </div>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', padding: 24, marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, marginBottom: 16 }}>Category Manager (Lock/Unlock)</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {categories.filter(c => c !== 'All').map(cat => {
            const isLocked = lockedCategories.includes(cat);
            return (
              <button 
                key={cat} 
                onClick={() => toggleCategoryLock(cat)}
                style={{
                  background: isLocked ? 'rgba(255, 255, 255, 0.1)' : 'var(--accent-primary)',
                  color: isLocked ? 'var(--text-secondary)' : 'white',
                  border: isLocked ? '1px dashed rgba(255,255,255,0.2)' : '1px solid var(--accent-primary)',
                  padding: '8px 16px', borderRadius: 20, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8
                }}
              >
                {isLocked ? '🔒' : '🔓'} {cat}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {categories.filter(c => c !== 'All').map(cat => {
            const catChannels = channels.filter(c => c.category === cat);
            if (catChannels.length === 0) return null;
            
            return (
              <div key={cat} style={{ background: 'rgba(0,0,0,0.5)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', marginBottom: 24, overflow: 'hidden' }}>
                <h3 style={{ padding: '16px 24px', margin: 0, background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  {cat}
                </h3>
                {catChannels.map((channel) => (
                  <div key={channel.id} style={{ display: 'flex', alignItems: 'center', padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: testChannel?.id === channel.id ? 'rgba(99, 102, 241, 0.15)' : 'transparent' }}>
                    <GripVertical size={16} color="var(--text-secondary)" style={{ cursor: 'grab', marginRight: 16 }} />
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginRight: 16 }}>
                      <button onClick={() => moveChannelWithinCategory(channel.id, 'up', catChannels)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: 0 }}>▲</button>
                      <button onClick={() => moveChannelWithinCategory(channel.id, 'down', catChannels)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: 0 }}>▼</button>
                    </div>

                    {channel.logo && <img src={channel.logo} style={{ width: 40, height: 40, objectFit: 'contain', marginRight: 16, borderRadius: 4 }} />}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600 }}>{channel.name}</div>
                    </div>
                    
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginRight: 24, width: '30%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {channel.url}
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => setTestChannel(channel)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', padding: '6px 12px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Play size={14} /> Test
                      </button>
                      <button onClick={() => editChannel(channel)} style={{ background: 'transparent', border: 'none', color: '#60a5fa', cursor: 'pointer', padding: 8 }}>
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => deleteChannel(channel.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 8 }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
      </div>

      {/* Floating Test Player */}
      <div style={{ 
        width: 360, 
        position: 'fixed', 
        bottom: 32, 
        right: 32, 
        zIndex: 100,
        background: 'rgba(15, 15, 20, 0.95)',
        backdropFilter: 'blur(16px)',
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        display: testChannel ? 'block' : 'none',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ background: 'black', borderTopLeftRadius: 16, borderTopRightRadius: 16, overflow: 'hidden', aspectRatio: '16/9' }}>
          <VideoPlayer currentChannel={testChannel} />
        </div>
        <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ minWidth: 0, flex: 1, marginRight: 16 }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{testChannel?.name}</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{testChannel?.category}</p>
          </div>
          <button 
            onClick={() => setTestChannel(null)} 
            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
