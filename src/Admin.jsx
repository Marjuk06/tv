import React, { useState, useEffect } from 'react';
import { Trash2, Plus, GripVertical, Pencil, Play, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import VideoPlayer from './components/VideoPlayer';
import LiveEvents from './components/LiveEvents';
import logo from './assets/CodenestLIVE_TV_bg_removed.png';
import { db, auth } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export default function Admin() {
  const [channels, setChannels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [lockedCategories, setLockedCategories] = useState([]);
  const [liveEvents, setLiveEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('channels');
  const [testChannel, setTestChannel] = useState(null);
  const [modalState, setModalState] = useState({ isOpen: false, type: null, data: null });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dataSnap, settingsSnap] = await Promise.all([
        getDoc(doc(db, "config", "data")),
        getDoc(doc(db, "config", "settings"))
      ]);
      
      const data = dataSnap.exists() ? dataSnap.data() : { channels: [], categories: [] };
      const settings = settingsSnap.exists() ? settingsSnap.data() : { lockedCategories: [] };
      
      setChannels(data.channels || []);
      setCategories(data.categories || []);
      setLiveEvents(data.liveEvents || []);
      setLockedCategories(settings.lockedCategories || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch data from Firestore. Check your database rules.");
      setLoading(false);
    }
  };

  const toggleCategoryLock = async (category) => {
    if (category === 'All') return;
    const newLocked = lockedCategories.includes(category) 
      ? lockedCategories.filter(c => c !== category)
      : [...lockedCategories, category];
      
    setLockedCategories(newLocked);
    
    try {
      await setDoc(doc(db, "config", "settings"), { lockedCategories: newLocked });
    } catch (err) {
      console.error(err);
      alert("Failed to update settings");
    }
  };

  const syncDataToFirestore = async (newChannels, newCategories, newLiveEvents) => {
    try {
      await setDoc(doc(db, "config", "data"), { 
        channels: newChannels || channels, 
        categories: newCategories || categories,
        liveEvents: newLiveEvents || liveEvents
      });
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to save changes to Firestore.");
    }
  };

  const deleteChannel = (id) => {
    if (!confirm('Are you sure you want to delete this channel?')) return;
    const newChannels = channels.filter(c => c.id !== id);
    syncDataToFirestore(newChannels);
  };

  const addChannel = () => {
    setModalState({ isOpen: true, type: 'ADD_CHANNEL', data: null });
  };

  const handleAddChannelSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const category = e.target.category.value;
    const url = e.target.url.value;
    if (!name || !url) return;
    
    const newChannel = { name, category, url, logo: '', id: Math.random().toString(36).substr(2, 10) };
    const newChannels = [...channels, newChannel];
    
    const newCategories = [...categories];
    if (!newCategories.includes(category)) {
      newCategories.push(category);
    }
    
    syncDataToFirestore(newChannels, newCategories);
    setModalState({ isOpen: false, type: null, data: null });
  };

  const editChannel = (channel) => {
    setModalState({ isOpen: true, type: 'EDIT_CHANNEL', data: channel });
  };

  const handleEditChannelSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const category = e.target.category.value;
    const url = e.target.url.value;
    if (!name || !url) return;
    
    const newChannels = channels.map(c => 
      c.id === modalState.data.id ? { ...c, name, category, url } : c
    );
    
    const newCategories = [...categories];
    if (!newCategories.includes(category)) {
      newCategories.push(category);
    }
    
    syncDataToFirestore(newChannels, newCategories);
    setModalState({ isOpen: false, type: null, data: null });
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

  const saveOrder = async () => {
    try {
      await setDoc(doc(db, "config", "data"), { 
        channels: channels, 
        categories: categories,
        liveEvents: liveEvents
      });
      alert('Order Saved!');
    } catch (err) {
      console.error(err);
      alert('Failed to save order');
    }
  };

  const addLiveEvent = () => {
    setModalState({ isOpen: true, type: 'ADD_LIVE', data: null });
  };

  const handleAddLiveEventSubmit = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const youtubeUrl = e.target.youtubeUrl.value;
    if (!title || !youtubeUrl) return;
    
    // Extract src if iframe is pasted
    let embedUrl = youtubeUrl;
    const iframeMatch = youtubeUrl.match(/src="([^"]+)"/);
    if (iframeMatch) {
      embedUrl = iframeMatch[1];
    } else {
      // If it's a regular URL, try to format it as embed
      const idMatch = youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^"&?\/\s]{11})/);
      if (idMatch && idMatch[1]) {
        try {
          const urlObj = new URL(youtubeUrl.startsWith('http') ? youtubeUrl : `https://${youtubeUrl}`);
          const si = urlObj.searchParams.get('si');
          embedUrl = `https://www.youtube.com/embed/${idMatch[1]}${si ? `?si=${si}` : ''}`;
        } catch(e) {
          embedUrl = `https://www.youtube.com/embed/${idMatch[1]}`;
        }
      } else if (!youtubeUrl.startsWith('http')) {
        embedUrl = `https://www.youtube.com/embed/${youtubeUrl}`;
      }
    }

    const newEvent = { id: Math.random().toString(36).substr(2, 10), title, embedUrl, active: true };
    const newLiveEvents = [...liveEvents, newEvent];
    syncDataToFirestore(null, null, newLiveEvents);
    setModalState({ isOpen: false, type: null, data: null });
  };

  const toggleLiveEvent = (id) => {
    const newLiveEvents = liveEvents.map(ev => ev.id === id ? { ...ev, active: !ev.active } : ev);
    syncDataToFirestore(null, null, newLiveEvents);
  };

  const deleteLiveEvent = (id) => {
    if (!confirm('Delete this live event?')) return;
    const newLiveEvents = liveEvents.filter(ev => ev.id !== id);
    syncDataToFirestore(null, null, newLiveEvents);
  };

  if (loading) return <div style={{ color: 'white', padding: 24 }}>Loading Admin...</div>;

  return (
    <div style={{ padding: 32, color: 'white', maxWidth: 1000, margin: '0 auto', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: '16px' }}>
        <img src={logo} alt="Codenest Admin Panel" style={{ height: 40, objectFit: 'contain' }} />
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/" style={{ color: 'var(--accent-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>← Back to TV</Link>
          
          {activeTab === 'channels' && (
            <>
              <button onClick={addChannel} style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={16} /> Add Channel
              </button>
              <button onClick={saveOrder} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>
                Save Order
              </button>
            </>
          )}

          {activeTab === 'live' && (
            <button onClick={addLiveEvent} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={16} /> Add YouTube Live
            </button>
          )}

          <button 
            onClick={() => signOut(auth).then(() => navigate('/login'))} 
            style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 16, borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 32 }}>
        <button 
          onClick={() => setActiveTab('channels')}
          style={{ 
            background: 'transparent', border: 'none', color: activeTab === 'channels' ? 'white' : 'var(--text-secondary)', 
            padding: '12px 24px', cursor: 'pointer', fontSize: 16, fontWeight: activeTab === 'channels' ? 600 : 400,
            borderBottom: activeTab === 'channels' ? '2px solid var(--accent-primary)' : '2px solid transparent'
          }}
        >
          Manage Channels
        </button>
        <button 
          onClick={() => setActiveTab('live')}
          style={{ 
            background: 'transparent', border: 'none', color: activeTab === 'live' ? 'white' : 'var(--text-secondary)', 
            padding: '12px 24px', cursor: 'pointer', fontSize: 16, fontWeight: activeTab === 'live' ? 600 : 400,
            borderBottom: activeTab === 'live' ? '2px solid #ef4444' : '2px solid transparent'
          }}
        >
          Manage YouTube Live
        </button>
      </div>

      {activeTab === 'channels' && (
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
      )}

      {activeTab === 'live' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          
          {/* Live Preview Section */}
          <div style={{ background: 'rgba(15, 15, 20, 0.95)', borderRadius: 16, border: '1px solid rgba(239, 68, 68, 0.3)', padding: 24, boxShadow: '0 10px 30px rgba(239, 68, 68, 0.1)' }}>
            <h3 style={{ margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: 8, color: '#fca5a5' }}>
              <Play size={20} /> Live App Preview
            </h3>
            <div style={{ background: 'black', borderRadius: 12, padding: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <LiveEvents events={liveEvents} />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 16, textAlign: 'center' }}>This is exactly what your users will see right now on the TV App.</p>
          </div>

          <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderRadius: 12, border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: 32, overflow: 'hidden' }}>
            <h3 style={{ padding: '16px 24px', margin: 0, background: 'rgba(239, 68, 68, 0.2)', borderBottom: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', gap: 8, color: '#fca5a5' }}>
              Manage Events List
            </h3>
            {liveEvents.length === 0 ? (
              <div style={{ padding: '24px', color: 'var(--text-secondary)' }}>No live events added yet.</div>
            ) : (
              liveEvents.map((ev) => (
                <div key={ev.id} style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: 'white' }}>{ev.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Embed: {ev.embedUrl || ev.youtubeId}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <button 
                      onClick={() => toggleLiveEvent(ev.id)}
                      style={{ background: ev.active ? '#10b981' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 20, fontSize: 13, cursor: 'pointer' }}
                    >
                      {ev.active ? 'Active' : 'Inactive'}
                    </button>
                    <button onClick={() => deleteLiveEvent(ev.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 8 }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'channels' && (
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
      )}

      {/* Floating Test Player (M3U8) */}
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
      
      {/* Custom Modal */}
      {modalState.isOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(15, 15, 20, 1)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16, padding: 32, width: '100%', maxWidth: 400,
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
          }}>
            <h2 style={{ margin: '0 0 24px 0', fontSize: 20 }}>
              {modalState.type === 'ADD_CHANNEL' && 'Add New Channel'}
              {modalState.type === 'EDIT_CHANNEL' && 'Edit Channel'}
              {modalState.type === 'ADD_LIVE' && 'Add YouTube Live'}
            </h2>
            
            <form onSubmit={
              modalState.type === 'ADD_CHANNEL' ? handleAddChannelSubmit :
              modalState.type === 'EDIT_CHANNEL' ? handleEditChannelSubmit :
              handleAddLiveEventSubmit
            }>
              
              {(modalState.type === 'ADD_CHANNEL' || modalState.type === 'EDIT_CHANNEL') && (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 8, color: 'var(--text-secondary)' }}>Channel Name</label>
                    <input name="name" defaultValue={modalState.data?.name || ''} required style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 8, color: 'var(--text-secondary)' }}>Category</label>
                    <input name="category" defaultValue={modalState.data?.category || ''} required style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', marginBottom: 8, color: 'var(--text-secondary)' }}>Stream URL (m3u8)</label>
                    <input name="url" defaultValue={modalState.data?.url || ''} required style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white', boxSizing: 'border-box' }} />
                  </div>
                </>
              )}

              {modalState.type === 'ADD_LIVE' && (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 8, color: 'var(--text-secondary)' }}>Event Title (e.g. Live Match)</label>
                    <input name="title" required style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', marginBottom: 8, color: 'var(--text-secondary)' }}>YouTube Iframe Code, URL, or ID</label>
                    <input name="youtubeUrl" required placeholder='<iframe src="..." />' style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white', boxSizing: 'border-box' }} />
                  </div>
                </>
              )}
              
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setModalState({ isOpen: false, type: null, data: null })} style={{ padding: '10px 20px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
