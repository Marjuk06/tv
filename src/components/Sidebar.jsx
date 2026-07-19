import React from 'react';
import { Tv, Home, Globe, Activity, Film, Music, BookOpen, Trophy, Newspaper, MonitorPlay } from 'lucide-react';
import MatchBanner from './MatchBanner';
import logo from '../assets/CodenestLIVE_TV_bg_removed.png';

const iconMap = {
  'All': Home,
  'News': Globe,
  'Sports': Activity,
  'Movies': Film,
  'Entertainment': Music,
  'Education': BookOpen,
  'Football World Cup 2026': Trophy,
  'Bangla News': Newspaper,
  'Bangla': MonitorPlay
};

export default function Sidebar({ categories, activeCategory, onSelectCategory }) {
  const renderNavItems = () => (
    categories.map(category => {
      const Icon = iconMap[category] || Tv;
      return (
        <div 
          key={category}
          className={`nav-item ${activeCategory === category ? 'active' : ''}`}
          onClick={() => onSelectCategory(category)}
        >
          <Icon size={20} />
          <span>{category === 'Football World Cup 2026' ? 'FIFA' : category}</span>
        </div>
      );
    })
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar hide-on-mobile">
        <div className="brand" style={{ paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'center' }}>
          <img src={logo} alt="Codenest Live TV" style={{ width: '100%', maxWidth: '120px', height: 'auto', objectFit: 'contain' }} />
        </div>

        <div className="nav-section" style={{ flex: 1, overflowY: 'auto' }}>
          <h3>Categories</h3>
          <nav>
            {renderNavItems()}
          </nav>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <MatchBanner />
        </div>
      </aside>

      {/* Mobile Top Header (Glassmorphic) */}
      <div className="mobile-header hide-on-desktop">
        <img src={logo} alt="Codenest Live TV" style={{ width: '100%', maxWidth: '120px', height: 'auto', objectFit: 'contain' }} />
      </div>

      {/* Mobile Bottom Nav */}
      <div className="mobile-nav-section hide-on-desktop">
        <nav>
          {renderNavItems()}
        </nav>
      </div>
    </>
  );
}
