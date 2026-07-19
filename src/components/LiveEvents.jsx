import React from 'react';
import { Radio } from 'lucide-react';

export default function LiveEvents({ events }) {
  const activeEvents = events.filter(e => e.active);

  if (activeEvents.length === 0) {
    return (
      <div className="empty-state" style={{ 
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height: '60vh', textAlign: 'center', color: 'var(--text-secondary)'
      }}>
        <Radio size={48} color="rgba(255,255,255,0.1)" style={{ marginBottom: 16 }} />
        <h2>No Live Events Right Now</h2>
        <p>Check back later for special live streams and matches.</p>
      </div>
    );
  }

  return (
    <div className="live-events-container">
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <h2 style={{ fontSize: 24, margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Radio color="#ef4444" /> Live Broadcasting Now
        </h2>
        <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '4px 12px', borderRadius: 16, fontSize: 12, fontWeight: 600, animation: 'pulse 2s infinite' }}>
          {activeEvents.length} EVENT{activeEvents.length > 1 ? 'S' : ''}
        </div>
      </div>

      {activeEvents.length === 1 ? (
        // Single Event Layout (Large Player)
        <div className="single-live-event" style={{
          background: 'rgba(15, 15, 20, 0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
        }}>
          <div style={{ width: '100%', aspectRatio: '16/9', background: 'black' }}>
            <iframe
              width="100%"
              height="100%"
              src={activeEvents[0].embedUrl ? `${activeEvents[0].embedUrl}${activeEvents[0].embedUrl.includes('?') ? '&' : '?'}autoplay=1` : `https://www.youtube.com/embed/${activeEvents[0].youtubeId}?autoplay=1`}
              title={activeEvents[0].title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
          <div style={{ padding: 24 }}>
            <h3 style={{ margin: 0, fontSize: 20, color: 'white' }}>{activeEvents[0].title}</h3>
            <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0' }}>Official Live Stream</p>
          </div>
        </div>
      ) : (
        // Grid Layout for multiple events
        <div className="channel-grid">
          {activeEvents.map(ev => (
            <div key={ev.id} className="live-event-card" style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: 16,
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ width: '100%', aspectRatio: '16/9', background: 'black' }}>
                <iframe
                  width="100%"
                  height="100%"
                  src={ev.embedUrl ? `${ev.embedUrl}${ev.embedUrl.includes('?') ? '&' : '?'}autoplay=0` : `https://www.youtube.com/embed/${ev.youtubeId}?autoplay=0`}
                  title={ev.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
              <div style={{ padding: 16 }}>
                <h4 style={{ margin: 0, color: 'white', fontSize: 16 }}>{ev.title}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 12, color: '#ef4444' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'pulse 2s infinite' }}></span>
                  LIVE
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
